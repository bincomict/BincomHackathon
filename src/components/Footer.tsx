import React, { useState, useEffect } from "react";
import { Globe, Linkedin, Facebook, Instagram, ArrowUp } from "lucide-react";
import { HackathonConfig } from "../types";

// Standard brand SVG for X (formerly Twitter)
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface FooterProps {
  config: HackathonConfig;
  onUpdate?: (newConfig: HackathonConfig) => void;
}

export default function Footer({ config, onUpdate }: FooterProps) {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [config.logoUrl]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="app-footer" className="bg-slate-900 text-white mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Info and brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div 
                className="h-12 flex items-center justify-center font-display font-bold text-sm shrink-0"
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
                  <span className="text-[#90c649] text-2xl font-black tracking-tighter">B</span>
                )}
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Bincom Dev Center is a Multi-location based Talent and Development Center for Technology Resources and Technology Solutions.
            </p>
          </div>

          {/* Column 2: Sections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-300 font-mono font-bold">
              Sections
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a 
                  href="https://bincomdevcenter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-primary transition-colors"
                >
                  About Bincom Dev Center
                </a>
              </li>
              <li>
                <a 
                  href="https://bincomdevcenter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-primary transition-colors"
                >
                  Our Services
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Community */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-300 font-mono font-bold">
              Follow Us
            </h4>
            <div className="flex gap-2">
              <a
                href="https://www.linkedin.com/company/bincomdevcenter/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700/50 transition-all flex items-center justify-center text-[#90c649]"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1B4sYTx9hA/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700/50 transition-all flex items-center justify-center text-[#90c649]"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/BincomDevcenter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700/50 transition-all flex items-center justify-center text-[#90c649]"
                title="X"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/bincomdevcenter_?igsh=eTRhZ2Y3bXh4MW5m"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700/50 transition-all flex items-center justify-center text-[#90c649]"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed pt-1">
              join our official slack channel{" "}
              <a 
                href="https://bincom.net/bincomtechnetwork" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#90c649] hover:underline font-bold"
              >
                #hackathon
              </a>.
            </p>
          </div>

        </div>

        {/* Bottom Bar exactly matching the video footer string */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-medium text-slate-500">
            Copyrights @ {new Date().getFullYear()}, Bincom Dev Center
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-brand-primary transition-all font-mono"
            title="Scroll to Top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </footer>
  );
}
