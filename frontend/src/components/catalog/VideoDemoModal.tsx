"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";

interface VideoDemoProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
  posterUrl?: string;
  prodi: string;
  deliverables?: string[];
  price: string;
  picContact: string;
}

export const VideoDemoModal: React.FC<VideoDemoProps> = ({
  isOpen,
  onClose,
  title,
  videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  posterUrl = "/images/catalog/software-house-showcase.jpg",
  prodi,
  deliverables = ["Source Code Git & Lisensi", "Sprint PRD 30-60 Hari", "Free Bug Fixing 3 Bulan"],
  price,
  picContact,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-[#C5A059]/40 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A2540]/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#0F4C81] dark:text-[#C5A059] uppercase tracking-wider">
                  {prodi}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Verified Lab SV
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Video Walkthrough: {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player Screen */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
            <video
              src={videoUrl}
              poster={posterUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>

          {/* Footer Info & WhatsApp Order Action */}
          <div className="p-6 bg-slate-50 dark:bg-[#0A2540]/80 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-bold tracking-wider block">
                Deliverables & Jaminan Kualitas
              </span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {deliverables.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimasi Biaya</span>
                <span className="text-lg font-black text-[#0A2540] dark:text-[#C5A059]">{price}</span>
              </div>

              <a
                href={`https://wa.me/${picContact}?text=Halo%20Admin%20${encodeURIComponent(prodi)},%20saya%20tertarik%20dengan%20${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#0F4C81] hover:bg-[#0A2540] dark:bg-[#C5A059] dark:hover:bg-[#d6af5d] text-white dark:text-[#0A2540] font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Konsultasi Jasa</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
