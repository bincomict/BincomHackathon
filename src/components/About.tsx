import React, { useState, useEffect } from "react";
import { ArrowRight, Info } from "lucide-react";
import { HackathonConfig } from "../types";

interface AboutProps {
  config: HackathonConfig;
  onUpdate?: (newConfig: HackathonConfig) => void;
}

export default function About({ config, onUpdate }: AboutProps) {
  const [flyerSrc, setFlyerSrc] = useState(config.flyerImageUrl || "/bincom_hackathon_flyer.jpg");

  useEffect(() => {
    setFlyerSrc(config.flyerImageUrl || "/bincom_hackathon_flyer.jpg");
  }, [config.flyerImageUrl]);

  const scrollToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("register");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="about" className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-12">
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 sm:p-12">
          
          {/* Title section */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-dark">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              About this Hackathon
            </h2>
          </div>

          {/* Description Text */}
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base max-w-3xl">
            <p>
              More than <strong className="text-slate-900 font-semibold">400+ Global participants</strong> will be contributing. No one is expected to work alone as individuals will work in groups with others. Do note that inviting your friends will help as well.
            </p>
            <p>
              This is a hybrid innovation-focused sprint where developers, designers, product managers, and AI specialists unite globally to develop actual, working software models powered by generative AI.
            </p>
          </div>

          {/* Register Action Button */}
          <div className="mt-8">
            <button
              onClick={scrollToRegister}
              className="bg-brand-primary text-slate-900 hover:bg-brand-banner font-display font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              Register
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Digital Poster / Flyer */}
          {config.flyerType === "image" ? (
            <div className="mt-12 relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl group max-w-3xl mx-auto">
              <img
                src={flyerSrc}
                alt={config.name}
                referrerPolicy="no-referrer"
                onError={() => {
                  setFlyerSrc("/bincom_hackathon_flyer.jpg");
                }}
                className="w-full h-auto object-cover rounded-2xl max-h-[950px] transition-transform duration-500 group-hover:scale-[1.003]"
              />
            </div>
          ) : (
            <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063a18] via-[#094d20] to-[#012510] text-white border border-emerald-800/40 shadow-2xl">
              
              {/* Vibrant green ambient glowing auras */}
              <div className="absolute top-10 right-1/4 w-72 h-72 bg-[#8cc63f]/20 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
              
              {/* Premium digital network connection nodes and matrix lines overlay */}
              <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#8cc63f_1px,transparent_1px),linear-gradient(to_bottom,#8cc63f_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />

              {/* Flyer Top Header Row */}
              <div className="relative flex justify-between items-start z-20">
                
                {/* Brand Black Curved Tab on Top-Left */}
                <div className="bg-[#050505] text-white px-6 py-5 rounded-br-3xl flex items-center gap-3 border-r border-b border-[#111] shadow-xl">
                  <div className="w-9 h-9 rounded-full border-2 border-[#8cc63f]/80 p-1 flex items-center justify-center bg-slate-900/60 shadow-[0_0_12px_rgba(140,198,63,0.3)]">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#8cc63f] stroke-current fill-none">
                      <circle cx="50" cy="50" r="38" strokeWidth="6" />
                      <circle cx="50" cy="50" r="18" strokeWidth="4" />
                      <line x1="15" y1="50" x2="85" y2="50" strokeWidth="5" />
                      <line x1="50" y1="15" x2="50" y2="85" strokeWidth="5" />
                      <circle cx="50" cy="15" r="7" fill="currentColor" />
                      <circle cx="50" cy="85" r="7" fill="currentColor" />
                      <circle cx="15" cy="50" r="7" fill="currentColor" />
                      <circle cx="85" cy="50" r="7" fill="currentColor" />
                      <circle cx="50" cy="50" r="10" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider leading-none">
                      Bincom Dev Center
                    </h4>
                    <p className="text-[8px] text-[#8cc63f] font-mono tracking-widest uppercase mt-1">Global Sandbox</p>
                  </div>
                </div>

                {/* Black pill "HACKATHON" badge on Top-Right */}
                <div className="pt-5 pr-5 sm:pr-8">
                  <div className="bg-[#050505] text-white border-2 border-white rounded-full px-5 py-2 text-[10px] sm:text-xs font-black tracking-widest font-mono uppercase shadow-md select-none">
                    HACKATHON
                  </div>
                </div>

              </div>

              {/* Flyer Grid Content */}
              <div className="relative grid md:grid-cols-12 gap-6 items-stretch z-10">
                
                {/* Left Section: Texts and details (7 spans) */}
                <div className="md:col-span-7 p-6 sm:p-10 pt-4 flex flex-col justify-between space-y-8">
                  
                  {/* Category Pill: "Hacking genAI" with White Background and Green Text */}
                  <div>
                    <span className="inline-block bg-white text-[#013518] font-display font-black text-xs sm:text-sm px-6 py-2 rounded-full shadow-lg border border-slate-100 select-none uppercase tracking-wide">
                      Hacking genAI
                    </span>
                  </div>

                  {/* Large Flyer Title Heading */}
                  <div className="space-y-4">
                    <h3 className="text-4xl sm:text-5xl md:text-[54px] font-display font-black text-white tracking-tight leading-none uppercase select-none">
                      Hac&lt;/ing&gt; <br />
                      <span className="text-white font-extrabold tracking-tight block mt-2 text-4xl sm:text-5xl md:text-[58px]">
                        {config.theme.split(" ")[1] || "GenAI"} {config.edition}
                      </span>
                    </h3>
                    <p className="text-slate-100/90 text-sm sm:text-base leading-relaxed font-normal max-w-md select-none">
                      {config.subtitle}
                    </p>
                  </div>

                  {/* Olive/Grass Green Schedule Card */}
                  <div className="bg-[#8cc63f] text-[#012510] p-5 sm:p-6 rounded-3xl shadow-xl border border-white/10 font-display select-none">
                    <div className="space-y-3 text-xs sm:text-sm font-black">
                      <p className="flex items-start gap-1">
                        <span className="uppercase tracking-wider text-[10px] text-[#012510]/60 block w-14 shrink-0 pt-0.5">Start:</span>
                        <span className="text-[#012510] font-extrabold">
                          {config.startDate} - {config.startTime}
                        </span>
                      </p>
                      <p className="flex items-start gap-1 border-t border-[#012510]/10 pt-3">
                        <span className="uppercase tracking-wider text-[10px] text-[#012510]/60 block w-14 shrink-0 pt-0.5">Ends:</span>
                        <span className="text-[#012510] font-extrabold">
                          {config.endDate} - {config.endTime}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Register Section matching bottom-left exactly */}
                  <div className="space-y-2">
                    <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-white/70 block">
                      Register at
                    </span>
                    <a 
                      href={`https://${config.registrationUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-slate-50 text-slate-900 font-display font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-slate-200 transition-all shadow-md inline-block hover:-translate-y-0.5 duration-200"
                    >
                      https://{config.registrationUrl}
                    </a>
                  </div>

                </div>

                {/* Right Section: Large Golden VR Robot Head with Networking Overlay & Social Pill */}
                <div className="md:col-span-5 p-6 sm:p-10 pt-2 flex flex-col justify-between items-center relative overflow-hidden min-h-[420px] md:min-h-full">
                  
                  {/* The Golden VR Robot head cover picture */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={flyerSrc} 
                      alt="Golden Robot with VR Goggles"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setFlyerSrc("/bincom_hackathon_flyer.jpg");
                      }}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    {/* Dark gradient mask blending the bottom of the picture to match the flyer's slate shadow */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#012510]/95 via-transparent to-transparent h-1/3" />
                  </div>

                  {/* Transparent spacer to push elements to bottom */}
                  <div className="flex-grow z-10" />

                  {/* Social Handles Block at the bottom right */}
                  <div className="w-full max-w-[280px] bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 shadow-xl flex items-center justify-between gap-2.5 z-10 hover:scale-[1.02] transition-transform duration-300 select-none">
                    <div className="flex items-center gap-2">
                      {/* Social Media Network mini icons */}
                      <div className="flex gap-1.5 text-slate-800">
                        {/* IG */}
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-mono font-black" title="Instagram">ig</span>
                        {/* IN */}
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-mono font-black" title="LinkedIn">in</span>
                        {/* FB */}
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-mono font-black" title="Facebook">f</span>
                        {/* X */}
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-mono font-black" title="X (Twitter)">x</span>
                      </div>
                    </div>
                    {/* Handle string */}
                    <span className="font-display font-black text-xs text-slate-900 tracking-wide">
                      bincomdevcenter
                    </span>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
