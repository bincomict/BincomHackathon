import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import RegistrationForm from "./components/RegistrationForm";
import Locations from "./components/Locations";
import Timeline from "./components/Timeline";
import Carousel from "./components/Carousel";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import { HackathonConfig } from "./types";
import { TIMELINE } from "./data";
import { Calendar } from "lucide-react";

const INITIAL_CONFIG: HackathonConfig = {
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
  physicalNoticeUrl: "https://bincom.net/kickoffevents",
  flyerType: "html",
  flyerImageUrl: "/bincom_hackathon_flyer.jpg",
  logoUrl: "/logo.png",
  timeline: TIMELINE
};

export default function App() {
  const [config, setConfig] = useState<HackathonConfig>(INITIAL_CONFIG);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Single page routing detection for /admin path
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase();
      setIsAdmin(path === "/admin" || path === "/admin/");
    };
    handleLocation();

    window.addEventListener("popstate", handleLocation);
    return () => window.removeEventListener("popstate", handleLocation);
  }, []);

  useEffect(() => {
    // Fetch live config from server API
    fetch("/api/hackathon")
      .then((res) => {
        if (!res.ok) throw new Error("Server error fetching config");
        return res.json();
      })
      .then((data) => {
        if (data && data.name) {
          setConfig(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load backend hackathon config:", err);
      });
  }, []);

  const navigateToHome = () => {
    window.history.pushState({}, "", "/");
    setIsAdmin(false);
  };

  if (isAdmin) {
    return <AdminDashboard onBackToSite={navigateToHome} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-brand-primary selection:text-slate-900 scroll-smooth">
      {/* Sticky Header Navigation */}
      <Header config={config} onUpdate={setConfig} />

      {/* Main Container */}
      <main className="flex-grow pb-16">
        
        {/* 1. Hero Block (Vibrant Banner + CTA) */}
        <Hero config={config} />

        {/* 2. About section & Cyber Flyer Poster */}
        <About config={config} onUpdate={setConfig} />

        {/* 3. Interactive Hub Locations & Physical check-ins */}
        <Locations config={config} />

        {/* Highlight Date Block - Recreating the Lime Calendar Box exactly from the video */}
        <section className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-8">
          <div className="bg-brand-banner rounded-3xl p-8 sm:p-12 border border-lime-300 shadow-md text-center relative overflow-hidden transition-all hover:scale-[1.01] duration-300">
            {/* Visual tech grid overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />
            
            <div className="w-16 h-16 rounded-full bg-slate-900/10 flex items-center justify-center text-slate-900 mx-auto mb-4">
              <Calendar className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
              Date:
            </h3>
            
            <p className="font-display font-bold text-lg sm:text-2xl text-slate-900 mt-4 max-w-2xl mx-auto leading-relaxed">
              The hackathon will start with the kick off event on {config.startDateFormatted || config.startDate} at {config.startTime}. Can't wait to see you there!
            </p>
          </div>
        </section>

        {/* 4. Connected Vertical Hackathon Timeline */}
        <Timeline config={config} />

        {/* 5. Custom Guidelines Slideshow Carousel (10 high-fi slides) */}
        <Carousel config={config} />

        {/* 6. Active Registration Form & Pass Ticket Generator */}
        <RegistrationForm config={config} />

        {/* 7. Searchable FAQs accordion */}
        <FAQ config={config} />

      </main>

      {/* Footer copyright block */}
      <Footer config={config} onUpdate={setConfig} />
    </div>
  );
}
