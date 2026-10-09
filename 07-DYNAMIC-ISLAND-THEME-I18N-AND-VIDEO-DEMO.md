# 07. DYNAMIC ISLAND HEADER, THEME (LIGHT/DARK), I18N, & VIDEO DEMO SPECIFICATION

Dokumen ini memuat implementasi fitur-fitur baru sesuai arahan:
1. **Dynamic Island Header**: Navigasi mengambang (*floating pill*) dengan animasi dinamis ala Apple Dynamic Island.
2. **Mode Tema (Light Mode Default & Dark Mode)**: Latar putih bersih sebagai bawaan, dengan transisi halus ke mode gelap.
3. **Dukungan Dua Bahasa (Bilingual i18n)**: Bahasa Indonesia (Default) & English.
4. **Video Demo Modal Interaktif**: Pemutar video demo web/aplikasi dengan animasi pembuka yang mulus.
5. **Format Lengkap 5 Elemen Tiap Item** (Mockup, Live Demo/Video, Nama, Spesifikasi, Harga) untuk 3 produk Prodi TIF.

---

## 1. Komponen Dynamic Island Header (`DynamicIslandHeader.tsx`)

Header ini mengambang di bagian atas layar dan dapat membesar/mengecil secara dinamis menggunakan `framer-motion`:

```tsx
// src/components/navigation/DynamicIslandHeader.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Laptop, Cpu, Wrench, Sun, Moon, Globe, 
  User, Sparkles, ChevronDown, Play 
} from "lucide-react";

interface HeaderProps {
  currentLang: "id" | "en";
  onToggleLang: (lang: "id" | "en") => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const DynamicIslandHeader: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  isDarkMode,
  onToggleTheme,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const t = {
    id: {
      katalog: "Katalog",
      layanan: "3 Layanan",
      demo: "Live Demo",
      login: "Masuk",
      teknologi: "Teknologi (SaaS)",
      produk: "Produk (IoT/Robot)",
      jasa: "Jasa Software",
    },
    en: {
      katalog: "Catalog",
      layanan: "3 Services",
      demo: "Live Demo",
      login: "Sign In",
      teknologi: "Technology (SaaS)",
      produk: "Hardware (IoT/Robot)",
      jasa: "Engineering Services",
    },
  }[currentLang];

  return (
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        className={`pointer-events-auto flex flex-col items-center border shadow-2xl backdrop-blur-xl transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#07192C]/90 border-[#C5A059]/30 text-white shadow-black/50"
            : "bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/60"
        } ${isExpanded ? "rounded-3xl p-4 w-full max-w-2xl" : "rounded-full px-5 py-2.5 w-auto"}`}
      >
        {/* Compact Pill State */}
        <div className="flex items-center gap-4 sm:gap-6 w-full justify-between">
          {/* Logo Resmi Sekolah Vokasi UNS */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              {isDarkMode ? (
                <img
                  src="/images/brand/logo-sv-uns-official-white.png"
                  alt="Logo Resmi SV UNS"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              ) : (
                <img
                  src="/images/brand/logo-sv-uns-official-color.png"
                  alt="Logo Resmi SV UNS"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs tracking-tight text-[#0A2540] dark:text-white leading-tight">
                SEKOLAH VOKASI
              </span>
              <span className="text-[10px] font-bold text-[#C5A059] tracking-wider -mt-0.5">
                UNS MADIUN
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link 
              href="/katalog" 
              className="hover:text-[#0F4C81] dark:hover:text-[#C5A059] transition"
            >
              {t.katalog}
            </Link>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 hover:text-[#0F4C81] dark:hover:text-[#C5A059] transition"
            >
              <span>{t.layanan}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Right Action Icons: Language, Dark Mode, Auth */}
          <div className="flex items-center gap-2">
            {/* Language Switcher (ID / EN) */}
            <button
              onClick={() => onToggleLang(currentLang === "id" ? "en" : "id")}
              className="px-2 py-1 rounded-lg text-[11px] font-bold border border-slate-200 dark:border-slate-700 hover:border-[#C5A059] transition"
              title="Ganti Bahasa"
            >
              {currentLang.toUpperCase()}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:text-[#C5A059] transition"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-[#0F4C81] text-white hover:bg-[#0A2540] dark:bg-[#C5A059] dark:text-[#0A2540] transition shadow-sm ml-1"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.login}</span>
            </Link>
          </div>
        </div>

        {/* Expanded Dynamic Island Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full pt-4 mt-3 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-3 gap-2 overflow-hidden"
            >
              <Link
                href="/katalog?kategori=teknologi"
                className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center gap-3 group"
              >
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-400">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold group-hover:text-[#0F4C81] dark:group-hover:text-[#C5A059]">
                    {t.teknologi}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Live Demo Sandbox</p>
                </div>
              </Link>

              <Link
                href="/katalog?kategori=produk"
                className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center gap-3 group"
              >
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-[#C5A059]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold group-hover:text-[#C5A059]">
                    {t.produk}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">3D Frame Scroll</p>
                </div>
              </Link>

              <Link
                href="/katalog?kategori=jasa"
                className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center gap-3 group"
              >
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold group-hover:text-[#0F4C81] dark:group-hover:text-[#C5A059]">
                    {t.jasa}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Video Demo & SLA</p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};
```

---

## 2. Komponen Video Demo Modal Interaktif (`VideoDemoModal.tsx`)

Komponen ini digunakan untuk memutar video demo dari aplikasi web atau portofolio jasa dengan animasi halus dan latar belakang *backdrop blur*:

```tsx
// src/components/catalog/VideoDemoModal.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Clock, CheckCircle2, MessageSquare } from "lucide-react";

interface VideoDemoProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
  prodi: string;
  deliverables: string[];
  price: string;
  picContact: string;
}

export const VideoDemoModal: React.FC<VideoDemoProps> = ({
  isOpen,
  onClose,
  title,
  videoUrl,
  prodi,
  deliverables,
  price,
  picContact,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-[#0F4C81] dark:text-[#C5A059] uppercase">
                {prodi}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Video Demo: {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player Screen */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>

          {/* Footer Info & Order Action */}
          <div className="p-6 bg-slate-50 dark:bg-[#0A2540]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium">
                Deliverables & Garansi
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {deliverables.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Estimasi Biaya</span>
                <span className="text-lg font-black text-[#0A2540] dark:text-white">{price}</span>
              </div>

              <a
                href={`https://wa.me/${picContact}?text=Halo%20Admin%20${encodeURIComponent(prodi)},%20saya%20tertarik%20dengan%20${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#0A2540] dark:bg-[#C5A059] dark:hover:bg-[#d6af5d] text-white dark:text-[#0A2540] font-bold text-xs shadow-lg transition flex items-center gap-2"
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
```

---

## 3. Data Mockup 3 Item Prodi TIF (5 Elemen Wajib)

Sesuai arahan Pak Darmawan, setiap item memuat **5 Elemen Pokok**:

### Item 1: TEKNOLOGI (SaaS Rintisku)
1. **Foto Mockup:** `/images/catalog/rintisku-saas-showcase.jpg` (Mockup laptop kaca berlatar putih dengan tombol gold glow).
2. **Link Live Demo:** `https://rintisku-demo.vokasi.uns.ac.id` (Membuka Sandbox interaktif di peramban).
3. **Nama Produk:** **Rintisku - SaaS Inkubasi Bisnis Mahasiswa**
4. **Spesifikasi:**
   * Tech Stack: Next.js 14 App Router, Laravel 11 Sanctum REST API.
   * Modul: Lean Canvas Builder, Milestone Tracker, DUDI Pitching Scheduler.
   * Infrastruktur: Docker, MySQL 8, Redis Caching.
5. **Harga:** **Rp 2.500.000 / Tahun** (Lisensi Institusi Kampus).

---

### Item 2: PRODUK FISIK (Robot Arvin IoT)
1. **Foto Mockup & 3D Sequence:** `/images/sequence/robot-frame-01.jpg` s/d `robot-frame-03.jpg`.
2. **Link Demo / 3D Model:** Embed Spline 3D & Canvas Scroll Sequence 360°.
3. **Nama Produk:** **Robot Patroli Otonom "Arvin v2"**
4. **Spesifikasi:**
   * Prosesor: NVIDIA Jetson Orin Nano 8GB (Edge AI Vision).
   * Sensor: RPLiDAR A2M8 360° + Intel RealSense Depth Camera.
   * Daya & Mobilitas: Baterai LiFePO4 24V 20Ah (8 Jam Operasi Mandiri), Roda Mecanum Omni.
5. **Harga:** **Rp 45.000.000** (Unit Siap Operasi).

---

### Item 3: JASA (Vokasi Software House)
1. **Foto Mockup & Video Preview:** `/images/catalog/software-house-showcase.jpg` (Player video kaca dengan Play Button Emas).
2. **Link Video Demo:** `/videos/software-house-demo.mp4` (Diputar via `VideoDemoModal`).
3. **Nama Layanan:** **Vokasi Software House - Jasa Pengembangan Sistem Web & Mobile**
4. **Spesifikasi (Deliverables & SLA):**
   * Lingkup: Fullstack Web (Next.js/Laravel), Mobile App (Flutter), UI/UX Figma.
   * Sprint & SLA: 14 - 30 Hari Kerja per modul.
   * Garansi: Pemeliharaan bug-fixing gratis selama 3 bulan.
5. **Harga:** **Mulai Rp 15.000.000** (Berdasarkan cakupan PRD).
