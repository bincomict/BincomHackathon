import React, { useState, useEffect } from "react";
import { Terminal, Calendar, MapPin, Award } from "lucide-react";
import { HackathonConfig } from "../types";

interface HeaderProps {
  config: HackathonConfig;
  onUpdate?: (newConfig: HackathonConfig) => void;
}

export default function Header({ config, onUpdate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [config.logoUrl]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center">
          <div 
            className="h-12 flex items-center justify-center shrink-0"
          >
            {config.logoUrl && !logoError ? (
              <img 
                src={config.logoUrl} 
                alt="Logo" 
                className="max-h-full w-auto object-contain transition-transform hover:scale-105" 
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-display font-black text-2xl text-slate-950 tracking-tighter hover:text-[#90c649] transition-colors">B</span>
            )}
          </div>
        </div>

        {/* Quick Nav / Badges */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
          <a
            href="#about"
            className="text-slate-600 hover:text-slate-900 transition-colors px-2 py-1.5"
          >
            About
          </a>
          <a
            href="#locations"
            className="text-slate-600 hover:text-slate-900 transition-colors px-2 py-1.5 hidden md:inline"
          >
            Kick-off Events
          </a>
          <a
            href="#timeline"
            className="text-slate-600 hover:text-slate-900 transition-colors px-2 py-1.5 hidden md:inline"
          >
            Timeline
          </a>
          <a
            href="#faqs"
            className="text-slate-600 hover:text-slate-900 transition-colors px-2 py-1.5"
          >
            FAQs
          </a>
          <a
            href="#register"
            className="bg-slate-900 text-white hover:bg-slate-800 transition-all px-4 py-2 rounded-xl font-display font-medium shadow-sm active:scale-95"
          >
            Register Now
          </a>
        </div>
      </div>
    </header>
  );
}
