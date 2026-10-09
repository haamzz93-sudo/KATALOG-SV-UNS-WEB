"use client";

import React, { useState } from "react";
import { 
  X, ExternalLink, Laptop, Smartphone, RefreshCw, 
  Lock, CheckCircle2, ShieldCheck, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  demoUrl: string;
  techStack?: string[];
}

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  isOpen,
  onClose,
  productName,
  demoUrl,
  techStack = [
    "Frontend: Next.js 14 App Router, Tailwind CSS",
    "Backend API: Laravel 11 RESTful API + Redis Caching",
    "Infrastruktur: Dockerized on Cloudflare & AWS RDS",
    "Modul: Lean Canvas, Milestone Tracker, DUDI Scheduler"
  ],
}) => {
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [isReloading, setIsReloading] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="relative w-full max-w-6xl h-[92vh] bg-[#07192C] border border-[#C5A059]/40 rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_40px_rgba(197,160,89,0.2)] flex flex-col overflow-hidden ring-1 ring-white/10"
        >
          {/* Top Sandbox Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-white/10 bg-[#0A2540] shrink-0">
            {/* Left: Live Pulse Dot & Full Product Title */}
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div className="text-left min-w-0">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059] block leading-none mb-1">
                  Interactive Sandbox Environment
                </span>
                <h3 className="text-white font-extrabold text-sm sm:text-base tracking-tight truncate m-0">
                  {productName}
                </h3>
              </div>
            </div>

            {/* Right: Controls (Device Viewport, Reload, Buka Tab, Close) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Responsive Device Viewport Switcher */}
              <div className="flex items-center p-1 rounded-full bg-white/10 border border-white/15 shadow-inner">
                <button
                  type="button"
                  onClick={() => setDeviceView("desktop")}
                  className={`p-1.5 rounded-full transition cursor-pointer border-0 ${
                    deviceView === "desktop" ? "bg-[#0F4C81] text-white shadow-sm" : "text-slate-400 hover:text-white bg-transparent"
                  }`}
                  title="Tampilan Desktop"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("mobile")}
                  className={`p-1.5 rounded-full transition cursor-pointer border-0 ${
                    deviceView === "mobile" ? "bg-[#0F4C81] text-white shadow-sm" : "text-slate-400 hover:text-white bg-transparent"
                  }`}
                  title="Tampilan Ponsel (Mobile)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={handleRefresh}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition cursor-pointer"
                title="Muat Ulang Demo Sandbox"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? "animate-spin" : ""}`} />
              </button>

              {/* Open in New Tab Button */}
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-black px-4 py-1.5 rounded-full bg-[#C5A059] hover:bg-[#d6af5d] text-[#07192C] shadow-[0_4px_15px_rgba(197,160,89,0.35)] transition cursor-pointer no-underline select-none"
                style={{ textDecoration: "none", color: "#07192C" }}
              >
                <span>Buka Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-rose-500/25 border border-white/15 text-slate-300 hover:text-rose-400 transition cursor-pointer ml-0.5"
                title="Tutup Sandbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Address Bar Mockup */}
          <div className="px-5 py-2 bg-[#07192C] border-b border-white/10 flex items-center justify-between gap-4 text-xs shrink-0">
            {/* macOS Window Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>

            {/* Address Pill */}
            <div className="flex-1 max-w-xl mx-auto flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-slate-900/90 border border-white/10 shadow-inner">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="font-mono text-[11px] text-slate-300 truncate">
                {demoUrl}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                SSL Verified
              </span>
            </div>

            <div className="w-10 shrink-0 hidden sm:block" />
          </div>

          {/* Sandbox Screen View (Clean Iframe Viewport) */}
          <div className="flex-1 bg-slate-950 flex justify-center items-center overflow-hidden p-2 sm:p-5 relative">
            <div
              className={`h-full bg-white transition-all duration-300 shadow-2xl overflow-hidden relative flex flex-col ${
                deviceView === "desktop"
                  ? "w-full rounded-[28px] border border-white/15"
                  : "w-[380px] max-h-[96%] rounded-[40px] border-[8px] border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.9)]"
              }`}
            >
              {!isReloading ? (
                <iframe
                  src={demoUrl}
                  title={`Live Demo ${productName}`}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                  <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                    Memuat ulang demo sandbox...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Specifications & Architecture Dock */}
          <div className="px-5 sm:px-7 py-3 bg-[#07192C] border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full scrollbar-none w-full md:w-auto">
              <span className="text-[10px] font-black uppercase text-[#C5A059] tracking-wider shrink-0 mr-1">
                Arsitektur:
              </span>
              <div className="flex items-center gap-2 flex-nowrap">
                {techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10.5px] px-3 py-1 rounded-full bg-white/[0.07] text-slate-200 border border-white/15 font-semibold shrink-0 shadow-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Standar Lisensi HAKI & Hilirisasi DUDI SV UNS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
