import React, { useState, useEffect } from "react";
import { Registration, HackathonConfig } from "../types";
import { User, Mail, Phone, Briefcase, Linkedin, Shield, CheckCircle, Ticket, Download, Trash } from "lucide-react";

interface RegistrationFormProps {
  config: HackathonConfig;
}

export default function RegistrationForm({ config }: RegistrationFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState<Registration | null>(null);
  const [showRecentTicket, setShowRecentTicket] = useState(false);

  // Load existing registration from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bincom_hackathon_registration");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Registration;
        setTicket(parsed);
      } catch (e) {
        console.error("Failed to parse ticket", e);
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!role) newErrors.role = "Please select an application role";
    if (!linkedinUrl.trim()) {
      newErrors.linkedinUrl = "LinkedIn URL is required";
    } else if (!linkedinUrl.includes("linkedin.com/")) {
      newErrors.linkedinUrl = "Please enter a valid LinkedIn URL";
    }
    if (!acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions to register";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    // Send the user's details to the n8n webhook as requested
    try {
      await fetch("https://dev.automation.emigr8visa.com/webhook/hackathon-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: role,
          linkedinUrl: linkedinUrl.trim(),
          "Full Name": fullName.trim(),
          "Email": email.trim(),
          "Phone": phone.trim(),
          "Application Role": role,
          "LinkedIn URL": linkedinUrl.trim(),
        }),
      });
    } catch (webhookErr) {
      console.error("Failed to send registration details to webhook:", webhookErr);
    }

    // Send to server API to save in Firestore and dispatch welcome email in one atomic action
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role,
        linkedinUrl: linkedinUrl.trim(),
      }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Backend registration failed");
    }

    const newRegistration: Registration = {
      id: resData.registration.id,
      fullName: resData.registration.fullName,
      email: resData.registration.email,
      phone: resData.registration.phone,
      role: resData.registration.role,
      linkedinUrl: resData.registration.linkedinUrl,
      registeredAt: resData.registration.registeredAt,
    };

    localStorage.setItem(
      "bincom_hackathon_registration",
      JSON.stringify(newRegistration)
    );

    setTicket(newRegistration);
    setShowRecentTicket(true);

    const element = document.getElementById("register");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

  } catch (error: any) {
    console.error("Registration endpoint failed:", error);
    alert(error.message || "Registration failed to connect with the server. Please try again.");
  } finally {
    setIsSubmitting(false);
  }

};
  const handleCancelRegistration = () => {
    if (window.confirm("Are you sure you want to cancel your registration? This will delete your local access ticket.")) {
      localStorage.removeItem("bincom_hackathon_registration");
      setTicket(null);
      setShowRecentTicket(false);
      // Reset form fields
      setFullName("");
      setEmail("");
      setPhone("");
      setRole("");
      setLinkedinUrl("");
      setAcceptTerms(false);
    }
  };

  return (
    <section id="register" className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-12 scroll-mt-20">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Banner header for the form card */}
        <div className="bg-brand-banner px-8 py-6 flex items-center justify-between border-b border-lime-300">
          <h3 className="font-display font-bold text-slate-900 text-lg sm:text-xl">
            Register for the Bincom Hackathon
          </h3>
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-slate-900 text-white px-2.5 py-1 rounded-full">
            REGISTRATION OPEN
          </span>
        </div>

        <div className="p-8 sm:p-12">
          {ticket && (showRecentTicket || !showRecentTicket) ? (
            /* Simple Success Screen */
            <div className="space-y-6 py-12 animate-fade-in text-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-emerald-600 tracking-tight">
                Registered Successfully!
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Thank you, {ticket.fullName}. Your registration for the Bincom Hackathon has been completed successfully.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={handleCancelRegistration}
                  className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-display font-semibold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                  Clear & Register Another Spot
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form Fields */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Main Prompt */}
              <div className="border-b border-slate-100 pb-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-display font-extrabold text-slate-900 text-2xl tracking-tight">
                    Save your spot
                  </h4>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                    Unleash your creativity at the Bincom Hackathon in a thrilling 24-hour session where brilliant minds collide to build digital solutions. Collaborate with fellow visionaries, developers, and designers to transform groundbreaking ideas into real-world solutions. You can get involved as a participant, a community judge or simply as an observer.
                  </p>
                </div>
                <p className="text-slate-400 text-xs font-semibold">
                  All fields marked with an asterisk (*) are strictly required.
                </p>
              </div>

              {/* Inputs Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" /> Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className={`w-full bg-slate-50/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-lime-100 focus:border-brand-primary"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-rose-500 text-[11px] font-medium">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400" /> Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className={`w-full bg-slate-50/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.email ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-lime-100 focus:border-brand-primary"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-[11px] font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" /> Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 801 234 5678"
                    className={`w-full bg-slate-50/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.phone ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-lime-100 focus:border-brand-primary"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-rose-500 text-[11px] font-medium">{errors.phone}</p>
                  )}
                </div>

                {/* Application Role Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="role" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Application Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full bg-slate-50/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                      errors.role ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-lime-100 focus:border-brand-primary"
                    }`}
                  >
                    <option value="">Select your role</option>
                    <option value="participant">Participant</option>
                    <option value="community judge">Community Judge</option>
                    <option value="observer">Observer</option>
                  </select>
                  {errors.role && (
                    <p className="text-rose-500 text-[11px] font-medium">{errors.role}</p>
                  )}
                </div>

              </div>

              {/* LinkedIn URL - Full line */}
              <div className="space-y-1.5">
                <label htmlFor="linkedin" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Linkedin className="w-4 h-4 text-slate-400" /> LinkedIn URL <span className="text-rose-500">*</span>
                </label>
                <input
                  id="linkedin"
                  type="url"
                  required
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  className={`w-full bg-slate-50/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.linkedinUrl ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-lime-100 focus:border-brand-primary"
                  }`}
                />
                {errors.linkedinUrl && (
                  <p className="text-rose-500 text-[11px] font-medium">{errors.linkedinUrl}</p>
                )}
              </div>

              {/* Terms and Conditions Textbox */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-slate-400" /> Terms & Conditions <span className="text-rose-500">*</span>
                </label>
                <div className="w-full h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-[11px] text-slate-500 leading-relaxed custom-scrollbar select-none space-y-3">
                  <p>
                    By clicking the button, you hereby agree to be bound by the following terms and conditions concerning your subscription to Bincom Dev Center's email list. These terms and conditions govern the relationship between you and Bincom Dev Center, with respect to the receipt of marketing and promotional communications about our products and services.
                  </p>
                  <p className="font-semibold text-slate-600">Email Subscription Service</p>
                  <p>
                    1.1. By subscribing to our email list, you consent to receive promotional, marketing, and informational emails from us, including but not limited to newsletters, special offers, promotions, and updates on our products and services.
                  </p>
                  <p>
                    1.2. You acknowledge and agree that the frequency and content of our emails may vary, and that we may occasionally send you additional emails related to special events or promotions.
                  </p>
                  <p>
                    1.3. We reserve the right to modify or discontinue our email subscription service at any time without prior notice. We will endeavor to provide you with reasonable notice of any significant changes to the service.
                  </p>
                  <p className="font-semibold text-slate-600">Personal Information and Privacy</p>
                  <p>
                    2.1. By subscribing to our email list, you consent to the collection, use, and disclosure of your personal information in accordance with our Privacy Policy, which is incorporated by reference into this Agreement. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                  </p>
                  <p>
                    2.2. You agree to provide accurate, current, and complete information about yourself when subscribing to our email list, and to update such information as necessary to maintain its accuracy.
                  </p>
                  <p className="font-semibold text-slate-600">Unsubscribing and Opting Out</p>
                  <p>
                    3.1. You may unsubscribe from our email list at any time by clicking the link provided at the bottom of each email.
                  </p>
                  <p>
                    3.2. Upon receipt of your request to unsubscribe, we will promptly remove your email address from our mailing list and cease sending you marketing and promotional emails.
                  </p>
                  <p className="font-semibold text-slate-600">Limitation of Liability</p>
                  <p>
                    4.1. Under no circumstances shall we be liable for any direct, indirect, incidental, consequential, or special damages, including but not limited to damages for loss of profits, goodwill, or other intangible losses, arising from your subscription to our email list or your use of the information contained therein.
                  </p>
                  <p className="font-semibold text-slate-600">Governing Law and Dispute Resolution</p>
                  <p>
                    5.1. This Agreement shall be governed by and construed in accordance with constituted laws, without regard to its conflict of law provisions.
                  </p>
                  <p className="font-semibold text-slate-600">Miscellaneous</p>
                  <p>
                    6.1. If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                  </p>
                  <p>
                    6.2. Our failure to exercise or enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision.
                  </p>
                  <p>
                    6.3. This Agreement constitutes the entire agreement between you and us with respect to your subscription to our email list and supersedes any prior agreements or understandings, whether written or oral.
                  </p>
                </div>
                
                {/* Terms Acceptance Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary mt-0.5 cursor-pointer accent-brand-primary"
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-slate-600 select-none cursor-pointer">
                    I accept the <span className="text-slate-800 font-medium">Terms & Conditions</span> outlined above.
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-rose-500 text-[11px] font-medium mt-1">{errors.acceptTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-brand-primary text-slate-900 hover:bg-brand-banner font-display font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                      Validating Credentials...
                    </>
                  ) : (
                    "Register Now!"
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  );
}
