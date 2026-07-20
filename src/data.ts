import { LocationInfo, TimelineEvent, FaqItem, CarouselSlide } from "./types";

export const LOCATIONS: LocationInfo[] = [
  { name: "Ikorodu", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Zawaciki", cityOrState: "Kano", country: "Nigeria", isVirtual: false },
  { name: "Yaba", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Ikeja", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Ikotun", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Ikoyi", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Okota", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Ikota", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Ejigbo", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Oshodi", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Ayobo", cityOrState: "Lagos", country: "Nigeria", isVirtual: false },
  { name: "Nottingham", cityOrState: "England", country: "United Kingdom", isVirtual: false },
  { name: "Tbilisi", cityOrState: "Tbilisi", country: "Georgia", isVirtual: false },
  { name: "Kampala", cityOrState: "Kampala", country: "Uganda", isVirtual: false }
];

export const TIMELINE: TimelineEvent[] = [
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
];

export const FAQS: FaqItem[] = [
  {
    question: "What is a Hackathon?",
    answer: "A hackathon is a collaborative event where participants work in teams to create innovative solutions, typically in the form of software, within a limited time frame."
  },
  {
    question: "Who can participate in the Bincom Hackathon?",
    answer: "Bincom Hackathon is open to individuals with diverse backgrounds, including students, professionals, and enthusiasts in fields like software development, design, data science, and business. Participants should have a passion for learning and be eager to collaborate on creating innovative solutions."
  },
  {
    question: "How do I register for the hackathon?",
    answer: "You can register for the hackathon through our online registration portal. Please fill out the required information and submit the form on this page. You will receive a confirmation email upon successful registration."
  },
  {
    question: "Is there a registration fee for the hackathon?",
    answer: "No, there is no registration fee. Participation in the Bincom Hackathon is entirely free of charge!"
  },
  {
    question: "How are teams formed?",
    answer: "Teams can be formed prior to the event or during the team formation session at the beginning of the hackathon. Each team should have 2-5 members, and we encourage a mix of skills and expertise for optimal collaboration."
  },
  {
    question: "Can I submit a project I have already been working on?",
    answer: "Submission of Already in Progress Project: All projects must be started and completed during the hackathon. Pre-existing projects are not eligible."
  },
  {
    question: "What are the judging criteria?",
    answer: "Judging Criteria: Projects will be judged based on their innovation, technical complexity, design, impact, and presentation. The exact criteria and weightage will be announced during the kick-off events. Judging process will involve Community Judges. Community Judges will select the top 5 solutions, upon public review done on our LinkedIn handle, short list to the top 3 product solutions, and lastly, a group of top internal professionals will review leading to the announcement of the winner."
  },
  {
    question: "What are the prizes for the winning teams?",
    answer: "Prize for Winners: Prizes for the hackathon winning team, alongside certificates of participation and potential internship or incubation opportunities at Bincom Dev Center."
  },
  {
    question: "How can I stay updated on the event?",
    answer: "Staying Updated: You can stay updated by following our social media channels, checking your registered email regularly for hackathon updates, and receiving event notifications directly on this portal."
  },
  {
    question: "How many virtual check-ins are available?",
    answer: "Virtual Check-ins: Participants are open to two check-in sessions on the same day. The first check-in starts by 11:00 AM (WAT) on September 19th (Saturday). On this note, participants must ensure that their teams have been formed and registered before 12:00 PM (WAT) on September 19th."
  },
  {
    question: "Is there a code of conduct for the hackathon?",
    answer: "Code of Conduct: Yes, all participants must adhere to the hackathon's code of conduct, which emphasizes mutual respect, inclusivity, and collaboration. Violation of the code of conduct may result in disqualification and removal from the event."
  }
];

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    badge: "HACKATHON",
    title: "Hac</ing GenAI 5.0",
    subtitle: "Build the next big thing with generative AI in 24 hours or less.",
    details: [
      "Start: Thursday 17th September, 2026 - 6:00 pm WAT",
      "Ends: Friday 18th September, 2026 - 7:00 pm WAT"
    ],
    footerText: "Register at: bincom.net/hackathon",
    tags: ["GenAI", "Innovation", "24 Hours"]
  },
  {
    id: 2,
    badge: "ABOUT THE EVENT",
    title: "Bincom Hackathon",
    subtitle: "An innovation-focused competition that brings together individuals across multiple career tracks (primarily Tech & Business) with various skillsets to ideate, innovate, and create solutions for real-world problems leveraging technology.",
    footerText: "Follow us: @bincomdevcenter",
    tags: ["Collaboration", "Ideate", "Network"]
  },
  {
    id: 3,
    badge: "THE HACKATHON GOAL",
    title: "The Goal",
    subtitle: "Using generative AI to develop an innovative product or solution that solves the problems of young Techies, contributing to positive influence in society.",
    footerText: "Build. Connect. Empower.",
    tags: ["Social Impact", "GenAI Tools", "Techies"]
  },
  {
    id: 4,
    badge: "TEAM CHALLENGE",
    title: "Are you and your friends solution-driven tech geniuses?",
    subtitle: "Gather your friends, form a team, accept the challenge, and build the future of AI! Leverage advanced large language models to construct groundbreaking products.",
    footerText: "Register below to secure your spot!",
    tags: ["Teamwork", "Genius", "Problem Solvers"]
  },
  {
    id: 5,
    stepNumber: 1,
    badge: "ROADMAP",
    title: "Step #1: Register",
    subtitle: "Register for the Hackathon online on this landing page. Provide your real role and LinkedIn link.",
    footerText: "Registration takes less than 2 minutes.",
    tags: ["Sign Up", "Profile", "Get Started"]
  },
  {
    id: 6,
    stepNumber: 2,
    badge: "ROADMAP",
    title: "Step #2: Kick-off",
    subtitle: "join our physical kick-off events or virtual kick-off event to meet teammates and assemble groups of 2-5.",
    details: [
      "virtual kick-off event : https://bincom.net/virtual-hackathon",
      "physical kick off events: http://bincomdevcenter.com/communityevents"
    ],
    footerText: "Attend physical hubs to network closer!",
    tags: ["Physical Hubs", "Team Building", "Hybrid"]
  },
  {
    id: 7,
    stepNumber: 3,
    badge: "ROADMAP",
    title: "Step #3: Ideation",
    subtitle: "Come up with a groundbreaking and unique solution idea in line with the theme: hacking genAI 6.0 : Build the next big thing Generative AI",
    footerText: "Brainstorm with mentors during check-ins.",
    tags: ["Brainstorm", "AI Models", "Strategy"]
  },
  {
    id: 8,
    stepNumber: 4,
    badge: "ROADMAP",
    title: "Step #4: Presentation",
    subtitle: "Submit a compelling slide-deck and demo video showcasing your team's innovation at the provided submission link.",
    footerText: "Highlight impact, UX, and AI usage.",
    tags: ["Pitch Deck", "Video Demo", "Submit"]
  },
  {
    id: 9,
    stepNumber: 5,
    badge: "ROADMAP",
    title: "Step #5: Celebration",
    subtitle: "Outstanding teams will be announced on our platform",
    footerText: "Follow our platform for official announcements.",
    tags: ["Winners", "Recognition", "Opportunities"]
  },
  {
    id: 10,
    badge: "TEAM RULES",
    title: "Team Structure Rules",
    subtitle: "Must be a team of no more than 5 individuals, consisting of at least one of the following roles:",
    details: [
      "Product Manager (PM)",
      "Product Designer (UI/UX)",
      "Frontend Developer",
      "Backend Developer",
      "AI / Machine Learning Engineer"
    ],
    footerText: "Build. Connect. Empower.",
    tags: ["Role Diversity", "Max 5 People", "Collaboration"]
  }
];
