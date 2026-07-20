import { useState } from "react";
import { FAQS } from "../data";
import { Search, ChevronDown, ChevronUp, HelpCircle, XCircle } from "lucide-react";

export default function FAQ({ config }: { config?: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default
  const [searchQuery, setSearchQuery] = useState("");

  const faqsList = config?.faqs && config.faqs.length > 0 ? config.faqs : FAQS;

  const filteredFaqs = faqsList.filter(
    (faq: any) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="max-w-4xl mx-auto px-4 py-12 scroll-mt-20">
      
      {/* Header Container with Search */}
      <div className="bg-brand-banner rounded-3xl p-8 sm:p-12 border border-lime-300 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-950 tracking-tight leading-none uppercase">
            Frequently Asked
          </h2>
          <p className="font-display text-lg font-bold text-slate-900">
            Questions (FAQs)
          </p>
        </div>

        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. fees, teams)..."
            className="w-full bg-white text-slate-950 text-xs px-10 py-3 rounded-2xl border border-lime-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400 font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? "bg-white border-slate-200 shadow-md"
                  : "bg-white/80 border-slate-100 hover:border-slate-200 hover:bg-white"
              }`}
            >
              {/* Question Clickable Trigger */}
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-display font-bold text-xs sm:text-sm text-slate-800 hover:text-slate-950 select-none cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? "text-brand-primary" : "text-slate-400"}`} />
                  {faq.question}
                </span>
                <span className={`w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0 transition-transform ${
                  isOpen ? "rotate-180 bg-brand-light border-brand-primary/20 text-brand-dark" : ""
                }`}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </button>

              {/* Answer Content Panel */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-50 animate-slide-down">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-xs font-mono">No matching questions found.</p>
          </div>
        )}
      </div>

    </section>
  );
}
