export interface HackathonConfig {
  name: string;          // e.g. "Bincom Hackathon March 2026"
  theme: string;         // e.g. "Hacking genAI"
  edition: string;       // e.g. "5.0"
  subtitle: string;      // e.g. "Building the Next Big Thing with generative AI in 24 Hours or Less."
  month: string;         // e.g. "March"
  year: string;          // e.g. "2026"
  startDate: string;     // e.g. "Saturday 20th March, 2026"
  startTime: string;     // e.g. "6:00 PM WAT"
  endDate: string;       // e.g. "Sunday 21st March, 2026"
  endTime: string;       // e.g. "7:00 PM WAT"
  registrationUrl: string; // e.g. "bincom.net/hackathon"
  physicalNoticeUrl: string; // e.g. "https://bincom.net/kickoffevents"
  flyerType?: "html" | "image"; // toggle between HTML representation and static image
  flyerImageUrl?: string; // dynamic URL of the flyer image
  virtualUrl?: string; // customizable URL for virtual link
  logoUrl?: string; // customizable URL for logo image
  locations?: LocationInfo[]; // customizable locations list
  timeline?: TimelineEvent[]; // customizable timeline events
  
  // Custom Dynamic Onboarding Links & Dates
  whatsapp_link?: string;
  slack_link?: string;
  kickoff_event_link?: string;
  startDateFormatted?: string;
  endDateFormatted?: string;

  // Raw Database templates and settings
  welcome_email_template?: string;
  reminder_email_template?: string;
  welcomeEmailSubject?: string;
  welcomeEmailBody?: string;
  reminderEmailSubject?: string;
  reminderEmailBody?: string;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  linkedinUrl: string;
  registeredAt: string;
}

export interface LocationInfo {
  name: string;
  cityOrState: string;
  country: string;
  isVirtual: boolean;
  link?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  url?: string;
  linkText?: string;
  highlighted?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  badge?: string;
  details?: string[];
  footerText?: string;
  stepNumber?: number;
  tags?: string[];
}
