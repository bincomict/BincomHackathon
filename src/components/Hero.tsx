import React from "react";
import { Sparkles, ArrowRight, Code } from "lucide-react";
import { HackathonConfig } from "../types";

interface HeroProps {
  config: HackathonConfig;
}

export default function Hero({ config }: HeroProps) {
  const scrollToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("register");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const themeParts = config.theme.split(" ");
  const themeFirst = themeParts[0] || "Hacking";
  const themeRest = themeParts.slice(1).join(" ") || "genAI";

  return (
    <section id="hero" className="max-w-4xl lg:max-w-6xl mx-auto px-4 pt-8 pb-10">
      {/* Lime Banner Block */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-banner shadow-xl border border-lime-300 p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.01] duration-300">
        
        {/* Subtle Tech Accents (Grid lines removed as requested) */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl" />

        {/* Small floating items for extra polish - Star icon removed as requested */}
        <div className="relative flex items-center gap-2 bg-slate-950/10 backdrop-blur-md text-slate-950 text-sm font-display px-4 py-1.5 rounded-full mb-6 font-black uppercase tracking-wider border border-white/30">
          Bincom Hackathon {config.month} {config.year}
        </div>

        {/* The Huge Hero Text - Increased to font-black and font-bold styles with extra weight */}
        <h1 className="relative font-display font-black tracking-tight leading-none text-slate-950 flex flex-col gap-1 select-none">
          <span className="text-5xl sm:text-7xl md:text-8xl block uppercase font-black text-slate-900 font-extrabold tracking-tight">
            {themeFirst}
          </span>
          <span className="text-5xl sm:text-7xl md:text-8xl block font-black text-white drop-shadow-md font-extrabold tracking-tight">
            {themeRest}
          </span>
        </h1>

        <div className="relative mt-8 max-w-sm h-1 w-24 bg-white rounded-full mx-auto" />
      </div>

      {/* Subtitle text below the banner as in the video */}
      <div className="text-center mt-8 px-4">
        <p className="font-display text-lg sm:text-2xl font-bold text-slate-800 leading-relaxed max-w-2xl mx-auto">
          {config.subtitle}
        </p>
        <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">
          Join forces with designers, developers, and product managers to create high-impact solutions leveraging on Technology
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={scrollToRegister}
            className="group bg-slate-900 text-white hover:bg-slate-800 px-6 py-3.5 rounded-2xl font-display font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm active:scale-95 cursor-pointer"
          >
            Join Hackathon
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a
            href="#about"
            className="bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-6 py-3.5 rounded-2xl font-display font-semibold shadow-sm transition-all text-sm active:scale-95"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
