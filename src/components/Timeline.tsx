import { TIMELINE } from "../data";
import { TimelineEvent, HackathonConfig } from "../types";
import { Calendar, Clock, Link as LinkIcon, Flag, Trophy, CheckCircle2 } from "lucide-react";

export default function Timeline({ config }: { config: HackathonConfig }) {
  const activeTimeline = config.timeline || TIMELINE;

  return (
    <section id="timeline" className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-12 scroll-mt-20">
      
      {/* Title block */}
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
          Hackathon Timeline
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Keep track of important check-ins, registration cutoffs, project submission deadlocks, and announcements.
        </p>
      </div>

      {/* Main Timeline graphic structure */}
      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-10 py-2">
        
        {activeTimeline.map((event, index) => {
          const isWinner = event.title.toLowerCase().includes("winner") || event.title.includes("🏆");
          const isKickoff = event.title.toLowerCase().includes("kickoff") || event.title.toLowerCase().includes("kick-off");
          
          return (
            <div key={event.id} className="relative group pl-8">
              
              {/* Timeline Connector Dot / Custom Icon */}
              <span className={`absolute -left-3 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                isWinner 
                  ? "bg-amber-500 border-amber-100 ring-4 ring-amber-500/10 text-white" 
                  : isKickoff 
                  ? "bg-brand-primary border-brand-light ring-4 ring-brand-primary/20 text-slate-900" 
                  : "bg-white border-slate-200 group-hover:border-slate-400"
              }`}>
                {isWinner ? (
                  <Trophy className="w-2.5 h-2.5" />
                ) : isKickoff ? (
                  <Flag className="w-2.5 h-2.5" />
                ) : (
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full group-hover:bg-slate-600" />
                )}
              </span>

              {/* Sidebar Left Date (visible on wider screens) */}
              <div className="hidden md:block absolute -left-36 top-1 w-28 text-right">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tight block">
                  PHASE {index + 1}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block mt-0.5 font-medium leading-tight">
                  {event.date.split(" (")[0]}
                </span>
              </div>

              {/* Timeline Info Box Card */}
              <div className={`p-5 rounded-2xl border transition-all duration-300 group-hover:scale-[1.015] ${
                event.highlighted
                  ? "bg-white border-slate-200/80 shadow-md ring-1 ring-lime-500/15"
                  : "bg-white border-slate-100 shadow-sm"
              }`}>
                <div className="flex flex-wrap items-start justify-between gap-2.5">
                  <div>
                    {/* Small mobile date badge */}
                    <span className="md:hidden inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-mono mb-2">
                      <Clock className="w-3 h-3" />
                      {event.date}
                    </span>
                    
                    <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-2">
                      {event.title}
                      {event.highlighted && (
                        <span className="bg-lime-500/15 text-lime-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-lime-500/20 uppercase tracking-wider">
                          Critical Milestone
                        </span>
                      )}
                    </h3>
                  </div>

                  {/* Desktop Date Badge */}
                  <span className="hidden md:inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 rounded-xl text-xs font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {event.date}
                  </span>
                </div>

                {event.description && (
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    {event.description}
                  </p>
                )}

                {/* Event URLs (Submission links, LinkedIn paths etc) */}
                {event.url && (
                  <div className="mt-3.5">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-brand-light text-slate-700 hover:text-brand-dark border border-slate-200/80 hover:border-brand-primary/30 px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium transition-all"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      {event.linkText || "Visit Link"}
                    </a>
                  </div>
                )}
              </div>

            </div>
          );
        })}
        
      </div>
    </section>
  );
}
