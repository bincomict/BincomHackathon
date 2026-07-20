import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

const DEFAULT_CONFIG = {
  name: "Bincom Hackathon September 2026",
  theme: "Hacking genAI",
  edition: "5.0",
  subtitle: "Building the Next Big Thing with generative AI in 24 Hours or Less.",
  month: "September",
  year: "2026",
  startDate: "Friday, September 18th, 2026",
  startTime: "6:00 PM WAT",
  endDate: "Saturday, September 19th, 2026",
  endTime: "7:00 PM WAT",
  registrationUrl: "bincom.net/hackathon",
  physicalNoticeUrl: "http://bincomdevcenter.com/communityevents",
  flyerType: "html",
  flyerImageUrl: "/bincom_hackathon_flyer.jpg",
  virtualUrl: "https://bincom.net/virtual-hackathon",
  logoUrl: "/logo.png",
  
  // Custom Dynamic Onboarding Links & Dates
  whatsapp_link: "https://chat.whatsapp.com/BincomHackathon",
  slack_link: "https://bincom.net/bincomtechnetwork",
  kickoff_event_link: "https://bincom.net/hackathon",
  startDateFormatted: "Friday, September 18th, 2026",
  endDateFormatted: "Saturday, September 19th, 2026",

  // Raw Database templates and settings
  welcomeEmailSubject: "Confirming your Bincom Hackathon Registration - {{role}}",
  welcome_email_template: `<h2>Hello {{name}},</h2>
<p>Thank you for registering for the <strong>Bincom Hackathon</strong> as a <strong>{{role}}</strong>!</p>
<p>Here are your essential onboarding links:</p>
<ul>
  <li><strong>WhatsApp Group:</strong> <a href="{{whatsapp_link}}">{{whatsapp_link}}</a></li>
  <li><strong>Slack Channel:</strong> <a href="{{slack_link}}">{{slack_link}}</a></li>
  <li><strong>Kick-off Event:</strong> <a href="{{kickoff_event_link}}">{{kickoff_event_link}}</a></li>
</ul>
<p>The hackathon starts on <strong>{{start_date}}</strong> and ends on <strong>{{end_date}}</strong>.</p>
<p>Get ready to hack!</p>`,
  reminderEmailSubject: "Reminder: Bincom Hackathon starts in {{days}} days!",
  reminder_email_template: `<h2>Hello {{name}},</h2>
<p>This is a quick reminder that the <strong>Bincom Hackathon</strong> is starting in exactly <strong>{{days}} days</strong>!</p>
<p>Here are your essential onboarding links to prepare:</p>
<ul>
  <li><strong>WhatsApp Group:</strong> <a href="{{whatsapp_link}}">{{whatsapp_link}}</a></li>
  <li><strong>Slack Channel:</strong> <a href="{{slack_link}}">{{slack_link}}</a></li>
  <li><strong>Kick-off Event:</strong> <a href="{{kickoff_event_link}}">{{kickoff_event_link}}</a></li>
</ul>
<p>Start Date: <strong>{{start_date}}</strong></p>
<p>Get ready to hack!</p>`,
  locations: [
    { name: "Ikorodu", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Zawaciki", cityOrState: "Kano", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Yaba", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Ikeja", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Ikotun", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Ikoyi", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Okota", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Ikota", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Ejigbo", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Oshodi", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Ayobo", cityOrState: "Lagos", country: "Nigeria", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Nottingham", cityOrState: "England", country: "United Kingdom", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Tbilisi", cityOrState: "Tbilisi", country: "Georgia", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" },
    { name: "Kampala", cityOrState: "Kampala", country: "Uganda", isVirtual: false, link: "http://bincomdevcenter.com/communityevents" }
  ],
  timeline: [
    {
      id: "t1",
      title: "virtual kick-off event",
      date: "Thursday, September 17th, 2026 (6:00 PM WAT)",
      description: "The Bincom Hackathon virtual kick-off event is designed to answer all your hackathon questions and officially kick start the 24 hours event.",
      highlighted: true,
      url: "https://bincom.net/hackathon",
      linkText: "Register for event"
    },
    {
      id: "t2",
      title: "Team Registration Virtual Check-In Event",
      date: "Friday, September 18th, 2026 (11:00 AM - 12 noon WAT)",
      description: "designed to resolve issues relating to team registration."
    },
    {
      id: "t3",
      title: "Team Registration Deadline",
      date: "Friday, September 18th, 2026 (12:00 noon WAT)",
      description: "All Teams must ensure they complete the team registration form.",
      url: "https://bincom.net/bincomhackathon_teamregistration",
      linkText: "Register Team"
    },
    {
      id: "t4",
      title: "Product Submission Virtual Check-In Event",
      date: "Friday, September 18th, 2026 (6:00 PM - 7:00 PM WAT)",
      description: "designed to ensure all teams submit their products before deadline"
    },
    {
      id: "t5",
      title: "Product Submission Deadline",
      date: "Friday, September 18th, 2026 (7:00 PM WAT)",
      description: "All Products developed during the Hackathon must be submitted.",
      url: "https://bincom.net/bincomhackathon_productsubmission"
    },
    {
      id: "t6",
      title: "Community Judges - Feedback Submission",
      date: "Saturday, September 19th - Monday, September 21st, 2026 (7:00 PM WAT)",
      description: "All Community Judges must submit their feedback. Judges will be contacted with specific instructions."
    },
    {
      id: "t7",
      title: "Public Voting & Feedback",
      date: "Tuesday, September 22nd - Thursday, September 24th, 2026",
      description: "Public voting session where projects receive peer review and feedback on our social platforms.",
      url: "https://www.linkedin.com/company/bincomdevcenter/"
    },
    {
      id: "t8",
      title: "Team Presentation to Expert Judges (Optional)",
      date: "Thursday, September 24th, 2026 (5:00 PM WAT)",
      description: "The top 5 teams will present and demo their innovations to our expert panel of judges."
    },
    {
      id: "t9",
      title: "Hackathon Winner 🏆 Announcement",
      date: "Friday, September 25th, 2026",
      description: "Grand announcement of the winning team and the first and second runner up teams",
      highlighted: true
    }
  ]
};

const CONFIG_FILE_PATH = path.join(process.cwd(), "hackathon-config.json");
const REGISTRATIONS_FILE_PATH = path.join(process.cwd(), "registrations.json");

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let dbInstance: any = null;

function getFirestoreDb() {
  if (!dbInstance) {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(firebaseConfigPath)) {
      throw new Error("firebase-applet-config.json is missing");
    }
    const config = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    if (!config.apiKey || !config.projectId) {
      throw new Error("Firebase apiKey or projectId is missing in firebase-applet-config.json");
    }
    const app = initializeApp(config);
    dbInstance = getFirestore(app, config.firestoreDatabaseId || "default");
  }
  return dbInstance;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to get or initialize config from Firestore with local file fallback
async function getHackathonConfig() {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, "hackathon_settings", "default_config");
    let docSnap;
    try {
      docSnap = await getDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, "hackathon_settings/default_config");
      throw err;
    }

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      try {
        await setDoc(docRef, DEFAULT_CONFIG);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, "hackathon_settings/default_config");
        throw err;
      }
      try {
        fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf-8");
      } catch (err) {}
      return DEFAULT_CONFIG;
    }
  } catch (error) {
    console.error("Error reading hackathon config from Firestore, falling back to local file:", error);
    try {
      if (fs.existsSync(CONFIG_FILE_PATH)) {
        const fileData = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
        return JSON.parse(fileData);
      }
    } catch (e) {}
    return DEFAULT_CONFIG;
  }
}

// Helper to save config to Firestore with local backup
async function saveHackathonConfig(newConfig: typeof DEFAULT_CONFIG) {
  try {
    const db = getFirestoreDb();
    const docRef = doc(db, "hackathon_settings", "default_config");
    try {
      await setDoc(docRef, newConfig);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "hackathon_settings/default_config");
      throw err;
    }
    try {
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2), "utf-8");
    } catch (err) {}
    return true;
  } catch (error) {
    console.error("Error saving config to Firestore:", error);
    return false;
  }
}

// Resend API integration using native fetch
async function sendEmailViaResend(to: string, subject: string, html: string) {
  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.warn("EMAIL_API_KEY is not defined in .env. Skipping email dispatch.");
    return { success: false, error: "EMAIL_API_KEY is missing in env." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Bincom Hackathon <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend API error response:", errText);
      return { success: false, error: errText };
    }

    const resData: any = await response.json();
    console.log(`Resend email sent successfully to ${to}. Message ID: ${resData.id}`);
    return { success: true, data: resData };
  } catch (error: any) {
    console.error("Resend fetch error:", error);
    return { success: false, error: error.message || String(error) };
  }
}

// Replacement helper to dynamically swap out custom placeholders with latest settings
function replaceEmailPlaceholders(template: string, settings: any, recipient: { fullName: string; role: string; linkedinUrl?: string; days?: number }) {
  if (!template) return "";
  let result = template;

  const placeholders: Record<string, string> = {
    "name": recipient.fullName,
    "role": recipient.role,
    "linkedinUrl": recipient.linkedinUrl || "",
    "linkedin_url": recipient.linkedinUrl || "",
    "whatsapp_link": settings.whatsapp_link || "",
    "slack_link": settings.slack_link || "",
    "kickoff_event_link": settings.kickoff_event_link || "",
    "start_date": settings.startDateFormatted || settings.startDate || "",
    "startDate": settings.startDateFormatted || settings.startDate || "",
    "end_date": settings.endDateFormatted || settings.endDate || "",
    "endDate": settings.endDateFormatted || settings.endDate || "",
    "theme": settings.theme || "",
    "days": recipient.days !== undefined ? String(recipient.days) : "",
  };

  for (const [key, val] of Object.entries(placeholders)) {
    // Replace {{key}}
    const regexDouble = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regexDouble, val);
    // Also replace {key}
    const regexSingle = new RegExp(`{\\s*${key}\\s*}`, "g");
    result = result.replace(regexSingle, val);
  }

  return result;
}

// Scheduled Daily Reminder function (checks Firestore / hackathon-config.json for date)
async function checkAndSendDailyReminders() {
  try {
    const settings = await getHackathonConfig();

    const startStr = settings.startDate; // Expect "YYYY-MM-DD" style ISO date for math, or fall back to dates.
    if (!startStr) {
      console.warn("[Reminder Scheduler] No startDate configured in hackathon-config.");
      return { success: false, message: "Start date is not configured in settings" };
    }

    const start = new Date(startStr);
    const today = new Date();

    // Reset hours to compare pure calendar dates
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const diffTime = startDay.getTime() - todayDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    console.log(`[Reminder Check] Upcoming Start ISO Date: ${startStr}. Today: ${todayDay.toISOString().slice(0, 10)}. Days until start: ${diffDays}`);

    const targetDays = [21, 5, 1];
    if (targetDays.includes(diffDays)) {
      console.log(`[Reminder Triggered] Today is exactly ${diffDays} days before the hackathon! Querying registrations...`);

      // Query all registrations from Firestore, fallback to local file
      let list: any[] = [];
      try {
        const db = getFirestoreDb();
        let querySnapshot;
        try {
          querySnapshot = await getDocs(collection(db, "registrations"));
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, "registrations");
          throw err;
        }
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
      } catch (dbErr) {
        console.error("Error fetching registrations for reminders from Firestore:", dbErr);
        if (fs.existsSync(REGISTRATIONS_FILE_PATH)) {
          try {
            list = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE_PATH, "utf-8"));
          } catch (e) {}
        }
      }

      const recipients: any[] = [];
      for (const item of list) {
        if (item.email) {
          recipients.push({
            name: item.fullName || item.name || "Participant",
            email: item.email,
            role: item.role || "Participant",
          });
        }
      }

      console.log(`Found ${recipients.length} registered recipients to notify.`);

      let sentCount = 0;
      let failCount = 0;

      for (const recipient of recipients) {
        const subjectTemplate = settings.reminderEmailSubject || "Upcoming Hackathon Reminder!";
        const bodyTemplate = settings.reminder_email_template || settings.reminderEmailBody || "";

        const subject = replaceEmailPlaceholders(subjectTemplate, settings, {
          fullName: recipient.name,
          role: recipient.role,
          days: diffDays
        });

        const body = replaceEmailPlaceholders(bodyTemplate, settings, {
          fullName: recipient.name,
          role: recipient.role,
          days: diffDays
        });

        const emailResult = await sendEmailViaResend(recipient.email, subject, body);
        if (emailResult.success) {
          sentCount++;
        } else {
          failCount++;
        }
      }

      const logMsg = `Triggered daily checks. Sent: ${sentCount}, Failed: ${failCount} for ${diffDays}-day reminder.`;
      console.log(`[Reminder Scheduler] ${logMsg}`);
      return {
        success: true,
        message: logMsg,
        days: diffDays,
        sent: sentCount,
        failed: failCount
      };
    } else {
      const logMsg = `Checked reminders. Days until start: ${diffDays}. No reminder emails scheduled for today.`;
      console.log(`[Reminder Scheduler] ${logMsg}`);
      return {
        success: true,
        message: logMsg,
        days: diffDays,
        sent: 0,
        failed: 0
      };
    }
  } catch (error: any) {
    console.error("Error in scheduled reminders:", error);
    return { success: false, error: error.message || String(error) };
  }
}

// Start background task loop (runs every 24 hours)
setInterval(() => {
  console.log("[Scheduler] Running automated daily reminder check...");
  checkAndSendDailyReminders();
}, 24 * 60 * 60 * 1000);

// Run initial reminder check 10 seconds after server start
setTimeout(() => {
  console.log("[Scheduler] Running initial automated reminder check...");
  checkAndSendDailyReminders();
}, 10000);


const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "bincom_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "BincomGenAIHacks2026!";
const ADMIN_SESSION_TOKEN = "session_" + Math.random().toString(36).substring(2) + Date.now().toString(36);

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== ADMIN_SESSION_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired authentication token" });
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware with increased JSON payload limit for Base64 image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Always serve public folder statically so dynamically uploaded flyers are instantly available
  app.use(express.static(path.join(process.cwd(), "public")));

  // API: Get Hackathon config (from Firestore)
  app.get("/api/hackathon", async (req, res) => {
    const configData = await getHackathonConfig();
    res.json(configData);
  });

  // API: Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      res.json({ success: true, token: ADMIN_SESSION_TOKEN });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  });

  // API: Get list of images in /public directory
  app.get("/api/public-images", (req, res) => {
    try {
      const publicDirPath = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDirPath)) {
        return res.json([]);
      }
      const files = fs.readdirSync(publicDirPath);
      const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
      const images = files
        .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
        .map(file => `/${file}`);
      res.json(images);
    } catch (error) {
      console.error("Error reading public directory:", error);
      res.status(500).json({ error: "Failed to read public directory" });
    }
  });

  // API: Upload Flyer Image (Base64)
  app.post("/api/upload-flyer", requireAdminAuth, (req, res) => {
    const { image, fileName } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image data received" });
    }

    try {
      // Parse base64 header
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = "jpg";

      if (matches && matches.length === 3) {
        const type = matches[1];
        buffer = Buffer.from(matches[2], "base64");
        const extMap: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/jpg": "jpg",
          "image/png": "png",
          "image/gif": "gif",
          "image/webp": "webp",
          "image/svg+xml": "svg"
        };
        extension = extMap[type] || "jpg";
      } else {
        buffer = Buffer.from(image, "base64");
      }

      const safeFileName = fileName 
        ? fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_")
        : `custom_flyer_${Date.now()}.${extension}`;

      const publicPath = path.join(process.cwd(), "public", safeFileName);
      fs.writeFileSync(publicPath, buffer);

      // Return the URL for the uploaded file
      const fileUrl = `/${safeFileName}`;
      res.json({ message: "Flyer image uploaded successfully", url: fileUrl });
    } catch (error: any) {
      console.error("Error saving uploaded flyer:", error);
      res.status(500).json({ error: "Failed to write flyer file on backend" });
    }
  });

  // API: Update Hackathon config (Saves to Firestore)
  app.post("/api/hackathon", requireAdminAuth, async (req, res) => {
    const updated = req.body;
    if (!updated || !updated.name) {
      return res.status(400).json({ error: "Invalid hackathon config payload" });
    }
    await saveHackathonConfig(updated);
    res.json({ message: "Hackathon configuration updated successfully", config: updated });
  });

  // API: User Registration with Resend welcome email triggering
  app.post("/api/register", async (req, res) => {
    try {
      const { fullName, email, phone, role, linkedinUrl } = req.body;
      
      if (!fullName || !email || !phone || !role) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields (fullName, email, phone, role)",
        });
      }

      const regData = {
        fullName: String(fullName).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        role: String(role).trim(), // Participant, Observer, Community Judge
        linkedinUrl: String(linkedinUrl || "").trim(),
        registeredAt: new Date().toISOString(),
      };

      let docId = `reg_${Date.now()}`;

      // Save to Firestore, fallback/backup to local file
      try {
        const db = getFirestoreDb();
        const docRef = doc(db, "registrations", docId);
        try {
          await setDoc(docRef, regData);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `registrations/${docId}`);
          throw err;
        }
      } catch (dbErr) {
        console.error("Error writing registration to Firestore:", dbErr);
      }

      // Fallback local file writing
      let registrations = [];
      if (fs.existsSync(REGISTRATIONS_FILE_PATH)) {
        try {
          registrations = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE_PATH, "utf-8"));
        } catch (e) {}
      }
      registrations.push({ id: docId, ...regData });
      try {
        fs.writeFileSync(REGISTRATIONS_FILE_PATH, JSON.stringify(registrations, null, 2), "utf-8");
      } catch (fsErr) {}

      // Read custom Welcome Email Template from settings
      let welcomeSubject = "Welcome to the Bincom Hackathon! - {{role}}";
      let welcomeBody = ""; // Will fall back to default template if not specified in Firestore

      let finalSettings: any = {
        whatsapp_link: "https://chat.whatsapp.com/BincomHackathon",
        slack_link: "https://bincom.net/bincomtechnetwork",
        kickoff_event_link: "https://bincom.net/hackathon",
        welcome_email_template: `<h2>Hello {{name}},</h2>
<p>Thank you for registering for the <strong>Bincom Hackathon</strong> as a <strong>{{role}}</strong>!</p>
<p>Here are your essential onboarding links:</p>
<ul>
  <li><strong>WhatsApp Group:</strong> <a href="{{whatsapp_link}}">{{whatsapp_link}}</a></li>
  <li><strong>Slack Channel:</strong> <a href="{{slack_link}}">{{slack_link}}</a></li>
  <li><strong>Kick-off Event:</strong> <a href="{{kickoff_event_link}}">{{kickoff_event_link}}</a></li>
</ul>
<p>The hackathon starts on <strong>{{start_date}}</strong> and ends on <strong>{{end_date}}</strong>.</p>
<p>Get ready to hack!</p>`,
        reminder_email_template: `<h2>Hello {{name}},</h2>
<p>This is a quick reminder that the <strong>Bincom Hackathon</strong> is starting in exactly <strong>{{days}} days</strong>!</p>
<p>Here are your essential onboarding links to prepare:</p>
<ul>
  <li><strong>WhatsApp Group:</strong> <a href="{{whatsapp_link}}">{{whatsapp_link}}</a></li>
  <li><strong>Slack Channel:</strong> <a href="{{slack_link}}">{{slack_link}}</a></li>
  <li><strong>Kick-off Event:</strong> <a href="{{kickoff_event_link}}">{{kickoff_event_link}}</a></li>
</ul>
<p>Start Date: <strong>{{start_date}}</strong></p>
<p>Get ready to hack!</p>`,
        welcomeEmailSubject: "Welcome to the Bincom Hackathon! - {{role}}",
        reminderEmailSubject: "Reminder: Bincom Hackathon starts in {{days}} days!"
      };

      const localConfig = await getHackathonConfig();
      finalSettings = {
        ...finalSettings,
        ...localConfig
      };

      welcomeSubject = finalSettings.welcomeEmailSubject || welcomeSubject;
      welcomeBody = finalSettings.welcome_email_template || finalSettings.welcomeEmailBody || finalSettings.welcome_email_template;

      // Substitute placeholders
      const personalizedSubject = replaceEmailPlaceholders(welcomeSubject, finalSettings, {
        fullName: regData.fullName,
        role: regData.role,
        linkedinUrl: regData.linkedinUrl
      });

      const personalizedBody = replaceEmailPlaceholders(welcomeBody, finalSettings, {
        fullName: regData.fullName,
        role: regData.role,
        linkedinUrl: regData.linkedinUrl
      });

      // Trigger transactional welcome email via Resend
      const emailResult = await sendEmailViaResend(regData.email, personalizedSubject, personalizedBody);

      res.json({
        success: true,
        message: "Registration recorded successfully",
        registration: {
          id: docId,
          ...regData,
          registeredAt: new Date(regData.registeredAt).toLocaleString()
        },
        emailSent: emailResult.success,
        emailError: emailResult.success ? undefined : emailResult.error
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to process registration",
      });
    }
  });

  // API: Retrieve registrations for Admin page (from Firestore)
  app.get("/api/admin/registrations", requireAdminAuth, async (req, res) => {
    try {
      const roleFilter = req.query.role as string;
      let list: any[] = [];

      try {
        const db = getFirestoreDb();
        let querySnapshot;
        try {
          querySnapshot = await getDocs(collection(db, "registrations"));
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, "registrations");
          throw err;
        }
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
      } catch (dbErr) {
        console.error("Error fetching registrations from Firestore:", dbErr);
        if (fs.existsSync(REGISTRATIONS_FILE_PATH)) {
          try {
            list = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE_PATH, "utf-8"));
          } catch (e) {}
        }
      }

      // Sort by registration date descending
      list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

      if (roleFilter && roleFilter !== "all") {
        list = list.filter(r => String(r.role || "").toLowerCase() === roleFilter.toLowerCase());
      }

      res.json(list);
    } catch (err: any) {
      console.error("Error retrieving admin registrations:", err);
      res.status(500).json({ error: "Failed to fetch registrations: " + err.message });
    }
  });

  // API: Save settings from Admin page directly into Firestore
  app.post("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const updated = req.body;
      if (!updated || !updated.name) {
        return res.status(400).json({ error: "Invalid configurations" });
      }

      await saveHackathonConfig(updated);
      res.json({ success: true, message: "Settings saved successfully." });
    } catch (err: any) {
      console.error("Error saving settings:", err);
      res.status(500).json({ error: "Failed to save settings: " + err.message });
    }
  });

  // API: Trigger Daily Reminder Check manually
  app.post("/api/admin/trigger-reminders", requireAdminAuth, async (req, res) => {
    try {
      const result = await checkAndSendDailyReminders();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });

  // API: Send Test Email via Resend
  app.post("/api/admin/test-email", requireAdminAuth, async (req, res) => {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing required fields (to, subject, html)" });
    }

    const result = await sendEmailViaResend(to, subject, html);
    if (result.success) {
      res.json({ success: true, message: "Test email successfully sent!" });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  });

  // API: Test Template Email (either welcome or reminder)
  app.post("/api/admin/test-template-email", requireAdminAuth, async (req, res) => {
    const { email, type } = req.body;
    if (!email || !type) {
      return res.status(400).json({ error: "Missing required fields (email, type)" });
    }

    try {
      // 1. Fetch settings (from Firestore, fallback to defaults)
      let finalSettings: any = {
        whatsapp_link: "https://chat.whatsapp.com/BincomHackathon",
        slack_link: "https://bincom.net/bincomtechnetwork",
        kickoff_event_link: "https://bincom.net/hackathon",
        welcome_email_template: `<h2>Hello {{name}},</h2>
<p>Thank you for registering for the <strong>Bincom Hackathon</strong> as a <strong>{{role}}</strong>!</p>
<p>Here are your essential onboarding links:</p>
<ul>
  <li><strong>WhatsApp Group:</strong> <a href="{{whatsapp_link}}">{{whatsapp_link}}</a></li>
  <li><strong>Slack Channel:</strong> <a href="{{slack_link}}">{{slack_link}}</a></li>
  <li><strong>Kick-off Event:</strong> <a href="{{kickoff_event_link}}">{{kickoff_event_link}}</a></li>
</ul>
<p>The hackathon starts on <strong>{{start_date}}</strong> and ends on <strong>{{end_date}}</strong>.</p>
<p>Get ready to hack!</p>`,
        reminder_email_template: `<h2>Hello {{name}},</h2>
<p>This is a quick reminder that the <strong>Bincom Hackathon</strong> is starting in exactly <strong>{{days}} days</strong>!</p>
<p>Here are your essential onboarding links to prepare:</p>
<ul>
  <li><strong>WhatsApp Group:</strong> <a href="{{whatsapp_link}}">{{whatsapp_link}}</a></li>
  <li><strong>Slack Channel:</strong> <a href="{{slack_link}}">{{slack_link}}</a></li>
  <li><strong>Kick-off Event:</strong> <a href="{{kickoff_event_link}}">{{kickoff_event_link}}</a></li>
</ul>
<p>Start Date: <strong>{{start_date}}</strong></p>
<p>Get ready to hack!</p>`,
        welcomeEmailSubject: "Confirming your Bincom Hackathon Registration - {{role}}",
        reminderEmailSubject: "Reminder: Bincom Hackathon starts in {{days}} days!"
      };

      const localConfig = await getHackathonConfig();
      finalSettings = {
        ...finalSettings,
        ...localConfig
      };

      let subjectTemplate = "";
      let bodyTemplate = "";
      let mockRecipient: any = {};

      if (type === "welcome") {
        subjectTemplate = finalSettings.welcomeEmailSubject || "Welcome to the Bincom Hackathon! - {{role}}";
        bodyTemplate = finalSettings.welcome_email_template || finalSettings.welcomeEmailBody || finalSettings.welcome_email_template;
        mockRecipient = {
          fullName: "Jane Doe (Test Recipient)",
          role: "Developer",
          linkedinUrl: "https://linkedin.com/in/test-developer"
        };
      } else if (type === "reminder") {
        subjectTemplate = finalSettings.reminderEmailSubject || "Reminder: Bincom Hackathon starts in {{days}} days!";
        bodyTemplate = finalSettings.reminder_email_template || finalSettings.reminderEmailBody || finalSettings.reminder_email_template;
        mockRecipient = {
          fullName: "John Doe (Test Recipient)",
          role: "Mentor",
          days: 5,
          linkedinUrl: "https://linkedin.com/in/test-mentor"
        };
      } else {
        return res.status(400).json({ error: "Invalid email type (must be 'welcome' or 'reminder')" });
      }

      // Substitute placeholders
      const subject = replaceEmailPlaceholders(subjectTemplate, finalSettings, mockRecipient);
      const body = replaceEmailPlaceholders(bodyTemplate, finalSettings, mockRecipient);

      // Trigger email via Resend
      const emailResult = await sendEmailViaResend(email, subject, body);
      if (emailResult.success) {
        res.json({ success: true, message: `Test ${type} email successfully sent to ${email}!` });
      } else {
        res.status(500).json({ success: false, error: emailResult.error });
      }
    } catch (err: any) {
      console.error("Error sending test template email:", err);
      res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
