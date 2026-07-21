import React, { useState, useEffect } from "react";
import { HackathonConfig, Registration, FaqItem, TimelineEvent } from "../types";
import { 
  Settings, Save, Filter, Download, Mail, Send, CheckCircle, 
  XCircle, Calendar, Plus, Trash, Clock, HelpCircle, ArrowLeft, RefreshCw, Layers,
  Lock, LogOut, MapPin
} from "lucide-react";

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export default function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  // Authentication states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("bincom_admin_token"));

  const [config, setConfig] = useState<any>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Test Email States
  const [testTo, setTestTo] = useState<string>("");
  const [testSubject, setTestSubject] = useState<string>("Test Email from Bincom");
  const [testBody, setTestBody] = useState<string>("<h3>Hello!</h3><p>This is a successful test email.</p>");
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<string>("");

  // Template Email Test States
  const [testModal, setTestModal] = useState<{ isOpen: boolean; type: "welcome" | "reminder" | null; email: string }>({
    isOpen: false,
    type: null,
    email: ""
  });
  const [isSendingTemplateTest, setIsSendingTemplateTest] = useState<boolean>(false);

  // Cron Trigger States
  const [isTriggeringReminders, setIsTriggeringReminders] = useState<boolean>(false);
  const [cronLogs, setCronLogs] = useState<string>("");

  // Active sub-tab state (settings, registrations, emails, faqs/timeline, locations)
  const [activeTab, setActiveTab] = useState<"settings" | "registrations" | "emails" | "faqs-timeline" | "locations">("settings");

  // Logo & Flyer Upload States
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [isUploadingFlyer, setIsUploadingFlyer] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.token) {
        localStorage.setItem("bincom_admin_token", data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError(data?.error || "Invalid username or password");
      }
    } catch (err: any) {
      console.error("Login request failed:", err);
      setLoginError("Failed to connect to the authentication server. If you are inside the AI Studio iframe, please click the 'Open in new tab' button at the top-right of your preview window and log in there.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bincom_admin_token");
    setIsLoggedIn(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Logo must be smaller than 5MB");
      return;
    }

    setIsUploadingLogo(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem("bincom_admin_token");
        if (!token) {
          handleLogout();
          return;
        }
        const base64Data = reader.result as string;
        const response = await fetch("/api/upload-flyer", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64Data, fileName: `logo_${Date.now()}_${file.name}` }),
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        const resText = await response.text();
        if (!response.ok) {
          let errMsg = `Logo upload failed (Status: ${response.status})`;
          try {
            const errData = JSON.parse(resText);
            errMsg = errData.error || errMsg;
          } catch (e) {
            if (resText && resText.length > 0) {
              errMsg = `${errMsg}: ${resText.slice(0, 150)}`;
            }
          }
          throw new Error(errMsg);
        }

        let data;
        try {
          data = JSON.parse(resText);
        } catch (jsonErr) {
          throw new Error(`Server returned an invalid response (Status: ${response.status}). The image might be too large or of an unsupported format. Response preview: ${resText.slice(0, 150)}`);
        }

        setConfig((prev: any) => ({ ...prev, logoUrl: data.url }));
        setStatus({ type: "success", message: "Logo uploaded successfully! Save settings to apply." });
      } catch (err: any) {
        alert(err.message || "Failed to upload logo.");
      } finally {
        setIsUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFlyerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Flyer image must be smaller than 10MB");
      return;
    }

    setIsUploadingFlyer(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem("bincom_admin_token");
        if (!token) {
          handleLogout();
          return;
        }
        const base64Data = reader.result as string;
        const response = await fetch("/api/upload-flyer", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64Data, fileName: `flyer_${Date.now()}_${file.name}` }),
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        const resText = await response.text();
        if (!response.ok) {
          let errMsg = `Flyer upload failed (Status: ${response.status})`;
          try {
            const errData = JSON.parse(resText);
            errMsg = errData.error || errMsg;
          } catch (e) {
            if (resText && resText.length > 0) {
              errMsg = `${errMsg}: ${resText.slice(0, 150)}`;
            }
          }
          throw new Error(errMsg);
        }

        let data;
        try {
          data = JSON.parse(resText);
        } catch (jsonErr) {
          throw new Error(`Server returned an invalid response (Status: ${response.status}). The image might be too large or of an unsupported format. Response preview: ${resText.slice(0, 150)}`);
        }

        setConfig((prev: any) => ({ ...prev, flyerImageUrl: data.url, flyerType: "image" }));
        setStatus({ type: "success", message: "Flyer uploaded successfully! Save settings to apply." });
      } catch (err: any) {
        alert(err.message || "Failed to upload flyer.");
      } finally {
        setIsUploadingFlyer(false);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [roleFilter, isLoggedIn]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch live config settings
      const configRes = await fetch("/api/hackathon");
      if (configRes.ok) {
        const data = await configRes.json();
        // Ensure defaults for dynamic structures
        setConfig({
          ...data,
          faqs: data.faqs || [],
          timeline: data.timeline || [],
          locations: data.locations || []
        });
      }

      // 2. Fetch registrations list with role query filter
      const token = localStorage.getItem("bincom_admin_token");
      if (!token) {
        handleLogout();
        return;
      }
      const regRes = await fetch(`/api/admin/registrations?role=${roleFilter}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (regRes.status === 401) {
        handleLogout();
        return;
      }
      if (regRes.ok) {
        const data = await regRes.json();
        setRegistrations(data);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
      setStatus({ type: "error", message: "Failed to retrieve live data from server." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!config) return;
    setIsSaving(true);
    setStatus(null);

    try {
      const token = localStorage.getItem("bincom_admin_token");
      if (!token) {
        handleLogout();
        return;
      }
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(config),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setStatus({ type: "success", message: "Hackathon settings updated successfully!" });
      } else {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update configurations");
      }
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", message: err.message || "An error occurred while saving." });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to handle general string changes
  const handleChange = (field: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  // Dynamic FAQs Editor helpers
  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    setConfig((prev: any) => {
      const updatedFaqs = [...prev.faqs];
      updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const handleAddFaq = () => {
    setConfig((prev: any) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "New Question?", answer: "New Answer text." }]
    }));
  };

  const handleRemoveFaq = (index: number) => {
    setConfig((prev: any) => ({
      ...prev,
      faqs: prev.faqs.filter((_: any, idx: number) => idx !== index)
    }));
  };

  // Dynamic Timeline Editor helpers
  const handleTimelineChange = (index: number, field: string, value: any) => {
    setConfig((prev: any) => {
      const updatedTimeline = [...prev.timeline];
      updatedTimeline[index] = { ...updatedTimeline[index], [field]: value };
      return { ...prev, timeline: updatedTimeline };
    });
  };

  const handleAddTimelineEvent = () => {
    setConfig((prev: any) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        {
          id: `t_${Date.now()}`,
          title: "New Event Title",
          date: "Date format string",
          description: "Brief event description details.",
          highlighted: false
        }
      ]
    }));
  };

  const handleRemoveTimelineEvent = (index: number) => {
    setConfig((prev: any) => ({
      ...prev,
      timeline: prev.timeline.filter((_: any, idx: number) => idx !== index)
    }));
  };

  // Send test email manually via Resend api
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTo) {
      setTestStatus("Please specify a recipient email.");
      return;
    }

    setIsSendingTest(true);
    setTestStatus("Sending test email via Resend API...");

    try {
      const token = localStorage.getItem("bincom_admin_token");
      if (!token) {
        handleLogout();
        return;
      }
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ to: testTo, subject: testSubject, html: testBody }),
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setTestStatus("✅ Test email sent successfully! Check your inbox.");
      } else {
        setTestStatus(`❌ Failed to send: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setTestStatus(`❌ Connection error: ${err.message || String(err)}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  // Submit test email for Welcome/Reminder templates
  const handleTestTemplateEmailSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testModal.email) {
      alert("Please specify a recipient email.");
      return;
    }

    setIsSendingTemplateTest(true);
    setStatus(null);

    try {
      const token = localStorage.getItem("bincom_admin_token");
      if (!token) {
        handleLogout();
        return;
      }
      const res = await fetch("/api/admin/test-template-email", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: testModal.email, type: testModal.type }),
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: `Test ${testModal.type} email sent successfully!` });
        setTestModal({ isOpen: false, type: null, email: "" });
      } else {
        setStatus({ type: "error", message: `Failed to send test email: ${data.error || "Unknown error"}` });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: `Connection error: ${err.message || String(err)}` });
    } finally {
      setIsSendingTemplateTest(false);
    }
  };

  // Manual cron trigger check
  const handleTriggerReminders = async () => {
    setIsTriggeringReminders(true);
    setCronLogs("Invoking automated schedule check in backend...");

    try {
      const token = localStorage.getItem("bincom_admin_token");
      if (!token) {
        handleLogout();
        return;
      }
      const res = await fetch("/api/admin/trigger-reminders", { 
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setCronLogs(
          `✅ Execution Success!\n\n` +
          `Message: ${data.message}\n` +
          `Days calculated until start: ${data.days ?? "N/A"}\n` +
          `Notification Emails Dispatched: ${data.sent ?? 0}\n` +
          `Delivery Failures: ${data.failed ?? 0}`
        );
      } else {
        setCronLogs(`❌ Backend Trigger Failed: ${data.error || "Server Error"}`);
      }
    } catch (err: any) {
      setCronLogs(`❌ Failed to communicate with trigger route: ${err.message}`);
    } finally {
      setIsTriggeringReminders(false);
    }
  };

  // Dynamic Locations Editor helpers
  const handleLocationChange = (index: number, field: string, value: any) => {
    setConfig((prev: any) => {
      const updatedLocations = [...(prev.locations || [])];
      updatedLocations[index] = { ...updatedLocations[index], [field]: value };
      return { ...prev, locations: updatedLocations };
    });
  };

  const handleAddLocation = () => {
    setConfig((prev: any) => ({
      ...prev,
      locations: [
        ...(prev.locations || []),
        { name: "New Hub", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" }
      ]
    }));
  };

  const handleRemoveLocation = (index: number) => {
    setConfig((prev: any) => ({
      ...prev,
      locations: (prev.locations || []).filter((_: any, idx: number) => idx !== index)
    }));
  };

  // Export to CSV spreadsheet
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("No registered users match your active filter.");
      return;
    }

    const headers = ["ID", "Full Name", "Email Address", "Phone Number", "Assigned Role", "LinkedIn URL", "Registered Date/Time"];
    const rows = registrations.map((r) => [
      r.id,
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.email,
      r.phone,
      r.role,
      r.linkedinUrl,
      r.registeredAt,
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hackathon_registrations_${roleFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-lime-400 selection:text-slate-950">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 to-emerald-500" />
          
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-lime-400/10 text-lime-400 p-3.5 rounded-2xl border border-lime-400/20 mb-2">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="font-display font-black text-2xl tracking-tight text-white uppercase">
              ADMINISTRATIVE SIGN-IN
            </h2>
            <p className="text-xs text-slate-400 max-w-xs">
              Access is restricted. Please sign in to verify your administrative credentials and manage the hackathon parameters.
            </p>
          </div>

          <div className="p-3.5 bg-lime-400/5 border border-lime-400/25 rounded-2xl text-[11px] text-lime-400 leading-normal">
            <p className="font-semibold mb-1">💡 Iframe Preview Notice:</p>
            Some modern browsers block authentication requests/cookies inside embedded iframes. If login fails, please open the app in a <strong>new tab</strong> using the button at the top-right of your preview window and sign in there.
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-medium text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-display font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Verify & Continue
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-500 hover:text-slate-300 font-mono tracking-tight transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to public portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
        <RefreshCw className="w-10 h-10 text-lime-400 animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest text-slate-400 uppercase">
          {isLoading ? "Loading configuration..." : "Failed to load settings. Retrying..."}
        </p>
        {!isLoading && (
          <button 
            onClick={fetchData} 
            className="mt-4 px-4 py-2 bg-lime-400 text-slate-950 rounded-xl font-bold font-display text-xs cursor-pointer"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-lime-400 selection:text-slate-950">
      
      {/* Top Admin Branding Bar */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-lime-400 text-slate-950 p-2 rounded-xl">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl tracking-tight leading-none text-white uppercase">
              HACKATHON ADMIN PORTAL
            </h1>
            <p className="text-[11px] font-mono text-lime-400 uppercase tracking-widest mt-1">
              Connected: Firestore & Resend API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-950/30 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 font-display font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-rose-900/40"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
          <button 
            onClick={onBackToSite}
            className="flex items-center gap-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-display font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Landing Page
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Global Feedback Banner */}
        {status && (
          <div className={`p-4 mb-6 rounded-2xl border flex items-start gap-3 transition-all ${
            status.type === "success" 
              ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-300" 
              : "bg-rose-950/50 border-rose-500/30 text-rose-300"
          }`}>
            {status.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              {status.message}
            </div>
          </div>
        )}

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto scrollbar-none gap-2">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-3.5 font-display font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "settings"
                ? "border-lime-400 text-lime-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Hackathon Dates & Info
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-5 py-3.5 font-display font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "registrations"
                ? "border-lime-400 text-lime-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Registrations ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab("emails")}
            className={`px-5 py-3.5 font-display font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "emails"
                ? "border-lime-400 text-lime-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Email Templates & Triggers
          </button>
          <button
            onClick={() => setActiveTab("faqs-timeline")}
            className={`px-5 py-3.5 font-display font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "faqs-timeline"
                ? "border-lime-400 text-lime-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            FAQs & Timeline Scheduling
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`px-5 py-3.5 font-display font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "locations"
                ? "border-lime-400 text-lime-400 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Custom Locations
          </button>
        </div>

        {/* Tab Content Components */}
        {config && (
          <div className="grid grid-cols-1 gap-8">
            
            {/* TAB 1: GENERAL DATES AND HACKATHON INFO */}
            {activeTab === "settings" && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">
                    Primary Event Configurations
                  </h3>
                  <p className="text-xs text-slate-400">Manage critical dates, names, URLs, and subtitles saved in Firestore.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Hackathon Title</label>
                    <input
                      type="text"
                      value={config.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Theme Heading</label>
                    <input
                      type="text"
                      value={config.theme || ""}
                      onChange={(e) => handleChange("theme", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Edition Version</label>
                    <input
                      type="text"
                      value={config.edition || ""}
                      onChange={(e) => handleChange("edition", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Start Date (ISO Math format: YYYY-MM-DD)</label>
                    <input
                      type="date"
                      value={config.startDate || ""}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Start Date Display Text (e.g. Saturday 20th June, 2026)</label>
                    <input
                      type="text"
                      value={config.startDateFormatted || ""}
                      placeholder="e.g. Saturday, Sept 19th, 2026"
                      onChange={(e) => handleChange("startDateFormatted", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Start Time</label>
                    <input
                      type="text"
                      value={config.startTime || ""}
                      onChange={(e) => handleChange("startTime", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">End Date (ISO Math format: YYYY-MM-DD)</label>
                    <input
                      type="date"
                      value={config.endDate || ""}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">End Date Display Text</label>
                    <input
                      type="text"
                      value={config.endDateFormatted || ""}
                      placeholder="e.g. Sunday, Sept 20th, 2026"
                      onChange={(e) => handleChange("endDateFormatted", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">End Time</label>
                    <input
                      type="text"
                      value={config.endTime || ""}
                      onChange={(e) => handleChange("endTime", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Portal Registration Slug URL</label>
                    <input
                      type="text"
                      value={config.registrationUrl || ""}
                      onChange={(e) => handleChange("registrationUrl", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Physical Notice Hub events link</label>
                    <input
                      type="text"
                      value={config.physicalNoticeUrl || ""}
                      onChange={(e) => handleChange("physicalNoticeUrl", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Virtual Event Launch URL</label>
                    <input
                      type="text"
                      value={config.virtualUrl || ""}
                      onChange={(e) => handleChange("virtualUrl", e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Hackathon Subtitle Description</label>
                  <textarea
                    rows={2}
                    value={config.subtitle || ""}
                    onChange={(e) => handleChange("subtitle", e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium resize-none"
                  />
                </div>

                {/* Logo & Flyer Customization */}
                <div className="border-t border-slate-800 pt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-display font-bold text-white uppercase tracking-tight">Logo & Flyer Upload Settings</h4>
                    <p className="text-[11px] text-slate-400">Configure your branding logo and standard/digital interactive flyer graphics.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Section */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                      <h5 className="text-xs font-mono text-lime-400 uppercase tracking-widest">Hackathon Branding Logo</h5>
                      <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <div className="w-16 h-16 shrink-0 rounded bg-slate-950 flex items-center justify-center border border-slate-850 p-1">
                          {config.logoUrl ? (
                            <img src={config.logoUrl} alt="Logo Preview" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500 uppercase">No Logo</span>
                          )}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <label className="text-[10px] font-mono text-slate-400 block uppercase">Upload Logo File</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload-input"
                            disabled={isUploadingLogo}
                          />
                          <label
                            htmlFor="logo-upload-input"
                            className="inline-block bg-slate-800 hover:bg-slate-750 text-white font-display font-bold text-[10px] uppercase px-4 py-2 rounded-xl border border-slate-700 cursor-pointer transition-all"
                          >
                            {isUploadingLogo ? "Uploading..." : "Select File"}
                          </label>
                          <p className="text-[9px] text-slate-500">Supports PNG, SVG, JPG up to 5MB.</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Logo Image URL</label>
                        <input
                          type="text"
                          value={config.logoUrl || ""}
                          onChange={(e) => handleChange("logoUrl", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-mono"
                          placeholder="/logo.png"
                        />
                      </div>
                    </div>

                    {/* Flyer Section */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                      <h5 className="text-xs font-mono text-lime-400 uppercase tracking-widest">Flyer Poster Settings</h5>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Flyer Presentation Mode</label>
                        <select
                          value={config.flyerType || "html"}
                          onChange={(e) => handleChange("flyerType", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-bold"
                        >
                          <option value="html">Interactive Custom HTML Flyer</option>
                          <option value="image">Static Image/Poster File</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-850">
                          {config.flyerImageUrl ? (
                            <img src={config.flyerImageUrl} alt="Flyer Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500 uppercase">No Flyer</span>
                          )}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <label className="text-[10px] font-mono text-slate-400 block uppercase">Upload Poster File</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFlyerUpload}
                            className="hidden"
                            id="flyer-upload-input"
                            disabled={isUploadingFlyer}
                          />
                          <label
                            htmlFor="flyer-upload-input"
                            className="inline-block bg-slate-800 hover:bg-slate-750 text-white font-display font-bold text-[10px] uppercase px-4 py-2 rounded-xl border border-slate-700 cursor-pointer transition-all"
                          >
                            {isUploadingFlyer ? "Uploading..." : "Select File"}
                          </label>
                          <p className="text-[9px] text-slate-500">Supports PNG, WEBP, JPG up to 10MB.</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Flyer Image/Poster URL</label>
                        <input
                          type="text"
                          value={config.flyerImageUrl || ""}
                          onChange={(e) => handleChange("flyerImageUrl", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-mono"
                          placeholder="/bincom_hackathon_flyer.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Community Links Sub-editor */}
                <div className="border-t border-slate-800 pt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-display font-bold text-white uppercase tracking-tight">Social & External Community Links</h4>
                    <p className="text-[11px] text-slate-400">Ensure participants stay updated with real click destinations in headers, footers and notices.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">LinkedIn Page Link</label>
                      <input
                        type="text"
                        value={config.externalLinks?.linkedin || "https://www.linkedin.com/company/bincomdevcenter/"}
                        onChange={(e) => {
                          const ext = { ...config.externalLinks, linkedin: e.target.value };
                          handleChange("externalLinks", ext);
                        }}
                        className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Twitter/X Page Link</label>
                      <input
                        type="text"
                        value={config.externalLinks?.twitter || "https://twitter.com/bincomdevcenter"}
                        onChange={(e) => {
                          const ext = { ...config.externalLinks, twitter: e.target.value };
                          handleChange("externalLinks", ext);
                        }}
                        className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Main Organization Website</label>
                      <input
                        type="text"
                        value={config.externalLinks?.website || "https://bincom.net"}
                        onChange={(e) => {
                          const ext = { ...config.externalLinks, website: e.target.value };
                          handleChange("externalLinks", ext);
                        }}
                        className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-lime-400 text-slate-950 hover:bg-lime-300 font-display font-black text-xs px-6 py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving to Firestore..." : "Save Settings to Database"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTRATIONS MANAGER & EXPORTER */}
            {activeTab === "registrations" && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">
                      Registered Applicants List
                    </h3>
                    <p className="text-xs text-slate-400">View live applications stored in Firestore. Filter by mandatory roles and export.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Role Filter Selector */}
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-slate-950 text-slate-100 text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 cursor-pointer font-bold appearance-none uppercase"
                      >
                        <option value="all">All Roles</option>
                        <option value="Participant">Participants</option>
                        <option value="Observer">Observers</option>
                        <option value="Community Judge">Community Judges</option>
                      </select>
                    </div>

                    {/* Export SpreadSheet Button */}
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-slate-700"
                    >
                      <Download className="w-4 h-4" /> Export Filtered to CSV
                    </button>
                  </div>
                </div>

                {/* Table Layout */}
                <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider text-[10px]">
                        <th className="p-4">Full Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4 text-center">Selected Role</th>
                        <th className="p-4">LinkedIn Profile</th>
                        <th className="p-4 text-right">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-850/50 transition-all text-slate-200">
                          <td className="p-4 font-bold text-white whitespace-nowrap">{reg.fullName}</td>
                          <td className="p-4 font-mono">{reg.email}</td>
                          <td className="p-4 font-mono">{reg.phone}</td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                              reg.role === "Participant" 
                                ? "bg-cyan-950/50 border border-cyan-500/30 text-cyan-300"
                                : reg.role === "Observer"
                                ? "bg-amber-950/50 border border-amber-500/30 text-amber-300"
                                : "bg-purple-950/50 border border-purple-500/30 text-purple-300"
                            }`}>
                              {reg.role}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {reg.linkedinUrl ? (
                              <a 
                                href={reg.linkedinUrl.startsWith("http") ? reg.linkedinUrl : `https://${reg.linkedinUrl}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                              >
                                View Profile
                              </a>
                            ) : (
                              <span className="text-slate-500 font-mono">None Provided</span>
                            )}
                          </td>
                          <td className="p-4 text-right font-mono text-slate-400 whitespace-nowrap">{reg.registeredAt}</td>
                        </tr>
                      ))}

                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400 font-mono">
                            No registered users found matching the filter "{roleFilter}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: EMAIL TEMPLATES & TRIGGERS */}
            {activeTab === "emails" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Onboarding Links/Dates & Email templates inputs */}
                <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div>
                    <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">
                      Email Settings & Dynamic Templates
                    </h3>
                    <p className="text-xs text-slate-400">
                      Draft transactional emails and manage raw placeholder links pulled dynamically from Firestore. Use double curly braces for placeholder tags: 
                      <code className="text-lime-400 font-mono ml-1">{`{{name}}, {{role}}, {{days}}, {{start_date}}, {{end_date}}, {{whatsapp_link}}, {{slack_link}}, {{kickoff_event_link}}`}</code>
                    </p>
                  </div>

                  {/* Onboarding Links & Dates Card */}
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-850 space-y-4">
                    <h4 className="text-xs font-mono text-lime-400 uppercase tracking-widest">Active Dynamic Replacement Values</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* WhatsApp Link */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-mono text-slate-400 block">WhatsApp Group URL</label>
                        <input
                          type="text"
                          placeholder="https://chat.whatsapp.com/..."
                          value={config.whatsapp_link || ""}
                          onChange={(e) => handleChange("whatsapp_link", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                        />
                      </div>

                      {/* Slack Link */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-mono text-slate-400 block">Slack Channel URL</label>
                        <input
                          type="text"
                          placeholder="https://bincom.net/..."
                          value={config.slack_link || ""}
                          onChange={(e) => handleChange("slack_link", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                        />
                      </div>

                      {/* Kickoff Link */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-mono text-slate-400 block">Kick-off Event URL</label>
                        <input
                          type="text"
                          placeholder="https://bincom.net/..."
                          value={config.kickoff_event_link || ""}
                          onChange={(e) => handleChange("kickoff_event_link", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                        />
                      </div>

                      {/* Start Date Math */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 block">Start Date (For math e.g. YYYY-MM-DD)</label>
                        <input
                          type="date"
                          value={config.startDate || ""}
                          onChange={(e) => handleChange("startDate", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-mono"
                        />
                      </div>

                      {/* Start Date Display text */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 block">Start Date (For display e.g. Friday, Sept 18th)</label>
                        <input
                          type="text"
                          value={config.startDateFormatted || ""}
                          onChange={(e) => handleChange("startDateFormatted", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                        />
                      </div>

                      {/* End Date Math */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 block">End Date (For math e.g. YYYY-MM-DD)</label>
                        <input
                          type="date"
                          value={config.endDate || ""}
                          onChange={(e) => handleChange("endDate", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-mono"
                        />
                      </div>

                      {/* End Date Display text */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 block">End Date (For display e.g. Saturday, Sept 19th)</label>
                        <input
                          type="text"
                          value={config.endDateFormatted || ""}
                          onChange={(e) => handleChange("endDateFormatted", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Welcome Email Template */}
                    <div className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-850">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h4 className="text-xs font-mono text-lime-400 uppercase tracking-widest">Instant Welcome Email (Triggered on Registration)</h4>
                        <button
                          type="button"
                          onClick={() => setTestModal({ isOpen: true, type: "welcome", email: testTo || "" })}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-lime-400 hover:text-lime-300 font-display font-bold text-[10px] uppercase px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shrink-0"
                        >
                          <Mail className="w-3.5 h-3.5" /> Test Welcome Email
                        </button>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 block">Subject line</label>
                        <input
                          type="text"
                          value={config.welcomeEmailSubject || ""}
                          onChange={(e) => handleChange("welcomeEmailSubject", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 block">Email HTML Template Body</label>
                        <textarea
                          rows={12}
                          value={config.welcome_email_template || config.welcomeEmailBody || ""}
                          onChange={(e) => {
                            handleChange("welcome_email_template", e.target.value);
                            handleChange("welcomeEmailBody", e.target.value);
                          }}
                          placeholder="Paste your ENTIRE HTML template here..."
                          className="w-full bg-slate-900 text-slate-100 font-mono text-[11px] px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 resize-y min-h-[150px]"
                        />
                      </div>
                    </div>

                    {/* Reminder Email Template */}
                    <div className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-850">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h4 className="text-xs font-mono text-lime-400 uppercase tracking-widest">Daily Scheduled Reminder Email (21, 5, 1 Days Countdown)</h4>
                        <button
                          type="button"
                          onClick={() => setTestModal({ isOpen: true, type: "reminder", email: testTo || "" })}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-lime-400 hover:text-lime-300 font-display font-bold text-[10px] uppercase px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shrink-0"
                        >
                          <Mail className="w-3.5 h-3.5" /> Test Reminder Email
                        </button>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 block">Subject line</label>
                        <input
                          type="text"
                          value={config.reminderEmailSubject || ""}
                          onChange={(e) => handleChange("reminderEmailSubject", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 block">Email HTML Template Body</label>
                        <textarea
                          rows={12}
                          value={config.reminder_email_template || config.reminderEmailBody || ""}
                          onChange={(e) => {
                            handleChange("reminder_email_template", e.target.value);
                            handleChange("reminderEmailBody", e.target.value);
                          }}
                          placeholder="Paste your ENTIRE HTML template here..."
                          className="w-full bg-slate-900 text-slate-100 font-mono text-[11px] px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 resize-y min-h-[150px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-lime-400 text-slate-950 hover:bg-lime-300 font-display font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> Save Configuration & Templates
                    </button>
                  </div>
                </div>

                {/* Right: Triggers, Test Panel, and Scheduler Monitor */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Automated Scheduler Trigger Block */}
                  <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
                    <div>
                      <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">Daily Reminders Simulator</h3>
                      <p className="text-[11px] text-slate-400">Test the scheduled reminder dispatch. The server checks the countdown to startDate and sends emails to all registrants if matching exactly 21, 5, or 1 days before start.</p>
                    </div>

                    <button
                      onClick={handleTriggerReminders}
                      disabled={isTriggeringReminders}
                      className="w-full flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-display font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isTriggeringReminders ? "animate-spin" : ""}`} />
                      {isTriggeringReminders ? "Checking Math & Dispatched..." : "Trigger Manual Reminder Check"}
                    </button>

                    {cronLogs && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Trigger Output Log:</span>
                        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-lime-400 overflow-x-auto whitespace-pre-wrap max-h-40">
                          {cronLogs}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Template Email Testers Panel */}
                  <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
                    <div>
                      <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">Onboarding Template Testers</h3>
                      <p className="text-[11px] text-slate-400">Instantly test our dynamic HTML email templates with real tag replacement tags (e.g. name, role, dates, social links) dispatched to your inbox.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setTestModal({ isOpen: true, type: "welcome", email: testTo || "" })}
                        className="w-full flex items-center justify-center gap-2 bg-slate-850 hover:bg-slate-800 text-lime-400 hover:text-lime-300 font-display font-bold text-xs py-3 rounded-xl border border-slate-800 hover:border-slate-750 transition-all cursor-pointer"
                      >
                        <Mail className="w-4 h-4" /> Test Welcome Email
                      </button>

                      <button
                        onClick={() => setTestModal({ isOpen: true, type: "reminder", email: testTo || "" })}
                        className="w-full flex items-center justify-center gap-2 bg-slate-850 hover:bg-slate-800 text-lime-400 hover:text-lime-300 font-display font-bold text-xs py-3 rounded-xl border border-slate-800 hover:border-slate-750 transition-all cursor-pointer"
                      >
                        <Mail className="w-4 h-4" /> Test Reminder Email
                      </button>
                    </div>
                  </div>

                  {/* Resend Single Quick Test Email Panel */}
                  <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
                    <div>
                      <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">Resend API Direct Tester</h3>
                      <p className="text-[11px] text-slate-400">Instantly test credentials in your `.env` file by sending a real email to yourself.</p>
                    </div>

                    <form onSubmit={handleSendTestEmail} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Recipient email address</label>
                        <input
                          type="email"
                          required
                          value={testTo}
                          onChange={(e) => setTestTo(e.target.value)}
                          placeholder="e.g. testing@example.com"
                          className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-lime-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Subject</label>
                        <input
                          type="text"
                          required
                          value={testSubject}
                          onChange={(e) => setTestSubject(e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">HTML Body Content</label>
                        <textarea
                          rows={3}
                          required
                          value={testBody}
                          onChange={(e) => setTestBody(e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 font-mono text-[10px] px-3 py-2 rounded-lg border border-slate-800 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingTest}
                        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-display font-bold text-xs py-2.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> {isSendingTest ? "Sending Email..." : "Send Test Dispatch"}
                      </button>

                      {testStatus && (
                        <p className="text-[10px] font-mono text-slate-300 mt-2 text-center bg-slate-950 py-1.5 px-2.5 rounded-lg border border-slate-850">
                          {testStatus}
                        </p>
                      )}
                    </form>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: FAQS & TIMELINE SCHEDULING */}
            {activeTab === "faqs-timeline" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* FAQ List Editor */}
                <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-display font-black text-white uppercase tracking-tight">Frequently Asked Questions (FAQs)</h3>
                      <p className="text-xs text-slate-400">Modify landing page searchable questions & answers.</p>
                    </div>
                    <button
                      onClick={handleAddFaq}
                      className="flex items-center gap-1.5 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 font-display font-bold text-xs px-3 py-1.5 rounded-lg transition-all border border-lime-400/30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add FAQ
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {config.faqs.map((faq: FaqItem, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl relative space-y-3">
                        <button
                          onClick={() => handleRemoveFaq(idx)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-all"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                        <div className="space-y-1.5 pr-8">
                          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Question #{idx + 1}</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                            className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-lime-400 font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Answer Text</label>
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                            className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-lime-400"
                          />
                        </div>
                      </div>
                    ))}

                    {config.faqs.length === 0 && (
                      <p className="text-center py-12 text-xs font-mono text-slate-500">No FAQs created in current draft.</p>
                    )}
                  </div>

                  <div className="flex justify-end border-t border-slate-800 pt-4">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-lime-400 text-slate-950 hover:bg-lime-300 font-display font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> Save FAQs
                    </button>
                  </div>
                </div>

                {/* Timeline Events Editor */}
                <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-display font-black text-white uppercase tracking-tight">Timeline Events Schedule</h3>
                      <p className="text-xs text-slate-400">Modify chronological cutoff marks, checks, and presentations.</p>
                    </div>
                    <button
                      onClick={handleAddTimelineEvent}
                      className="flex items-center gap-1.5 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 font-display font-bold text-xs px-3 py-1.5 rounded-lg transition-all border border-lime-400/30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Event
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {config.timeline.map((event: TimelineEvent, idx: number) => (
                      <div key={event.id || idx} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl relative space-y-3">
                        <button
                          onClick={() => handleRemoveTimelineEvent(idx)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-all"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="grid grid-cols-2 gap-4 pr-8">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Event Title</label>
                            <input
                              type="text"
                              value={event.title}
                              onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                              className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-lime-400 font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Date Display text</label>
                            <input
                              type="text"
                              value={event.date}
                              onChange={(e) => handleTimelineChange(idx, "date", e.target.value)}
                              className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-lime-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Description Text</label>
                          <textarea
                            rows={2}
                            value={event.description || ""}
                            onChange={(e) => handleTimelineChange(idx, "description", e.target.value)}
                            className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-lime-400 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Redirect URL (Optional)</label>
                            <input
                              type="text"
                              value={event.url || ""}
                              placeholder="e.g. https://..."
                              onChange={(e) => handleTimelineChange(idx, "url", e.target.value)}
                              className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Link Button Text</label>
                            <input
                              type="text"
                              value={event.linkText || ""}
                              placeholder="e.g. Register Team"
                              onChange={(e) => handleTimelineChange(idx, "linkText", e.target.value)}
                              className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`high_${idx}`}
                            checked={!!event.highlighted}
                            onChange={(e) => handleTimelineChange(idx, "highlighted", e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-slate-800 text-lime-400 focus:ring-0 bg-slate-900"
                          />
                          <label htmlFor={`high_${idx}`} className="text-[10px] font-mono text-slate-400 select-none cursor-pointer">
                            Highlight event visually on timeline
                          </label>
                        </div>
                      </div>
                    ))}

                    {config.timeline.length === 0 && (
                      <p className="text-center py-12 text-xs font-mono text-slate-500">No timeline events created in current draft.</p>
                    )}
                  </div>

                  <div className="flex justify-end border-t border-slate-800 pt-4">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-lime-400 text-slate-950 hover:bg-lime-300 font-display font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> Save Timeline
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: CUSTOM LOCATIONS */}
            {activeTab === "locations" && (
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-fade-in">
                <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
                  <div>
                    <h3 className="text-base font-display font-black text-white uppercase tracking-tight">Active Hackathon Locations & Hubs</h3>
                    <p className="text-xs text-slate-400">Add, modify or remove active physical and virtual check-in centers for the hackathon.</p>
                  </div>
                  <button
                    onClick={handleAddLocation}
                    className="flex items-center gap-1.5 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 font-display font-bold text-xs px-3 py-1.5 rounded-lg transition-all border border-lime-400/30 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Location Hub
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-1">
                  {(config.locations || []).map((loc: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl relative space-y-3">
                      <button
                        onClick={() => handleRemoveLocation(idx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-all"
                        title="Delete Hub"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Location Hub Name</label>
                        <input
                          type="text"
                          value={loc.name}
                          onChange={(e) => handleLocationChange(idx, "name", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-lime-400 font-bold"
                          placeholder="e.g. Lagos Dev Center"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">City / State</label>
                          <input
                            type="text"
                            value={loc.cityOrState}
                            onChange={(e) => handleLocationChange(idx, "cityOrState", e.target.value)}
                            className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none"
                            placeholder="e.g. Lagos"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Country</label>
                          <input
                            type="text"
                            value={loc.country}
                            onChange={(e) => handleLocationChange(idx, "country", e.target.value)}
                            className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none"
                            placeholder="e.g. Nigeria"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Community / Direction URL</label>
                        <input
                          type="text"
                          value={loc.link}
                          onChange={(e) => handleLocationChange(idx, "link", e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none"
                          placeholder="e.g. https://..."
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id={`virt_${idx}`}
                          checked={!!loc.isVirtual}
                          onChange={(e) => handleLocationChange(idx, "isVirtual", e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-800 text-lime-400 focus:ring-0 bg-slate-900"
                        />
                        <label htmlFor={`virt_${idx}`} className="text-[10px] font-mono text-slate-400 select-none cursor-pointer">
                          This is a Virtual Hub / Digital attendance link
                        </label>
                      </div>
                    </div>
                  ))}

                  {(config.locations || []).length === 0 && (
                    <p className="col-span-2 text-center py-12 text-xs font-mono text-slate-500">No custom locations added yet.</p>
                  )}
                </div>

                <div className="flex justify-end border-t border-slate-800 pt-4">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-lime-400 text-slate-950 hover:bg-lime-300 font-display font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> Save Active Locations
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Test Email Template Modal */}
      {testModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <div>
              <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">
                Test {testModal.type === "welcome" ? "Welcome" : "Reminder"} Email
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your test email address. We will fetch your dynamic Firestore template, populate the substitution tags, and dispatch a real HTML email instantly.
              </p>
            </div>

            <form onSubmit={handleTestTemplateEmailSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Recipient Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@example.com"
                  value={testModal.email}
                  onChange={(e) => setTestModal((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-950 text-slate-100 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-lime-400 font-medium"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setTestModal({ isOpen: false, type: null, email: "" })}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingTemplateTest}
                  className="flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-display font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSendingTemplateTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Dispatch Test Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
