import { useState } from "react";
import { LOCATIONS } from "../data";
import { MapPin, Globe, Compass, Check, ExternalLink, Info } from "lucide-react";
import { HackathonConfig } from "../types";

interface LocationsProps {
  config: HackathonConfig;
}

export default function Locations({ config }: LocationsProps) {
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "nigeria" | "international">("all");

  const activeLocations = config.locations || LOCATIONS;

  const filteredLocations = activeLocations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.cityOrState.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.country.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "nigeria") return matchesSearch && loc.country === "Nigeria";
    if (activeTab === "international") return matchesSearch && loc.country !== "Nigeria";
    return matchesSearch;
  });

  const getVenueDetails = (name: string) => {
    const customLoc = activeLocations.find((l) => l.name === name);
    if (customLoc) {
      return {
        address: `${customLoc.name} Center, ${customLoc.cityOrState}, ${customLoc.country}`,
        manager: "District Hub Coordinator",
        time: `${config.startDate} - ${config.startTime} Check-in`
      };
    }

    switch (name) {
      case "Yaba":
        return {
          address: "Bincom Dev Center, 50 Montgomery Road, Yaba, Lagos, Nigeria",
          manager: "Mr. Kunle Adebayo",
          time: `${config.startDate} - ${config.startTime} Check-in`
        };
      case "Ikeja":
        return {
          address: "Ikeja Tech Hub, Allen Avenue, Ikeja, Lagos, Nigeria",
          manager: "Ms. Chidi Amadi",
          time: `${config.startDate} - ${config.startTime} Check-in`
        };
      case "Nottingham":
        return {
          address: "Nottingham CleanTech Centre, Nottingham, NG2 1EE, United Kingdom",
          manager: "Dr. Sarah Jenkins",
          time: `${config.startDate} - 5:30 PM GMT Check-in`
        };
      case "Tbilisi":
        return {
          address: "Silicon Valley Tbilisi campus, Tbilisi, Georgia",
          manager: "Nick Latsabidze",
          time: `${config.startDate} - 7:30 PM GET Check-in`
        };
      case "Kampala":
        return {
          address: "Outbox Hub, Soliz House, Kampala, Uganda",
          manager: "Arthur Kakande",
          time: `${config.startDate} - 6:30 PM EAT Check-in`
        };
      default:
        return {
          address: `Bincom Physical Innovation Hub, ${name}, ${name === "Zawaciki" ? "Kano" : "Lagos"}, Nigeria`,
          manager: "District Hub Coordinator",
          time: `${config.startDate} - ${config.startTime} Check-in`
        };
    }
  };

  return (
    <section id="locations" className="max-w-4xl lg:max-w-6xl mx-auto px-4 py-12 scroll-mt-20">
      <div className="space-y-6">
        
        {/* Main Lime Green Banner exactly like the video */}
        <div className="bg-brand-banner rounded-3xl p-8 sm:p-12 border border-lime-300 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-12 -translate-y-12" />
          
          <div className="w-16 h-16 rounded-full bg-slate-900/10 flex items-center justify-center text-slate-900 mx-auto mb-4">
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>

          <h3 className="font-display font-black text-3xl sm:text-4xl text-slate-950 tracking-tight leading-none">
            <a
              href={config.virtualUrl || "https://bincom.net/virtual-hackathon"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-500 underline transition-all underline-offset-4 decoration-2"
            >
              Virtual
            </a>:
          </h3>
          <p className="font-display text-lg sm:text-xl font-bold text-slate-900 mt-2">
            With Physical Kick-off events at:
          </p>

          {/* Interactive tabs */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-display transition-all ${
                activeTab === "all" ? "bg-slate-900 text-white shadow-sm" : "bg-white/40 text-slate-800 hover:bg-white/60"
              }`}
            >
              All Locations
            </button>
            <button
              onClick={() => setActiveTab("nigeria")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-display transition-all ${
                activeTab === "nigeria" ? "bg-slate-900 text-white shadow-sm" : "bg-white/40 text-slate-800 hover:bg-white/60"
              }`}
            >
              Nigeria Only
            </button>
            <button
              onClick={() => setActiveTab("international")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-display transition-all ${
                activeTab === "international" ? "bg-slate-900 text-white shadow-sm" : "bg-white/40 text-slate-800 hover:bg-white/60"
              }`}
            >
              International
            </button>
          </div>

          {/* Grid list of locations matching video */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredLocations.map((loc) => {
              const isSelected = selectedHub === loc.name;
              return (
                <div
                  key={loc.name}
                  onClick={() => setSelectedHub(isSelected ? null : loc.name)}
                  className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.03] shadow-sm flex flex-col justify-between h-24 relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? "bg-sky-100 border-sky-300 text-sky-950 shadow-md"
                      : "bg-white border-slate-200/80 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className={`text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full font-bold uppercase ${
                      isSelected ? "bg-sky-200 text-sky-800" : "bg-slate-100 text-slate-500"
                    }`}>
                      {loc.country === "Nigeria" ? "NG" : loc.country === "United Kingdom" ? "UK" : loc.country === "Georgia" ? "GE" : loc.country === "Uganda" ? "UG" : (loc.country ? loc.country.slice(0, 2).toUpperCase() : "HB")}
                    </span>
                    <MapPin className={`w-3.5 h-3.5 transition-colors ${
                      isSelected ? "text-sky-600" : "text-slate-300 group-hover:text-slate-400"
                    }`} />
                  </div>

                  <div className="mt-auto">
                    <h4 className="font-display font-bold text-xs sm:text-sm tracking-tight leading-none">
                      <a
                        href={loc.link || "http://bincomdevcenter.com/communityevents"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation(); // Stop click from toggling selected state
                        }}
                        className={`underline transition-all font-bold ${
                          isSelected 
                            ? "text-sky-500 hover:text-sky-600" 
                            : "text-sky-400 hover:text-sky-500"
                        }`}
                      >
                        {loc.name}
                      </a>
                    </h4>
                    <p className={`text-[10px] mt-0.5 font-mono truncate ${isSelected ? "text-sky-700" : "text-slate-500"}`}>
                      {loc.cityOrState}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLocations.length === 0 && (
            <p className="text-slate-600 text-xs mt-8">No physical hubs match your search tab.</p>
          )}

          {/* Click Details Reveal Box */}
          {selectedHub && (
            <div className="mt-6 bg-sky-50 text-slate-800 rounded-2xl p-5 border border-sky-200 text-left animate-fade-in relative shadow-md">
              <div className="flex items-center gap-2 text-sky-800 font-display font-bold text-sm">
                <Compass className="w-4 h-4 animate-spin-slow text-sky-600" />
                {selectedHub} Hub Details
              </div>
              
              <div className="mt-3 space-y-2 text-xs font-mono text-slate-600">
                <p>
                  <strong className="text-slate-900 font-bold">Venue:</strong> {getVenueDetails(selectedHub).address}
                </p>
                <p>
                  <strong className="text-slate-900 font-bold">Supervisor:</strong> {getVenueDetails(selectedHub).manager}
                </p>
                <p>
                  <strong className="text-slate-900 font-bold">Kick-off check-in:</strong> {getVenueDetails(selectedHub).time}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href="#register"
                  className="bg-brand-primary hover:bg-brand-banner text-slate-900 font-display font-bold text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                >
                  Confirm Physical attendance
                  <Check className="w-3 h-3 text-slate-950" />
                </a>
                <button
                  onClick={() => setSelectedHub(null)}
                  className="text-slate-500 hover:text-slate-800 font-display text-[11px] px-3 py-1.5 border border-slate-300 bg-white rounded-lg transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Informative advice text below matching video content */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex gap-3 max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">
                Importance notice to physical kick off event attendees.
              </h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Attending a Physical Kick-off event ? Please ensure you register for the physical event (separately) in addition to registering for the Bincom Hackathon. Click the link to go to the kick-off event listing you are attending.
              </p>
            </div>
          </div>

          <a
            href={config.physicalNoticeUrl || "http://bincomdevcenter.com/communityevents"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            Register for Physical Kick-off
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
