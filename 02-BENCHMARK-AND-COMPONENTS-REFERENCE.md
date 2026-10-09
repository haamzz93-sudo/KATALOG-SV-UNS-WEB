# 02. BENCHMARK & UI/UX COMPONENT SPECIFICATIONS

Dokumen ini membedah arsitektur antarmuka dari **7 situs web referensi global**, mengekstraksi pola kode (*code patterns*), dan menerjemahkannya ke dalam komponen **React / Next.js + Tailwind CSS** yang siap diimplementasikan untuk Katalog Vokasi UNS.

---

## 1. Peta Ekstraksi Komponen dari 7 Referensi

| No | Referensi | Komponen yang Diambil | Implementasi di Katalog Vokasi UNS |
| :---: | :--- | :--- | :--- |
| 1 | **[Framework](https://frame.work)** | **Modular Exploded Hardware & Configurator** | Tampilan komponen pembongkaran modul **Robot Arvin & IoT** (sensor, mikrokontroler, baterai). |
| 2 | **[Apple Vision Pro](https://apple.com/apple-vision-pro)** | **Sticky 3D Scrollytelling & Tech Specs Grid** | Hero section dengan objek 3D yang berputar dinamis mengikuti scroll + layout spesifikasi teknis 2 kolom. |
| 3 | **[Stripe](https://stripe.com)** | **Interactive Live Demo Sandbox & Gradient Badge** | Modal coba langsung software **SaaS Rintisku** di browser + palet warna Biru-Putih-Emas. |
| 4 | **[Unitree Robotics](https://www.unitree.com)** | **Robotics Spec Matrix & Video Action Reel** | Metrik khusus robot (DOF, motor torsi, baterai, payload) + tombol Request for Quote (RFQ). |
| 5 | **[Toptal](https://www.toptal.com)** | **Verified Laboratory & Talent Profile Cards** | Profil Tim Dosen & Mahasiswa pelaksana pada kategori **Jasa**. |
| 6 | **[Contra Projects](https://contra.com/?view=projects)** | **Service Deliverables Timeline & Scope Cards** | Rincian waktu pengerjaan (SLA) & paket jasa pembuatan aplikasi. |
| 7 | **[21st.dev Components](https://21st.dev/community/components)** | **Bento Grid, Shimmer Button, 3D Card Tilt** | Animasi modern micro-interaction, tab filter layanan, dan tombol aksi beraksen emas. |

---

## 2. Bedah Pola Komponen & Template Kode Siap Pakai

### A. Ekstraksi Stripe: Interactive Live Demo Sandbox (Untuk Kategori Teknologi)

Pola dari Stripe memungkinkan pengguna menguji aplikasi secara langsung atau melihat respons API tanpa harus meninggalkan halaman utama.

```tsx
// components/catalog/LiveDemoModal.tsx
"use client";

import React, { useState } from "react";
import { X, ExternalLink, Play, Laptop, Smartphone, RefreshCw } from "lucide-react";

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  demoUrl: string;
  techStack: string[];
}

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  isOpen,
  onClose,
  productName,
  demoUrl,
  techStack,
}) => {
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [isReloading, setIsReloading] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#0A2540] border border-[#C5A059]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Sandbox Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-[#07192C]">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-white font-semibold text-sm tracking-wide">
              Live Interactive Sandbox: <span className="text-[#C5A059]">{productName}</span>
            </h3>
            <div className="hidden md:flex gap-1.5 ml-4">
              {techStack.map((tech, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Controls: Responsive Viewport & Links */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setDeviceView("desktop")}
                className={`p-1.5 rounded transition ${deviceView === "desktop" ? "bg-[#0F4C81] text-white" : "text-slate-400 hover:text-white"}`}
                title="Desktop View"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView("mobile")}
                className={`p-1.5 rounded transition ${deviceView === "mobile" ? "bg-[#0F4C81] text-white" : "text-slate-400 hover:text-white"}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Reload Demo"
            >
              <RefreshCw className={`w-4 h-4 ${isReloading ? "animate-spin" : ""}`} />
            </button>

            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-[#C5A059] hover:text-[#f5e8c7] bg-[#C5A059]/10 px-3 py-1.5 rounded-lg border border-[#C5A059]/30 transition"
            >
              <span>Tab Baru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sandbox Content Screen */}
        <div className="flex-1 bg-slate-900 flex justify-center items-center overflow-hidden p-2">
          <div
            className={`h-full bg-white transition-all duration-300 rounded-lg shadow-inner overflow-hidden border border-slate-800 ${
              deviceView === "desktop" ? "w-full" : "w-[390px] h-[95%] rounded-3xl border-4 border-slate-700 shadow-2xl"
            }`}
          >
            {!isReloading && (
              <iframe
                src={demoUrl}
                title={`Live Demo ${productName}`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### B. Ekstraksi Apple Vision Pro & Unitree: 3D Scrollytelling Specs Grid (Untuk Robot/IoT)

Pola Apple menggunakan kanvas 3D yang terkunci (*sticky canvas*) dengan teks dan poin spesifikasi yang muncul bergantian saat halaman di-scroll:

```tsx
// components/catalog/RobotScrollySection.tsx
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu, ShieldCheck, Zap, Gauge } from "lucide-react";

export const RobotScrollySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transformasi rotasi dan opacity teks
  const opacityStep1 = useTransform(scrollYProgress, [0, 0.2, 0.35], [1, 1, 0]);
  const opacityStep2 = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0]);
  const opacityStep3 = useTransform(scrollYProgress, [0.65, 0.8, 1], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#0A2540] text-white">
      {/* Sticky 3D Background / Stage */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Spot Glow Biru & Emas */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#0F4C81]/30 blur-[140px] pointer-events-none" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[#C5A059]/15 blur-[120px] pointer-events-none" />

        {/* Tempat 3D Canvas / Spline Embed */}
        <div className="relative z-10 w-full max-w-4xl h-[500px] flex items-center justify-center">
          <div className="text-center p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">
              Inovasi Laboratorium Robotika Vokasi
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 tracking-tight">
              Robot Patroli Otonom "Arvin v2"
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mt-4 text-sm leading-relaxed">
              Scroll ke bawah untuk membedah arsitektur motor servo, sensor LiDAR 360°, dan komputasi edge AI.
            </p>
          </div>
        </div>

        {/* Narrative Callout 1: Otak AI */}
        <motion.div
          style={{ opacity: opacityStep1 }}
          className="absolute left-8 md:left-24 bottom-24 max-w-xs p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur shadow-2xl"
        >
          <Cpu className="w-8 h-8 text-[#C5A059] mb-2" />
          <h4 className="font-bold text-base text-white">Edge AI Processing</h4>
          <p className="text-xs text-slate-300 mt-1">
            Ditenagai NVIDIA Jetson Orin Nano untuk pengenalan objek manusia & rintangan secara real-time.
          </p>
        </motion.div>

        {/* Narrative Callout 2: Sensor & Navigasi */}
        <motion.div
          style={{ opacity: opacityStep2 }}
          className="absolute right-8 md:right-24 top-32 max-w-xs p-5 rounded-2xl bg-slate-900/90 border border-[#0F4C81] backdrop-blur shadow-2xl"
        >
          <Gauge className="w-8 h-8 text-sky-400 mb-2" />
          <h4 className="font-bold text-base text-white">LiDAR 360° Slam Navigasi</h4>
          <p className="text-xs text-slate-300 mt-1">
            Pemetaan denah gedung vokasi dengan akurasi 1.5 cm tanpa bergantung pada sinyal GPS eksternal.
          </p>
        </motion.div>

        {/* Narrative Callout 3: Spesifikasi & Harga */}
        <motion.div
          style={{ opacity: opacityStep3 }}
          className="absolute right-8 md:right-24 bottom-24 max-w-sm p-6 rounded-2xl bg-gradient-to-br from-[#07192C] to-[#0A2540] border border-[#C5A059] shadow-2xl"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
              Siap Komersialisasi
            </span>
            <span className="text-lg font-black text-white">Rp 45.000.000</span>
          </div>
          <h4 className="font-bold text-lg text-white mt-3">Produksi Lab Mekatronika</h4>
          <p className="text-xs text-slate-300 mt-1">
            Tersedia untuk pengamanan kampus, pabrik mitra DUDI, dan instansi rumah sakit.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
```

---

### C. Ekstraksi 21st.dev: Bento Grid & Shimmer Gold Card (Katalog 3 Layanan)

Komponen ini menjadi beranda utama untuk memilih dan memfilter ketiga lini layanan (Teknologi, Produk, Jasa) dengan aksen warna Biru-Putih-Emas:

```tsx
// components/catalog/ServiceBentoCard.tsx
"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  category: "teknologi" | "produk" | "jasa";
  title: string;
  badge: string;
  prodi: string;
  price: string;
  imageUrl: string;
  onExplore: () => void;
}

export const ServiceBentoCard: React.FC<ServiceCardProps> = ({
  category,
  title,
  badge,
  prodi,
  price,
  imageUrl,
  onExplore,
}) => {
  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-xl hover:border-[#0F4C81]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Subtle Gold Shimmer Border on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {/* Top Media & Tags */}
      <div>
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100 mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0A2540]/90 text-white backdrop-blur border border-white/20">
            {category}
          </span>
          <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#C5A059] text-white shadow-sm">
            {badge}
          </span>
        </div>

        <span className="text-xs font-medium text-[#0F4C81]">{prodi}</span>
        <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#0F4C81] transition-colors mt-1 line-clamp-1">
          {title}
        </h3>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block uppercase font-medium">Estimasi Investasi</span>
          <span className="text-base font-extrabold text-[#0A2540]">{price}</span>
        </div>

        <button
          onClick={onExplore}
          className="flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#0F4C81] text-white hover:bg-[#0A2540] transition shadow-md"
        >
          <span>Detail</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
```
