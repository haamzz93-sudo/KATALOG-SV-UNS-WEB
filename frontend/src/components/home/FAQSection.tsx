"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageSquareQuote } from "lucide-react";
import { FAQItem, DEFAULT_FAQS, getStoredFAQs } from "../../lib/faq";
import { useApp } from "../../context/AppContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { autoTranslateIndonesianToEnglish } from "../../lib/i18n";

export const FAQSection: React.FC = () => {
  const { currentLang } = useApp();
  const { settings } = useSiteSettings();
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [openId, setOpenId] = useState<string | number | null>(null);

  useEffect(() => {
    if (settings?.site_faqs && Array.isArray(settings.site_faqs) && settings.site_faqs.length > 0) {
      setFaqs(settings.site_faqs.filter((f) => f.isActive !== false));
    } else {
      const data = getStoredFAQs();
      setFaqs(data.filter((f) => f.isActive !== false));
    }
  }, [settings?.site_faqs]);

  const toggleAccordion = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (faqs.length === 0) return null;

  return (
    <section className="relative py-28 overflow-hidden bg-[#F8FAFC] dark:bg-[#07192C] dark-section-canvas transition-colors">
      {/* Subtle Sekolah Vokasi UNS Architectural Landscape Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] dark:opacity-[0.04] select-none overflow-hidden" aria-hidden="true">
        {settings?.bg_campus_landscape_url?.match(/\.(mp4|webm|ogg)$/i) ? (
          <video
            src={settings.bg_campus_landscape_url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <img
            src={settings?.bg_campus_landscape_url || "/images/backgrounds/uns-gedung-sv-panoramic.jpg"}
            alt="Sekolah Vokasi UNS Panorama"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-transparent to-[#F8FAFC] dark:from-[#07192C] dark:via-transparent dark:to-[#07192C] architectural-gradient-mask-v" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-0.5 w-6 bg-gradient-to-r from-transparent to-[#000080] dark:to-[#FFD800]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#000080] dark:text-[#FFD800]">
              {currentLang === "en" ? "Q&A & Partnership Inquiries" : "Tanya Jawab & Informasi Kemitraan"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
            <span className="h-0.5 w-6 bg-gradient-to-l from-transparent to-[#000080] dark:to-[#FFD800]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {currentLang === "en" ? "Frequently Asked Questions (FAQ)" : "Pertanyaan Umum (FAQ)"}
          </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
          {currentLang === "en" 
            ? "Transparent information regarding research commercialization, live product demos, software warranties, and enterprise collaboration." 
            : "Informasi transparan seputar komersialisasi riset, live demo inovasi, garansi software, dan kerja sama DUDI."}
        </p>
      </motion.div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openId === faq.id;
          const question = currentLang === "en" 
            ? (faq.question_en || autoTranslateIndonesianToEnglish(faq.question)) 
            : faq.question;
          const answer = currentLang === "en" 
            ? (faq.answer_en || autoTranslateIndonesianToEnglish(faq.answer)) 
            : faq.answer;
          const category = currentLang === "en" 
            ? (faq.category_en || (faq.category ? autoTranslateIndonesianToEnglish(faq.category) : undefined)) 
            : faq.category;

          return (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className={`rounded-[28px] border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-white dark:bg-[#07192C] border-[#C5A059]/60 dark:border-[#C5A059]/80 shadow-[0_12px_30px_rgba(197,160,89,0.15)] ring-1 ring-[#C5A059]/30"
                  : "bg-white/80 dark:bg-[#07192C]/80 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(faq.id)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors select-none"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                    isOpen 
                      ? "bg-[#0A2540] dark:bg-[#C5A059] text-white dark:text-[#0A2540] shadow-sm" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    {category && (
                      <span className="inline-block text-xs font-bold px-3 py-0.5 rounded-full bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 mb-1.5">
                        {category}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {question}
                    </h3>
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                  isOpen 
                    ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] rotate-180" 
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-400"
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-white/5 font-medium">
                      <div className="flex items-start gap-2.5 mt-2">
                        <MessageSquareQuote className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <p>{answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
};
