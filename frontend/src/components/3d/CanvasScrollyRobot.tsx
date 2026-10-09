"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Gauge, Laptop, Terminal, Wrench, ShieldCheck, 
  ArrowRight, Play, Pause, RotateCcw, Volume2, VolumeX,
  Layers, Film
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../../context/AppContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { autoTranslateIndonesianToEnglish } from "../../lib/i18n";

export interface ShowcaseProject {
  id: string;
  tag: string;
  tag_en?: string;
  title: string;
  title_en?: string;
  titleHighlight: string;
  titleHighlight_en?: string;
  subtitle: string;
  subtitle_en?: string;
  priceBadge: string;
  priceBadge_en?: string;
  price: string;
  price_en?: string;
  catalogUrl: string;
  ctaText: string;
  ctaText_en?: string;
  videoSrc: string;
  fallbackImage: string;
  maxDurationSeconds: number; // Maksimal durasi detik fleksibel
  leftCallout: {
    icon: typeof Cpu;
    category: string;
    category_en?: string;
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    accentColor: string;
  };
  rightCallout: {
    icon: typeof Gauge;
    category: string;
    category_en?: string;
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    accentColor: string;
  };
}

// 3 Proyek Unggulan Bawaan (Bisa diubah fleksibel oleh Admin di Dashboard)
export const DEFAULT_SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "robot-arvin",
    tag: "01 / 03 • PRODUK FISIK & IOT UNGGULAN",
    tag_en: "01 / 03 • FEATURED HARDWARE & IOT",
    title: "Robot Patroli",
    title_en: "Patrol Robot",
    titleHighlight: "Otonom Arvin v2",
    titleHighlight_en: "Autonomous Arvin v2",
    subtitle: "Karya Unggulan Sekolah Vokasi & Lab Embedded UNS",
    subtitle_en: "Flagship innovation from UNS Vocational School & Embedded Labs",
    priceBadge: "Siap Produksi DUDI",
    priceBadge_en: "Industry Production Ready",
    price: "Rp 45.000.000",
    price_en: "IDR 45,000,000",
    catalogUrl: "/katalog/robot-patroli-otonom-arvin-v2",
    ctaText: "Bedah Spesifikasi Robot",
    ctaText_en: "Explore Robot Specs",
    videoSrc: "",
    fallbackImage: "/images/sequence/robot-frame-01.jpg",
    maxDurationSeconds: 30,
    leftCallout: {
      icon: Cpu,
      category: "Otak Komputasi",
      category_en: "Compute Architecture",
      title: "NVIDIA Jetson Orin Nano",
      title_en: "NVIDIA Jetson Orin Nano",
      description: "Edge AI 40 TOPS untuk deteksi rintangan, pelacakan otonom, dan navigasi SLAM mandiri 1.5 cm tanpa GPS.",
      description_en: "40 TOPS Edge AI for obstacle detection, autonomous tracking, and 1.5 cm accurate SLAM navigation without GPS.",
      accentColor: "#C5A059",
    },
    rightCallout: {
      icon: Gauge,
      category: "Sensor & Navigasi",
      category_en: "Sensors & Navigation",
      title: "LiDAR 360° + Depth Camera",
      title_en: "LiDAR 360° + Depth Camera",
      description: "Pemetaan denah gedung otonom berakurasi tinggi, streaming video terenkripsi, dan baterai LiFePO4 tahan 8 jam.",
      description_en: "High-precision autonomous building mapping, encrypted video streaming, and 8-hour LiFePO4 battery.",
      accentColor: "#38BDF8",
    },
  },
  {
    id: "saas-rintisku",
    tag: "02 / 03 • TEKNOLOGI & SAAS TERPADU",
    tag_en: "02 / 03 • INTEGRATED TECHNOLOGY & SAAS",
    title: "SaaS Rintisku",
    title_en: "Rintisku SaaS",
    titleHighlight: "Inkubasi Bisnis",
    titleHighlight_en: "Business Incubation",
    subtitle: "Platform All-in-One Validasi Portofolio Startup Mahasiswa & Pitching DUDI",
    subtitle_en: "All-in-One platform for student startup portfolio validation & enterprise pitching",
    priceBadge: "Lisensi Tahunan Kampus",
    priceBadge_en: "Campus Annual License",
    price: "Rp 2.500.000 / Thn",
    price_en: "IDR 2,500,000 / Yr",
    catalogUrl: "/katalog/rintisku-saas-inkubasi-bisnis",
    ctaText: "Coba Live Demo SaaS",
    ctaText_en: "Try Live Demo SaaS",
    videoSrc: "",
    fallbackImage: "/images/catalog/rintisku-saas-showcase.jpg",
    maxDurationSeconds: 30,
    leftCallout: {
      icon: Laptop,
      category: "Arsitektur Sistem",
      category_en: "System Architecture",
      title: "Next.js 14 & Laravel 11 API",
      title_en: "Next.js 14 & Laravel 11 API",
      description: "Arsitektur headless decoupled dengan respons time < 100ms, otentikasi Sanctum, dan database MySQL terisolasi.",
      description_en: "Decoupled headless architecture with < 100ms response time, Sanctum authentication, and isolated MySQL database.",
      accentColor: "#38BDF8",
    },
    rightCallout: {
      icon: Terminal,
      category: "Fitur Interaktif",
      category_en: "Interactive Features",
      title: "Live Interactive Sandbox",
      title_en: "Live Interactive Sandbox",
      description: "Simulasi pengujian fitur langsung di browser tanpa instalasi, kurasi milestone otomatis, dan pelaporan evaluasi DUDI.",
      description_en: "Real-time in-browser feature testing with zero installation, automated milestone curation, and DUDI industry evaluation reports.",
      accentColor: "#C5A059",
    },
  },
  {
    id: "software-house",
    tag: "03 / 03 • JASA REKAYASA & KONSULTASI",
    tag_en: "03 / 03 • ENGINEERING SERVICES & CONSULTING",
    title: "Vokasi Software House",
    title_en: "Vocational Software House",
    titleHighlight: "Web & Mobile App",
    titleHighlight_en: "Web & Mobile App",
    subtitle: "Layanan Profesional Rancang Bangun Sistem Informasi, Custom ERP, dan IoT Terapan",
    subtitle_en: "Professional engineering services for custom information systems, enterprise ERP, and applied IoT",
    priceBadge: "Mulai dari",
    priceBadge_en: "Starting at",
    price: "Rp 15.000.000",
    price_en: "IDR 15,000,000",
    catalogUrl: "/katalog/vokasi-software-house-web-mobile",
    ctaText: "Konsultasi Kebutuhan Jasa",
    ctaText_en: "Consult Engineering Needs",
    videoSrc: "",
    fallbackImage: "/images/catalog/software-house-showcase.jpg",
    maxDurationSeconds: 30,
    leftCallout: {
      icon: Wrench,
      category: "Metodologi Kerja",
      category_en: "Engineering Methodology",
      title: "Agile Sprint 14 Hari",
      title_en: "14-Day Agile Sprints",
      description: "Pengerjaan bertahap terukur dengan deliverable PRD lengkap, prototipe Figma beresolusi tinggi, dan clean-code repo.",
      description_en: "Iterative milestones with comprehensive PRD deliverables, high-fidelity Figma prototypes, and clean-code repo.",
      accentColor: "#A855F7",
    },
    rightCallout: {
      icon: ShieldCheck,
      category: "Jaminan Mutu",
      category_en: "Quality Assurance",
      title: "Garansi 3 Bulan & Pentest",
      title_en: "3-Month Warranty & Pentest",
      description: "Didampingi dosen pakar rekayasa perangkat lunak, uji keamanan sistem terenkripsi, dan pemeliharaan bug-fixing gratis.",
      description_en: "Supervised by software engineering faculty experts, encrypted security testing, and complimentary bug-fixing.",
      accentColor: "#22C55E",
    },
  },
];

export const CanvasScrollyRobot: React.FC = () => {
  const { currentLang } = useApp();
  const { settings } = useSiteSettings();
  const [projects, setProjects] = useState<ShowcaseProject[]>(DEFAULT_SHOWCASE_PROJECTS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hydrate custom projects configured by Admin from Database & LocalStorage
  useEffect(() => {
    const iconMap: Record<string, any> = { Cpu, Gauge, Laptop, Terminal, Wrench, ShieldCheck };

    const hydrateList = (raw: any[]) => {
      if (!Array.isArray(raw) || raw.length === 0) return null;
      return raw.map((p: any, idx: number) => {
        const defaultProj = DEFAULT_SHOWCASE_PROJECTS[idx] || DEFAULT_SHOWCASE_PROJECTS[0];
        const leftIconName = p.leftCallout?.icon?.displayName || p.leftCallout?.iconName || p.leftCallout?.icon;
        const rightIconName = p.rightCallout?.icon?.displayName || p.rightCallout?.iconName || p.rightCallout?.icon;
        return {
          ...defaultProj,
          ...p,
          leftCallout: {
            ...defaultProj.leftCallout,
            ...(p.leftCallout || {}),
            icon: typeof leftIconName === "string" && iconMap[leftIconName] ? iconMap[leftIconName] : defaultProj.leftCallout.icon,
          },
          rightCallout: {
            ...defaultProj.rightCallout,
            ...(p.rightCallout || {}),
            icon: typeof rightIconName === "string" && iconMap[rightIconName] ? iconMap[rightIconName] : defaultProj.rightCallout.icon,
          },
        };
      });
    };

    // 1. Prioritize database settings from SiteSettingsContext
    if (settings?.showcase_projects && Array.isArray(settings.showcase_projects) && settings.showcase_projects.length > 0) {
      const hydrated = hydrateList(settings.showcase_projects);
      if (hydrated) {
        setProjects(hydrated);
        return;
      }
    }

    // 2. Fallback to localStorage cache
    try {
      const saved = localStorage.getItem("VOKASI_SHOWCASE_PROJECTS");
      if (saved) {
        const parsed = JSON.parse(saved);
        const hydrated = hydrateList(parsed);
        if (hydrated) setProjects(hydrated);
      }
    } catch (err) {
      console.error("Gagal memuat showcase kustom:", err);
    }
  }, [settings?.showcase_projects]);

  const currentProject = projects[activeIndex] || DEFAULT_SHOWCASE_PROJECTS[0];
  const maxDuration = currentProject.maxDurationSeconds || 30;

  const getL = (idStr: string, enStr?: string) => {
    if (currentLang === "en") {
      const translated = autoTranslateIndonesianToEnglish(idStr);
      if (translated && translated !== idStr) {
        return translated;
      }
      return enStr || idStr;
    }
    return idStr;
  };

  // Reset video playback saat berganti proyek
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      if (isPlaying) {
        video.play().catch(() => setVideoError(true));
      }
    }
  }, [activeIndex, isPlaying]);

  // Timer interval halus untuk auto-advance 30 detik maksimal per video
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100;
    const increment = (intervalMs / (maxDuration * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Beralih otomatis ke video berikutnya (loop 0 -> 1 -> 2 -> 0)
          setActiveIndex((curr) => (curr + 1) % projects.length);
          setVideoError(false);
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, maxDuration]);

  const currentSeconds = Math.min(
    maxDuration,
    Math.floor((progress / 100) * maxDuration)
  );

  return (
    <section className="relative min-h-screen bg-[#040812] text-white overflow-hidden py-24 sm:py-32 px-4 flex flex-col justify-between">
      {/* Background Seamless Ambient Glow */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
        style={{ backgroundImage: `url('/images/backgrounds/dark-web-background.jpg')` }}
      />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#0F4C81]/30 blur-[160px] pointer-events-none top-1/4 -left-48" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[#C5A059]/15 blur-[140px] pointer-events-none bottom-1/4 -right-32" />

      {/* 1. TOP HEADER: Synced Dynamic Project Title with Smooth Motion */}
      <div className="relative z-30 text-center max-w-3xl mx-auto shrink-0 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#C5A059]/40 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase text-[#C5A059]">
                {getL(currentProject.tag, currentProject.tag_en)}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              {getL(currentProject.title, currentProject.title_en)}{" "}
              <span className="text-[#C5A059]">{getL(currentProject.titleHighlight, currentProject.titleHighlight_en)}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
              {getL(currentProject.subtitle, currentProject.subtitle_en)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. CENTER STAGE: Transparent 3D Video & Fallback with Side Callouts */}
      <div className="relative z-20 flex-1 flex items-center justify-center w-full max-w-7xl mx-auto my-auto py-4">
        {/* Left Dynamic Callout Card */}
        <div className="hidden lg:block absolute left-4 xl:left-12 top-1/2 -translate-y-1/2 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${currentProject.id}`}
              initial={{ opacity: 0, x: -35, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="max-w-xs p-6 rounded-[32px] bg-[#07192C]/90 border border-slate-700/80 backdrop-blur-2xl shadow-2xl text-left hover:border-[#C5A059]/60 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div 
                  className="p-2.5 rounded-[18px]" 
                  style={{ backgroundColor: `${currentProject.leftCallout.accentColor}18`, color: currentProject.leftCallout.accentColor }}
                >
                  <currentProject.leftCallout.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {getL(currentProject.leftCallout.category, currentProject.leftCallout.category_en)}
                  </span>
                  <h4 className="font-bold text-sm text-white leading-tight">
                    {getL(currentProject.leftCallout.title, currentProject.leftCallout.title_en)}
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                {getL(currentProject.leftCallout.description, currentProject.leftCallout.description_en)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center Video Stage (Smooth 3D Video with Screen/Alpha Blend) */}
        <div className="relative w-full max-w-2xl h-[340px] sm:h-[420px] md:h-[480px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`media-${currentProject.id}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* HTML5 Video with Screen Transparency Blend Mode */}
              {Boolean(currentProject.videoSrc) && !videoError ? (
                <video
                  ref={videoRef}
                  src={currentProject.videoSrc}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_20px_70px_rgba(15,76,129,0.55)] cursor-pointer"
                  onClick={() => setIsPlaying(!isPlaying)}
                />
              ) : (
                /* Fallback Image Smooth Float when .mp4 video is not yet placed by user */
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative w-full h-full flex items-center justify-center p-4"
                >
                  <img
                    src={currentProject.fallbackImage}
                    alt={getL(currentProject.title, currentProject.title_en)}
                    className="max-w-full max-h-full object-contain rounded-[32px] drop-shadow-[0_25px_60px_rgba(15,76,129,0.6)]"
                  />
                  <div className="absolute bottom-6 px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-white/20 backdrop-blur-md text-[10px] text-slate-300 font-mono flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-[#C5A059]" />
                    <span>{currentLang === "en" ? "3D Showcase Animation • Active Loop" : "Mode Animasi Showcase 3D • Loop Aktif"}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quick Floating Play/Pause & Mute Overlay */}
          <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 shadow-lg"
              title={isPlaying ? (currentLang === "en" ? "Pause Video" : "Jeda Video") : (currentLang === "en" ? "Play Video" : "Putar Video")}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 shadow-lg"
              title={isMuted ? (currentLang === "en" ? "Unmute Audio" : "Aktifkan Audio") : (currentLang === "en" ? "Mute Audio" : "Bisukan Audio")}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Right Dynamic Callout Card */}
        <div className="hidden lg:block absolute right-4 xl:right-12 top-1/2 -translate-y-1/2 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`right-${currentProject.id}`}
              initial={{ opacity: 0, x: 35, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="max-w-xs p-6 rounded-[32px] bg-[#07192C]/90 border border-slate-700/80 backdrop-blur-2xl shadow-2xl text-left hover:border-[#38BDF8]/60 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div 
                  className="p-2.5 rounded-[18px]" 
                  style={{ backgroundColor: `${currentProject.rightCallout.accentColor}18`, color: currentProject.rightCallout.accentColor }}
                >
                  <currentProject.rightCallout.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {getL(currentProject.rightCallout.category, currentProject.rightCallout.category_en)}
                  </span>
                  <h4 className="font-bold text-sm text-white leading-tight">
                    {getL(currentProject.rightCallout.title, currentProject.rightCallout.title_en)}
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                {getL(currentProject.rightCallout.description, currentProject.rightCallout.description_en)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. BOTTOM CONTROLS & TIMELINE DOCK (Max 30s per Video + Synchronized Copywriting) */}
      <div className="relative z-30 w-full max-w-3xl mx-auto shrink-0 mt-6 space-y-4">
        {/* 3 Project Selection Pills (Apple Dynamic Island Segmented Style) */}
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-full bg-slate-950/70 border border-white/15 backdrop-blur-2xl max-w-xl mx-auto">
          {projects.map((project, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={project.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setProgress(0);
                }}
                className={`relative px-4 sm:px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "text-[#0A2540] shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeVideoPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C5A059] to-[#dfba6a]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">0{idx + 1}. {getL(project.title, project.title_en)}</span>
              </button>
            );
          })}
        </div>

        {/* Timeline Bar (Durasi Maksimal 30 Detik per Video) */}
        <div className="p-4 sm:p-5 rounded-[32px] bg-gradient-to-r from-[#07192C]/95 via-[#0A2540]/95 to-[#07192C]/95 border border-[#C5A059]/50 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                {getL(currentProject.priceBadge, currentProject.priceBadge_en)}
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                00:{currentSeconds.toString().padStart(2, "0")} / 00:{maxDuration}s
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <span className="text-base sm:text-lg font-black text-white">
                {getL(currentProject.title, currentProject.title_en)} {getL(currentProject.titleHighlight, currentProject.titleHighlight_en)}
              </span>
              <span className="text-base sm:text-lg font-black text-[#C5A059]">
                • {getL(currentProject.price, currentProject.price_en)}
              </span>
            </div>
          </div>

          <Link
            href={currentProject.catalogUrl}
            className="animate-shimmer-gold w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#d4af37] text-[#0A2540] font-black text-xs shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 shrink-0"
          >
            <span>{getL(currentProject.ctaText, currentProject.ctaText_en)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 30-Second Progress Line Indicator */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0F4C81] via-[#C5A059] to-[#38BDF8]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        <p className="text-[11px] text-slate-400 text-center font-medium">
          {currentLang === "en" 
            ? "Showcase video rotates every 30 seconds. Click numbered tabs above to switch projects directly."
            : "Animasi video berganti otomatis tiap 30 detik. Klik tab nomor di atas untuk langsung beralih proyek."}
        </p>
      </div>
    </section>
  );
};
