# 04. NEXT.JS 14+ FRONTEND ARCHITECTURE & 3D SCROLL INTEGRATION

Dokumen ini berisi arsitektur antarmuka klien menggunakan **Next.js 14+ (App Router)**, konfigurasi **Tailwind CSS** untuk tema Biru-Putih-Emas, serta implementasi teknis **3D Scrollytelling** menggunakan Spline dan React Three Fiber (R3F).

---

## 1. Struktur Direktori Proyek Next.js (`src/`)

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Autentikasi Super Admin, Pimpinan SV, & Prodi
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Role-based Sidebar & Header
│   │   ├── admin/                    # Kelola Akun & Moderasi (Super Admin)
│   │   │   └── users/page.tsx
│   │   ├── pimpinan/                 # Executive View-Only Analytics & Report Export
│   │   │   └── page.tsx
│   │   └── prodi/                    # Manajemen Katalog 3 Layanan (Prodi)
│   │       ├── items/
│   │       │   ├── page.tsx          # List Item Prodi
│   │       │   └── create/page.tsx   # Form Input Item (Poin 1 - 5)
│   │       └── page.tsx
│   ├── (public)/
│   │   ├── layout.tsx                # Public Navigation Bar & Vokasi Footer
│   │   ├── page.tsx                  # Beranda Utama (3D Hero + 3 Lini Layanan)
│   │   ├── katalog/
│   │   │   ├── page.tsx              # Katalog Marketplace + Multi-filter (Prodi & Layanan)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Detail Produk (3D Viewer / Demo / Specs Table / PIC)
│   │   └── tentang/
│   │       └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── 3d/
│   │   ├── SplineViewer.tsx          # Integrasi Spline 3D Embed
│   │   ├── RobotCanvas3D.tsx         # React Three Fiber Canvas untuk Robot Arvin
│   │   └── HardwareExplodedView.tsx  # Scroll-driven Model Disassembly
│   ├── catalog/
│   │   ├── FilterBar.tsx             # Filter Tab: Semua, Teknologi, Produk, Jasa
│   │   ├── ProductCard.tsx           # Bento Grid Card dengan Hover Emas
│   │   ├── LiveDemoModal.tsx         # Sandbox Simulator untuk SaaS
│   │   └── TechSpecsTable.tsx        # Tabel Spesifikasi Rapi ala Apple & Framework
│   ├── dashboard/
│   │   ├── MetricCard.tsx
│   │   └── AnalyticsChart.tsx
│   └── ui/
│       ├── Button.tsx                # Tombol Shimmer & Institusional
│       ├── Badge.tsx
│       └── Dialog.tsx
├── lib/
│   ├── api.ts                        # Axios/Fetch Client ke Laravel API
│   ├── auth.ts                       # Session & Token Handler
│   └── utils.ts
└── types/
    └── catalog.ts
```

---

## 2. Konfigurasi Tailwind CSS (Biru, Putih, Emas Institusional)

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vokasi: {
          // BIRU INSTITUSI
          navy: "#0A2540",       // Latar utama Hero & Footer
          deep: "#07192C",       // Latar paling gelap / header
          royal: "#0F4C81",      // Aksi utama, tombol, link
          sky: "#38BDF8",        // Aksen teknologi modern
          ice: "#EBF4FC",        // Latar belakang kartu lembut

          // EMAS PRESTASI
          gold: "#C5A059",       // Aksen emas resmi, badge, rating
          "gold-light": "#F5E8C7",// Background badge emas
          "gold-glow": "#D4AF37",// Efek shimmer / glowing card

          // PUTIH & KANVAS
          surface: "#F8FAFC",    // Latar umum aplikasi (Slate 50)
          border: "#E2E8F0",     // Border garis tipis
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-hover": "0 10px 30px -10px rgba(197, 160, 89, 0.25)",
        "blue-card": "0 10px 30px -10px rgba(15, 76, 129, 0.15)",
      },
      animation: {
        "shimmer-gold": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 3. Implementasi 3D Scrollytelling (Dua Pilihan Pendekatan)

### Pilihan 1: Menggunakan Spline 3D Embed (Paling Ringan & Cepat Dibuat)
Metode ini direkomendasikan jika tim ingin mendesain model robot/hardware di editor visual Spline lalu langsung di-embed ke web tanpa beban coding Three.js dari awal:

```tsx
// components/3d/SplineViewer.tsx
"use client";

import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

interface SplineViewerProps {
  sceneUrl: string;
}

export const SplineViewer: React.FC<SplineViewerProps> = ({ sceneUrl }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-[550px] flex items-center justify-center overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-vokasi-navy/50 backdrop-blur z-20">
          <div className="w-10 h-10 border-4 border-vokasi-gold border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs text-slate-300 font-medium tracking-wider uppercase">
            Memuat Model 3D Interaktif...
          </span>
        </div>
      )}

      <Spline
        scene={sceneUrl}
        onLoad={() => setIsLoading(false)}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
```

---

### Pilihan 2: React Three Fiber (R3F) untuk Animasi Pembongkaran Model (*Exploded View*)
Metode ala Framework Laptop di mana rotasi objek 3D terikat langsung dengan *scroll position* browser:

```tsx
// components/3d/RobotCanvas3D.tsx
"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  modelUrl: string;
}

function RobotModel({ modelUrl }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);

  // Animasi rotasi mengambang lembut (idle floating)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2 + 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    }
  });

  return <primitive ref={groupRef} object={scene} scale={1.8} position={[0, -0.8, 0]} />;
}

export const RobotCanvas3D: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-10, -5, -5]} intensity={0.8} color="#C5A059" />
        
        <React.Suspense fallback={null}>
          <RobotModel modelUrl={modelPath} />
          <Environment preset="city" />
        </React.Suspense>

        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};
```

---

## 4. Halaman Beranda Utama (`src/app/(public)/page.tsx`)

Halaman ini menggabungkan Hero Section 3D, selektor 3 lini layanan (Teknologi, Produk, Jasa), dan katalog produk unggulan:

```tsx
// src/app/(public)/page.tsx
import Link from "next/link";
import { ArrowRight, Laptop, Cpu, Wrench, ShieldCheck, Sparkles } from "lucide-react";
import { ServiceBentoCard } from "@/components/catalog/ServiceBentoCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-vokasi-surface">
      {/* 1. HERO SECTION WITH INSTITUTIONAL NAVY & GOLD */}
      <section className="relative overflow-hidden bg-vokasi-navy text-white pt-24 pb-20 px-6 lg:px-12 border-b border-vokasi-gold/30">
        {/* Ambient Gradient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-vokasi-royal/40 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-vokasi-gold/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-vokasi-gold/40 text-vokasi-gold text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ekosistem Bisnis & Hilirisasi Vokasi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Karya Riset Terapan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-vokasi-gold">
                Siap Mitra Industri.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Pusat etalase dan komersialisasi inovasi program studi Sekolah Vokasi. Jelajahi teknologi software dengan live demo, purwarupa robotika IoT, dan jasa rekayasa profesional.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/katalog"
                className="px-6 py-3.5 rounded-xl bg-vokasi-royal hover:bg-vokasi-royal/90 text-white font-bold text-sm shadow-lg shadow-vokasi-royal/30 transition flex items-center gap-2"
              >
                <span>Jelajahi Katalog Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#tiga-layanan"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 backdrop-blur transition"
              >
                Lihat 3 Lini Layanan
              </Link>
            </div>
          </div>

          {/* Hero 3D Card Preview */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-2xl relative">
              <span className="text-[11px] font-bold tracking-widest uppercase text-vokasi-gold">
                Sorotan Inovasi Pekan Ini
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">Robot Otonom Arvin v2</h3>
              <p className="text-xs text-slate-300 mt-1">Prodi D3 Teknik Informatika • Lab Robotika Cerdas</p>
              
              <div className="mt-4 h-52 bg-slate-900/60 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                <span className="text-xs text-slate-400 font-mono">[ 3D Interactive Canvas View ]</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Harga Purwarupa</span>
                  <span className="text-lg font-black text-white">Rp 45.000.000</span>
                </div>
                <Link
                  href="/katalog/robot-patroli-otonom-arvin-v2"
                  className="px-4 py-2 rounded-lg bg-vokasi-gold text-vokasi-navy font-bold text-xs hover:bg-[#e0b968] transition"
                >
                  Bedah Spesifikasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE SERVICE LINES ANCHOR (TEKNOLOGI, PRODUK, JASA) */}
      <section id="tiga-layanan" className="max-w-7xl mx-auto py-20 px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-vokasi-royal uppercase tracking-widest">
            Struktur Layanan Vokasi
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            Tiga Pilar Solusi untuk Kebutuhan Industri
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Dikelola langsung oleh program studi dengan verifikasi mutu akademik dan kesiapan terapan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Layanan 1: Teknologi */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-vokasi-royal transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-vokasi-ice flex items-center justify-center text-vokasi-royal mb-6">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">1. Teknologi & SaaS</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Perangkat lunak, portal manajemen, dan AI tools karya mahasiswa & dosen dengan tombol <strong>Live Demo Interaktif</strong> langsung di peramban.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-vokasi-royal">
              <span>Contoh: Rintisku SaaS</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Layanan 2: Produk Fisik */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-vokasi-gold transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FDF8EE] flex items-center justify-center text-vokasi-gold mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">2. Produk Fisik & IoT</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Hardware otomasi, robotika pengawas, dan kit telemetri terapan dengan spesifikasi teknis komponen lengkap serta model visual 3D.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-vokasi-gold">
              <span>Contoh: Robot Arvin IoT</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Layanan 3: Jasa */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-vokasi-royal transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-6">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">3. Jasa & Rekayasa</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Software house, studio desain industri, dan laboratorium pengujian terakreditasi untuk menyelesaikan persoalan teknis mitra DUDI.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Contoh: Jasa Dev Software</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```
