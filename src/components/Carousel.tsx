import React, { useState, useEffect, useRef } from "react";
import { CAROUSEL_SLIDES } from "../data";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Cpu, 
  Users, 
  Layers, 
  Trophy, 
  CheckCircle, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Link as LinkIcon 
} from "lucide-react";
import { HackathonConfig } from "../types";

// Standard brand SVG for X (formerly Twitter)
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const BACKGROUND_IMAGES: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80", // Hacking GenAI
  2: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80", // About Bincom Hackathon
  3: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80", // The Goal (AI / Robot)
  4: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80", // Challenge (friends collaborating)
  5: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80", // Step 1: Register
  6: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80", // Step 2: Kick-off
  7: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", // Step 3: Ideation
  8: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80", // Step 4: Presentation
  9: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80", // Step 5: Celebration
  10: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80", // Team Rules
};

interface CarouselProps {
  config: HackathonConfig;
}

export default function Carousel({ config }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const themeName = config.theme.split(" ")[1] || "GenAI";
  const dynamicSlides = CAROUSEL_SLIDES.map((slide) => {
    if (slide.id === 1) {
      return {
        ...slide,
        title: `Hac</ing> ${themeName} ${config.edition}`,
        subtitle: config.subtitle,
        details: [
          `Start: ${config.startDate} - ${config.startTime}`,
          `Ends: ${config.endDate} - ${config.endTime}`,
        ],
        footerText: `Register at: ${config.registrationUrl}`,
      };
    }
    if (slide.id === 2) {
      return {
        ...slide,
        title: config.name,
      };
    }
    if (slide.id === 6) {
      return {
        ...slide,
        subtitle: "join our physical kick-off events or virtual kick-off event to meet teammates and assemble groups of 2-5.",
        details: [
          `virtual kick-off event : ${config.virtualUrl || "https://bincom.net/virtual-hackathon"}`,
          `physical kick off events: ${config.physicalNoticeUrl || "http://bincomdevcenter.com/communityevents"}`
        ]
      };
    }
    if (slide.id === 7) {
      return {
        ...slide,
        subtitle: "Come up with a groundbreaking and unique solution idea in line with the theme: hacking genAI 6.0 : Build the next big thing Generative AI"
      };
    }
    if (slide.id === 9) {
      return {
        ...slide,
        subtitle: "Outstanding teams will be announced on our platform",
        details: undefined,
        footerText: "Follow our platform for official announcements."
      };
    }
    if (slide.id === 10) {
      return {
        ...slide,
        footerText: "Build. Connect. Empower."
      };
    }
    return slide;
  });

  const slideCount = dynamicSlides.length;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const resetAutoplay = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetAutoplay();
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 5000); // rotate every 5s
    }
    return () => resetAutoplay();
  }, [activeIndex, isPlaying]);

  // Helper icons for slide categorization
  const getSlideIcon = (slide: typeof CAROUSEL_SLIDES[0]) => {
    if (slide.stepNumber) return <Layers className="w-5 h-5 text-white" />;
    if (slide.title.toLowerCase().includes("goal")) return <Cpu className="w-5 h-5 text-white" />;
    if (slide.title.toLowerCase().includes("structure") || slide.title.toLowerCase().includes("challenge") || slide.title.toLowerCase().includes("friends")) return <Users className="w-5 h-5 text-white" />;
    return <Trophy className="w-5 h-5 text-white" />;
  };

  return (
    <section id="guidelines-slides" className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-12 scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Hackathon Guidelines Slideshow
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Swipe or use the arrows to study the official checklist, rules, and structures.
          </p>
        </div>
        
        {/* Play/Pause controls */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all flex items-center justify-center cursor-pointer active:scale-95"
          title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />}
        </button>
      </div>

      {/* Slide Carousel Window Frame - Colored using #0a0f1d for maximum professional look and text readability */}
      <div 
        className="relative min-h-[440px] rounded-3xl text-white border border-white/20 shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden group select-none transition-all duration-300"
        style={{ backgroundColor: "#0a0f1d" }}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Dynamic Slide Background Image with Faded Overlay for Maximum Text Readability */}
        {BACKGROUND_IMAGES[dynamicSlides[activeIndex]?.id] && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img 
              src={BACKGROUND_IMAGES[dynamicSlides[activeIndex].id]} 
              alt="" 
              className="w-full h-full object-cover opacity-25 mix-blend-overlay" 
              referrerPolicy="no-referrer"
            />
            {/* Dark mask overlay to guarantee maximum readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Hackathon-themed Background Graphics (Faded beautifully to ensure supreme readability) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* 1. Abstract network grids / dots pattern */}
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <svg className="absolute inset-0 w-full h-full text-white/[0.07]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
            <circle cx="15%" cy="35%" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
            <circle cx="85%" cy="65%" r="110" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M-10,120 L130,260 M550,60 L720,240 M200,390 L340,420" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
          </svg>

          {/* 2. Large central HTML/bracket watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.06] font-mono text-[240px] font-black leading-none tracking-tighter">
            {"</>"}
          </div>

          {/* 3. Tech console/terminal watermark lines */}
          <div className="absolute top-14 left-14 font-mono text-[11px] text-white/[0.08] space-y-1 hidden md:block">
            <div>&gt;_ init_hackathon_flow --edition="6.0"</div>
            <div>&gt;_ status: live [optimal_build]</div>
            <div>&gt;_ core: genAI_neural_networks</div>
          </div>

          {/* 4. Binary stream watermark */}
          <div className="absolute bottom-20 right-14 font-mono text-[10px] text-white/[0.08] text-right space-y-0.5 hidden sm:block">
            <div>01100110 01111001</div>
            <div>01100101 01110010</div>
            <div>01101111 01101110</div>
            <div>01100101 01110100</div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/20 hover:bg-slate-950/40 border border-white/20 text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer active:scale-90 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/20 hover:bg-slate-950/40 border border-white/20 text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer active:scale-90 shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Active Slide Renderer */}
        {dynamicSlides.map((slide, idx) => {
          if (idx !== activeIndex) return null;
          return (
            <div key={slide.id} className="animate-fade-in flex flex-col justify-between h-full space-y-6 relative z-10 min-h-[360px]">
              
              {/* Slide Top Metadata */}
              <div className="flex justify-between items-center border-b border-white/20 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
                    {getSlideIcon(slide)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-white font-mono font-extrabold block leading-none drop-shadow-sm">
                      {slide.badge}
                    </span>
                    {slide.stepNumber && (
                      <span className="text-[9px] text-white/90 font-mono font-bold block mt-1 drop-shadow-sm">STEP {slide.stepNumber} OF 5</span>
                    )}
                  </div>
                </div>
                
                <span className="text-xs font-mono text-white font-extrabold drop-shadow-sm bg-white/10 px-2 py-0.5 rounded-md">
                  {String(idx + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
                </span>
              </div>

              {/* Slide Content Core */}
              <div className="space-y-4 py-2 max-w-2xl flex-1">
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {slide.title}
                </h3>
                
                <p className="text-white text-sm sm:text-base leading-relaxed font-bold drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)]">
                  {slide.subtitle}
                </p>

                {/* Optional slide bullet points details */}
                {slide.details && slide.details.length > 0 && (
                  <ul className="grid sm:grid-cols-1 gap-2 pt-2">
                    {slide.details.map((detail, dIdx) => {
                      const isLinkDetail = detail.includes("http://") || detail.includes("https://");
                      if (isLinkDetail) {
                        const parts = detail.split(/:(.+)/); // split at first colon
                        const label = parts[0] ? parts[0].trim() : "Link";
                        const url = parts[1] ? parts[1].trim() : "";
                        return (
                          <li key={dIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 bg-slate-950/30 border border-white/20 p-2.5 rounded-xl text-xs text-white font-mono font-bold shadow-sm backdrop-blur-xs">
                            <div className="flex items-center gap-2 shrink-0">
                              <CheckCircle className="w-4 h-4 text-white shrink-0" />
                              <span className="capitalize text-white/90">{label}:</span>
                            </div>
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="underline hover:text-white/80 break-all text-left sm:text-right font-black text-white transition-colors"
                            >
                              {url.replace(/^https?:\/\//, '')}
                            </a>
                          </li>
                        );
                      }
                      return (
                        <li key={dIdx} className="flex items-start gap-2 bg-slate-950/30 border border-white/20 p-2.5 rounded-xl text-[11px] sm:text-xs text-white font-mono font-bold shadow-sm backdrop-blur-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                          <span className="text-white/90">{detail}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Slide Footer - Registration on the left, social media icons on the right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/20 pt-4 text-xs font-mono text-white">
                
                {/* Bottom Left: Hackathon Registration Link */}
                <div className="flex items-center gap-1.5 font-bold text-white drop-shadow-sm">
                  <LinkIcon className="w-4 h-4 shrink-0 text-white" />
                  <span className="font-extrabold text-[11px] sm:text-xs">Registration:</span>
                  <a 
                    href={`https://${config.registrationUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline hover:text-white/80 transition-opacity font-extrabold break-all text-[11px] sm:text-xs"
                  >
                    {config.registrationUrl}
                  </a>
                </div>

                {/* Bottom Right: Social Follow Icons in a Premium Slate-950 Pill with organization RGB icons */}
                <div className="flex items-center gap-2 justify-start sm:justify-end">
                  <span className="font-bold text-white text-[11px] sm:text-xs drop-shadow-sm">Follow us:</span>
                  <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-full shadow-lg border border-white/5">
                    <a 
                      href="https://www.linkedin.com/company/bincomdevcenter/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[rgb(144,198,73)] hover:text-white transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="https://www.instagram.com/bincomdevcenter_?igsh=eTRhZ2Y3bXh4MW5m" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[rgb(144,198,73)] hover:text-white transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="https://www.facebook.com/share/1B4sYTx9hA/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[rgb(144,198,73)] hover:text-white transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="https://x.com/BincomDevcenter" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[rgb(144,198,73)] hover:text-white transition-colors"
                      title="X"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Pagination Page Dots Underneath */}
      <div className="flex justify-center items-center gap-1.5 mt-6">
        {dynamicSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
              idx === activeIndex
                ? "w-6 bg-slate-900"
                : "w-2 bg-slate-200 hover:bg-slate-300"
            }`}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
