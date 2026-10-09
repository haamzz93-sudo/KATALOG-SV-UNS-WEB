"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { 
  Laptop, Cpu, Wrench, ArrowRight, Play, Eye, 
  ShieldCheck, CheckCircle2, ChevronRight, ChevronDown,
  TrendingUp, Users, Award, ExternalLink,
  Search, Star, Building2, Check,
  Layers, SlidersHorizontal, Quote, HelpCircle,
  Camera, Image as ImageIcon
} from "lucide-react";
import { DynamicIslandHeader } from "../components/navigation/DynamicIslandHeader";
import { ProductCard } from "../components/catalog/ProductCard";
import { LiveDemoModal } from "../components/catalog/LiveDemoModal";
import { VideoDemoModal } from "../components/catalog/VideoDemoModal";
import { FAQSection } from "../components/home/FAQSection";
import { CampusArchitecturalBackground } from "../components/home/CampusArchitecturalBackground";
import { Footer } from "../components/layout/Footer";
import { DotPattern } from "../components/ui/dot-pattern";
import { GlowCard } from "../components/ui/spotlight-card";
import { InfiniteSlider } from "../components/ui/infinite-slider";
import { ProgressiveBlur } from "../components/ui/progressive-blur";
import ScrollReveal from "../components/ui/ScrollReveal";
import { SearchableProdiDropdown, CustomSortDropdown } from "../components/ui/CustomCatalogSelect";
import { api } from "../lib/api";
import { CatalogItem, Category, Prodi } from "../types/catalog";
import { useApp } from "../context/AppContext";
import { useSiteSettings, DEFAULT_PORTFOLIO_CASES, DEFAULT_INDUSTRY_TESTIMONIALS, PortfolioCaseItem, IndustryTestimonialItem } from "../context/SiteSettingsContext";
import { getLocalizedSetting } from "../lib/i18n";

const DEFAULT_PARTNERS = [
  { name: "Slot 1: PT Petrokimia Gresik", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Petrokimia" },
  { name: "Slot 2: PT INKA (Persero)", src: "/images/brand/logo-sv-uns-official-new.png", alt: "INKA" },
  { name: "Slot 3: Pemerintah Kota Surakarta", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Pemkot Solo" },
  { name: "Slot 4: Rumah BUMN Surakarta", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Rumah BUMN" },
  { name: "Slot 5: PT Astra Component", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Astra" },
  { name: "Slot 6: Rumah Sakit UNS", src: "/images/brand/logo-sv-uns-official-new.png", alt: "RS UNS" },
];

export default function HomePage() {
  const { currentLang } = useApp();
  const { settings } = useSiteSettings();

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Interactive Catalog Filter State on Landing Page
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProdi, setSelectedProdi] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("latest");

  // Modals state
  const [selectedDemoItem, setSelectedDemoItem] = useState<CatalogItem | null>(null);
  const [selectedVideoItem, setSelectedVideoItem] = useState<CatalogItem | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [cats, prds, catalog] = await Promise.all([
          api.getCategories(),
          api.getProdis(),
          api.getCatalog(),
        ]);
        setCategories(cats);
        setProdis(prds);
        setItems(catalog);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered Items on Landing Page
  const filteredItems = useMemo(() => {
    let list = [...items];

    if (selectedCategory) {
      list = list.filter((i) => i.category?.slug === selectedCategory);
    }

    if (selectedProdi) {
      list = list.filter((i) => i.prodi?.kode_prodi === selectedProdi);
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      list = list.filter(
        (i) =>
          i.nama_item.toLowerCase().includes(q) ||
          (i.tagline && i.tagline.toLowerCase().includes(q)) ||
          (i.deskripsi_singkat && i.deskripsi_singkat.toLowerCase().includes(q))
      );
    }

    if (selectedSort === "popular") {
      list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else if (selectedSort === "demo") {
      list.sort((a, b) => (b.demo_click_count || 0) - (a.demo_click_count || 0));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [items, selectedCategory, selectedProdi, searchKeyword, selectedSort]);

  const handleOpenLiveDemo = (item: CatalogItem) => {
    api.logDemoClick(item.id);
    setSelectedDemoItem(item);
  };

  const handleOpenVideoDemo = (item: CatalogItem) => {
    setSelectedVideoItem(item);
  };

  const isEn = currentLang === "en";

  const t = {
    badge: getLocalizedSetting(
      "hero_badge",
      settings,
      currentLang,
      "Katalog Resmi Inovasi Terapan 2026",
      "Official Applied Innovations Catalog 2026"
    ),
    heroTitle1: getLocalizedSetting(
      "hero_title_p1",
      settings,
      currentLang,
      "Bisnis & Inovasi Terapan",
      "Applied Business & Innovation"
    ),
    heroTitle2: getLocalizedSetting(
      "hero_title_p2",
      settings,
      currentLang,
      "Sekolah Vokasi Universitas Sebelas Maret",
      "Vocational School Universitas Sebelas Maret"
    ),
    heroSubtitle: getLocalizedSetting(
      "hero_subtitle",
      settings,
      currentLang,
      "Hilirisasi riset terapan dan inovasi unggulan Sekolah Vokasi UNS siap kemitraan Dunia Usaha & Dunia Industri (DUDI).",
      "Applied research commercialization and flagship innovations from UNS Vocational School ready for enterprise partnerships."
    ),
    ctaCatalog: getLocalizedSetting("hero_cta_catalog_text", settings, currentLang, "Jelajahi Katalog", "Explore Catalog"),
    ctaDemo: getLocalizedSetting("hero_cta_demo_text", settings, currentLang, "Coba Live Demo", "Try Live Demo"),
    servicesTagline: getLocalizedSetting("services_tagline", settings, currentLang, "Taksonomi Layanan Vokasi", "Vocational Service Taxonomy"),
    servicesTitle: getLocalizedSetting("services_title", settings, currentLang, "Taksonomi 3 Lini Layanan.", "3 Core Service Lines."),
    servicesSubtitle: getLocalizedSetting(
      "services_subtitle",
      settings,
      currentLang,
      "Dirancang oleh dosen pakar dan talenta mahasiswa vokasi berbasis standar industri",
      "Engineered by expert faculty and talented vocational students to meet industry standards"
    ),
    service1Badge: getLocalizedSetting("service_1_badge", settings, currentLang, "Layanan 1", "Service 1"),
    service1Title: getLocalizedSetting("service_1_title", settings, currentLang, "1. Teknologi & SaaS", "1. Technology & SaaS"),
    service1Desc: getLocalizedSetting(
      "service_1_desc",
      settings,
      currentLang,
      "Platform web, modul AI, dan perangkat lunak siap terap hasil riset dan project based learning yang sudah melewati pengujian.",
      "Web platforms, AI models, and turnkey software verified through applied project-based learning."
    ),
    service1Btn: getLocalizedSetting("service_1_btn", settings, currentLang, "Buka Demo Sandbox", "Open Sandbox Demo"),

    service2Badge: getLocalizedSetting("service_2_badge", settings, currentLang, "Layanan 2 (Unggulan)", "Service 2 (Featured)"),
    service2Title: getLocalizedSetting("service_2_title", settings, currentLang, "2. Produk Fisik & IoT", "2. Hardware & IoT"),
    service2Desc: getLocalizedSetting(
      "service_2_desc",
      settings,
      currentLang,
      "Produk unggulan siap edar, alat mekatronika presisi, robot patroli otonom, dan perangkat embedded cerdas berstandar manufaktur.",
      "Production-ready physical products, precision mechatronics, autonomous robots, and intelligent embedded hardware."
    ),
    service2Btn: getLocalizedSetting("service_2_btn", settings, currentLang, "Putar Objek 3D", "Rotate 3D Model"),

    service3Badge: getLocalizedSetting("service_3_badge", settings, currentLang, "Layanan 3", "Service 3"),
    service3Title: getLocalizedSetting("service_3_title", settings, currentLang, "3. Jasa Software House", "3. Software House Services"),
    service3Desc: getLocalizedSetting(
      "service_3_desc",
      settings,
      currentLang,
      "Jasa layanan rancang bangun sistem kustom, konsultasi tenaga ahli, sprint agile, dan garansi pemeliharaan sistem teruji.",
      "Custom software engineering, faculty expert consulting, agile sprint delivery, and proven system warranty."
    ),
    service3Btn: getLocalizedSetting("service_3_btn", settings, currentLang, "Konsultasi Proyek", "Consult Project"),

    catalogBadge: isEn ? "Applied Research & Engineering Marketplace" : "Marketplace Riset & Rekayasa Terapan",
    catalogTitle: isEn ? "Vocational Products & Innovations Catalog" : "Katalog Produk & Inovasi Vokasi",
    catalogSubtitle: isEn
      ? "Explore the official portfolio of SaaS applications, IoT robotics mechatronics, and custom software engineering from Universitas Sebelas Maret Vocational School."
      : "Jelajahi portofolio resmi aplikasi SaaS, instrumen mekatronika robotika IoT, dan jasa software house Sekolah Vokasi Universitas Sebelas Maret.",

    portfolioTagline: getLocalizedSetting(
      "portfolio_section_tagline",
      settings,
      currentLang,
      "Hilirisasi & Implementasi Nyata",
      "Impactful Applied Implementations"
    ),
    portfolioTitle: getLocalizedSetting(
      "portfolio_section_title",
      settings,
      currentLang,
      "Portofolio Inovasi yang Telah Digunakan Mitra",
      "Applied Innovations Used by Industry Partners"
    ),
    portfolioDesc: getLocalizedSetting(
      "portfolio_section_desc",
      settings,
      currentLang,
      "Bukti nyata karya riset terapan dan produk teknologi Sekolah Vokasi UNS yang telah resmi diadopsi, diintegrasikan, dan beroperasi di BUMN, korporasi swasta, dan instansi pemerintah.",
      "Concrete evidence of applied research and technological products from UNS Vocational School officially adopted and deployed across SOEs, enterprises, and government agencies."
    ),

    testimonialsTagline: getLocalizedSetting(
      "testimonials_section_tagline",
      settings,
      currentLang,
      "Kepercayaan Industri & Mitra DUDI",
      "Industry Trust & DUDI Synergy"
    ),
    testimonialsTitle: getLocalizedSetting(
      "testimonials_section_title",
      settings,
      currentLang,
      "Testimoni Kolaborasi & Sinergi",
      "Collaboration & Synergy Testimonials"
    ),
    testimonialsDesc: getLocalizedSetting(
      "testimonials_section_desc",
      settings,
      currentLang,
      "Pengalaman nyata mitra industri bekerja sama dengan Sekolah Vokasi UNS dalam hilirisasi teknologi.",
      "Real-world experiences of industry partners collaborating with UNS Vocational School in technology commercialization."
    ),
  };

  // Portfolio cases from database settings or default
  const portfolioCases = (settings.portfolio_cases && Array.isArray(settings.portfolio_cases) && settings.portfolio_cases.length > 0
    ? settings.portfolio_cases
    : DEFAULT_PORTFOLIO_CASES).filter(c => c.isActive !== false);

  // Testimonials from database settings or default
  const testimonialItems = (settings.industry_testimonials && Array.isArray(settings.industry_testimonials) && settings.industry_testimonials.length > 0
    ? settings.industry_testimonials
    : DEFAULT_INDUSTRY_TESTIMONIALS).filter(t => t.isActive !== false);

  // Partners list from MySQL database settings
  const rawPartners = (settings.industry_partners && Array.isArray(settings.industry_partners) && settings.industry_partners.length > 0)
    ? settings.industry_partners
    : DEFAULT_PARTNERS;

  // Split into 2 rows for 2-way marquee
  const half = Math.ceil(rawPartners.length / 2);
  const row1Partners = rawPartners.slice(0, half).concat(rawPartners.slice(0, half));
  const row2Partners = rawPartners.slice(half).concat(rawPartners.slice(half));


  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#07192C] text-slate-900 dark:text-white transition-colors">
      {/* 1. Dynamic Island Header Floating with Kementan-style Scroll Spy & Sliding Pill */}
      <DynamicIslandHeader />

      {/* 2. SECTION 1: BERANDA (HERO SECTION) */}
      <section id="beranda" className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-gradient-to-b from-[#07192C] via-[#0A2540] to-[#07192C] text-white">
        {/* Video / Aerial Background */}
        {(() => {
          const heroSrc = settings?.bg_hero_url || "/videos/WEB-RONAL.mp4";
          const isVideo = heroSrc.match(/\.(mp4|webm|ogg)$/i) || heroSrc.includes("WEB-RONAL") || heroSrc.includes("/uploads/vid_");
          const rawNum = Number(settings?.hero_bg_opacity);
          const opacityVal = !isNaN(rawNum) && rawNum >= 10 && rawNum <= 100 ? rawNum / 100 : 0.75;

          return (
            <div 
              className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700"
              style={{ opacity: opacityVal }}
            >
              {isVideo ? (
                <video
                  src={heroSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp"
                  className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-105 scale-105"
                />
              ) : (
                <div
                  className="w-full h-full bg-cover bg-center scale-105"
                  style={{ backgroundImage: `url('${heroSrc}')` }}
                />
              )}
            </div>
          );
        })()}

        {/* Digital Matrix Grid & Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />
        <DotPattern className="[mask-image:radial-gradient(550px_circle_at_center,white,transparent)] opacity-20 pointer-events-none z-0 fill-white" />

        {/* Soft Vignette Mask */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(7,25,44,0.65) 0%, rgba(7,25,44,0.25) 45%, rgba(7,25,44,0.95) 100%)"
          }}
        />

        {/* Ambient Glow Orbs (UNS Blue & UNS Gold) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-[#0F4C81]/40 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#C5A059]/20 blur-[130px] rounded-full pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal direction="up" delay={100}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-0.5 w-6 bg-gradient-to-r from-transparent to-[#FFD800]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD800] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#FFD800] drop-shadow">
                {t.badge}
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm font-medium text-slate-200 hidden sm:inline">
                {isEn ? "Flagship Works & Applied Industry Solutions" : "Pusat Hilirisasi Riset • Karya Unggulan & Solusi Terapan DUDI"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD800] animate-pulse" />
              <span className="h-0.5 w-6 bg-gradient-to-l from-transparent to-[#FFD800]" />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.08] max-w-4xl mx-auto">
              <span className="inline-block drop-shadow-md text-white">
                {t.heroTitle1}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-[#FFD800] mt-2 drop-shadow-md">
                {t.heroTitle2}
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow">
              {t.heroSubtitle}
            </p>
          </ScrollReveal>

          {/* Hero CTAs */}
          <ScrollReveal direction="up" delay={350}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {/* Primary: Scroll to Katalog */}
              <a
                href="#katalog"
                className="luxury-pill-gold group relative inline-flex items-center gap-3 px-8 py-3.5 sm:py-4 font-black text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer overflow-hidden rounded-full no-underline shadow-lg hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                <span className="relative z-10 text-[#07192C] font-black">{t.ctaCatalog}</span>
                <span className="relative z-10 w-7 h-7 rounded-full bg-[#07192C]/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-[#07192C]" />
                </span>
              </a>

              {/* Secondary: Coba Live Demo */}
              <button
                type="button"
                onClick={() => {
                  const saas = items.find((i) => i.category?.slug === "teknologi") || items[0];
                  if (saas) handleOpenLiveDemo(saas);
                }}
                className="luxury-pill-primary group relative inline-flex items-center gap-3 px-8 py-3.5 sm:py-4 font-black text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer overflow-hidden rounded-full border border-white/20 hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                <span className="relative z-10 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                </span>
                <span className="relative z-10 text-white font-extrabold">{t.ctaDemo}</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Stats Capsule */}
          <ScrollReveal direction="up" delay={450}>
            <div className="mt-12 inline-flex items-center justify-center max-w-full">
              <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-10 px-6 sm:px-12 py-3 sm:py-4 rounded-full bg-slate-950/60 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {settings?.hero_stat_1_val || "3 Lini"}
                  </span>
                  <span className="text-xs text-white/90 font-bold uppercase tracking-wider text-left">
                    {settings?.hero_stat_1_lbl || (isEn ? "Integrated Lines" : "Layanan Terpadu")}
                  </span>
                </div>

                <div className="h-7 w-px bg-white/30 hidden sm:block" />

                <div className="flex items-center gap-3.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#FFD800] tracking-tight drop-shadow-[0_0_15px_rgba(255,216,0,0.4)]">
                    {settings?.hero_stat_2_val || "100%"}
                  </span>
                  <span className="text-xs text-white/90 font-bold uppercase tracking-wider text-left">
                    {settings?.hero_stat_2_lbl || (isEn ? "Original Lab Works" : "Karya Orisinil Laboratorium SV")}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. SECTION 2: 3 LINI LAYANAN */}
      <section id="layanan" className="relative py-20 sm:py-28 overflow-hidden bg-white dark:bg-[#07192C] transition-colors">
        <CampusArchitecturalBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-gradient-to-r from-transparent to-[#000080] dark:to-[#FFD800]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#000080] dark:text-[#FFD800]">
                {t.servicesTagline}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
              <span className="h-0.5 w-6 bg-gradient-to-l from-transparent to-[#000080] dark:to-[#FFD800]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.servicesTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
              {t.servicesSubtitle}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service 1: Teknologi & SaaS */}
            <ScrollReveal direction="up" delay={100} className="h-full">
              <GlowCard glowColor="blue" className="h-full">
                <a
                  href="#katalog"
                  onClick={() => setSelectedCategory("teknologi")}
                  className="tactile-glass-card relative h-full p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 hover:border-[#000080] dark:hover:border-sky-400 hover:shadow-[0_25px_60px_-15px_rgba(0,0,128,0.25)] transition-all duration-300 flex flex-col justify-between text-left no-underline group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#000080]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-[#000080] dark:text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform duration-300 shadow-inner">
                      <Laptop className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#000080] dark:text-sky-400 block mb-1">
                      {t.service1Badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white group-hover:text-[#000080] dark:group-hover:text-sky-400 transition-colors">
                      {t.service1Title}
                    </h3>
                    <p className="text-sm mt-3 leading-relaxed font-medium text-slate-600 dark:text-slate-300">
                      {t.service1Desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold text-[#000080] dark:text-sky-400">
                    <span>{t.service1Btn}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </a>
              </GlowCard>
            </ScrollReveal>

            {/* Service 2: Produk Fisik & IoT */}
            <ScrollReveal direction="up" delay={200} className="h-full">
              <GlowCard glowColor="gold" className="h-full">
                <a
                  href="#katalog"
                  onClick={() => setSelectedCategory("produk")}
                  className="tactile-glass-card relative h-full p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-white/5 border border-amber-300/60 hover:border-amber-400 hover:shadow-[0_25px_60px_-15px_rgba(255,216,0,0.25)] transition-all duration-300 flex flex-col justify-between text-left no-underline group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-[#FFD800] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[6deg] transition-transform duration-300 shadow-inner">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-[#FFD800] block mb-1">
                      {t.service2Badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#FFD800] transition-colors">
                      {t.service2Title}
                    </h3>
                    <p className="text-sm mt-3 leading-relaxed font-medium text-slate-600 dark:text-slate-300">
                      {t.service2Desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold text-amber-600 dark:text-[#FFD800]">
                    <span>{t.service2Btn}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </a>
              </GlowCard>
            </ScrollReveal>

            {/* Service 3: Jasa Software House */}
            <ScrollReveal direction="up" delay={300} className="h-full">
              <GlowCard glowColor="blue" className="h-full">
                <a
                  href="#katalog"
                  onClick={() => setSelectedCategory("jasa")}
                  className="tactile-glass-card relative h-full p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 flex flex-col justify-between text-left no-underline group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform duration-300 shadow-inner">
                      <Wrench className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      {t.service3Badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white group-hover:text-[#000080] transition-colors">
                      {t.service3Title}
                    </h3>
                    <p className="text-sm mt-3 leading-relaxed font-medium text-slate-600 dark:text-slate-300">
                      {t.service3Desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                    <span>{t.service3Btn}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </a>
              </GlowCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: KATALOG PRODUK & INOVASI */}
      <section id="katalog" className="relative py-20 sm:py-28 overflow-hidden w-full transition-colors bg-gradient-to-b from-[#F8FAFC] via-blue-50/30 to-[#F8FAFC] dark:from-[#07192C] dark:via-[#09223a] dark:to-[#07192C]">
        {/* Architectural 3D Campus Building & High-Tech Blueprint Grid (Kotak-Kotak) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          {/* 1. Technical Digital Grid Lines (Kotak-Kotak Cetak Biru) */}
          <div 
            className="absolute inset-0 opacity-[0.07] dark:opacity-[0.09] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 128, 0.45) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 128, 0.45) 1px, transparent 1px)
              `,
              backgroundSize: "36px 36px"
            }}
          />
          {/* Major Grid Boxes (Kotak-Kotak Besar Bergaris Tegas) */}
          <div 
            className="absolute inset-0 opacity-[0.09] dark:opacity-[0.11] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(15, 76, 129, 0.6) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(15, 76, 129, 0.6) 1.5px, transparent 1.5px)
              `,
              backgroundSize: "180px 180px"
            }}
          />

          {/* 2. AI Generated Technical Blueprint Grid Watermark (Tengah) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.09] dark:opacity-[0.06] pointer-events-none select-none">
            <img
              src="/images/backgrounds/sv-blueprint-grid-generated.jpg"
              alt="AI Blueprint Kotak-Kotak Gedung SV UNS"
              className="w-full h-full object-cover object-center filter contrast-110"
            />
          </div>

          {/* 3. Official 3D Isometric SV Building (Kiri - Gambar Asli yang Diunggah Pengguna) */}
          <div className="absolute -left-10 lg:left-6 top-1/4 w-[380px] sm:w-[500px] lg:w-[620px] h-auto opacity-[0.18] dark:opacity-[0.12] pointer-events-none select-none">
            <img
              src="/images/backgrounds/gedung-sv-3d-iso-2.png"
              alt="Gedung Sekolah Vokasi UNS 3D Isometric Resmi"
              className="w-full h-auto object-contain filter contrast-110 saturate-125"
            />
          </div>

          {/* 4. Official 3D Isometric SV Building (Kanan - Sudut Alternatif) */}
          <div className="absolute -right-12 lg:right-6 bottom-10 w-[360px] sm:w-[480px] lg:w-[580px] h-auto opacity-[0.16] dark:opacity-[0.11] pointer-events-none select-none">
            <img
              src="/images/backgrounds/gedung-sv-3d-iso-1.png"
              alt="Gedung SV UNS 3D Isometric Presisi"
              className="w-full h-auto object-contain filter contrast-110 saturate-125"
            />
          </div>

          {/* 5. Ambient Liquid Lighting Glow */}
          <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-blue-500/10 dark:bg-[#0F4C81]/25 blur-[140px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-amber-400/10 dark:bg-[#C5A059]/20 blur-[130px] rounded-full" />

          {/* 6. Smooth Architectural Gradient Mask (Perpaduan Halus Atas & Bawah) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-transparent to-[#F8FAFC] dark:from-[#07192C] dark:via-transparent dark:to-[#07192C]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-0.5 w-6 bg-gradient-to-r from-transparent to-[#000080] dark:to-[#FFD800]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#000080] dark:text-[#FFD800]">
              {t.catalogBadge}
            </span>
            <span className="text-slate-300 dark:text-white/30 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-300 hidden sm:inline">
              {isEn ? "Real Commercialization & Deployment" : "Hilirisasi & Implementasi Nyata"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
            <span className="h-0.5 w-6 bg-gradient-to-l from-transparent to-[#000080] dark:to-[#FFD800]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.catalogTitle}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2.5 font-medium leading-relaxed">
            {t.catalogSubtitle}
          </p>
        </ScrollReveal>

        {/* Filters Toolbar: 2-Tier Clean Grid (No overflow, flawless responsiveness) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm mb-10">
          {/* Tier 1: Category Filter Tabs */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-none pb-2 border-b border-slate-100 dark:border-white/5">
            <div className="inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 gap-1 shrink-0">
              {[
                { 
                  key: "", 
                  label: isEn ? (settings.catalog_tab_all_en || "All") : (settings.catalog_tab_all_id || "Semua"), 
                  icon: null 
                },
                { 
                  key: "teknologi", 
                  label: isEn ? (settings.catalog_tab_teknologi_en || "Technology (SaaS)") : (settings.catalog_tab_teknologi_id || "Teknologi (SaaS)"), 
                  icon: Laptop 
                },
                { 
                  key: "produk", 
                  label: isEn ? (settings.catalog_tab_produk_en || "Hardware (IoT)") : (settings.catalog_tab_produk_id || "Produk (IoT/Robot)"), 
                  icon: Cpu 
                },
                { 
                  key: "jasa", 
                  label: isEn ? (settings.catalog_tab_jasa_en || "Software House") : (settings.catalog_tab_jasa_id || "Jasa Software"), 
                  icon: Wrench 
                },
              ].map((tab) => {
                const isActive = selectedCategory === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedCategory(tab.key)}
                    className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer select-none flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#000080] text-white shadow-md shadow-blue-900/30"
                        : "text-slate-700 dark:text-slate-300 hover:text-[#000080] dark:hover:text-white"
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier 2: Search Input & Styled Edge Dropdowns */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-12 lg:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={isEn ? "Search innovations by title or keywords..." : "Cari nama inovasi, produk, teknologi..."}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000080] transition-all"
              />
            </div>

            {/* Custom Modern Searchable Prodi Dropdown (39 Prodi Lengkap & Terstruktur) */}
            <div className="sm:col-span-6 lg:col-span-3">
              <SearchableProdiDropdown
                prodis={prodis}
                selectedProdi={selectedProdi}
                onChange={(kode) => setSelectedProdi(kode)}
                isEn={isEn}
              />
            </div>

            {/* Custom Modern Sort Dropdown (Bukan Select Polosan) */}
            <div className="sm:col-span-6 lg:col-span-3">
              <CustomSortDropdown
                selectedSort={selectedSort}
                onChange={(sort) => setSelectedSort(sort)}
                isEn={isEn}
              />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-[#0F4C81] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-500">Memuat katalog inovasi...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("");
                setSelectedProdi("");
                setSearchKeyword("");
              }}
              className="mt-3 px-5 py-2 rounded-full bg-[#0F4C81] text-white text-xs font-bold hover:bg-[#135996]"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onOpenLiveDemo={handleOpenLiveDemo}
                onOpenVideoDemo={handleOpenVideoDemo}
              />
            ))}
          </div>
        )}
        </div>
      </section>

      {/* 5. SECTION 4: PORTOFOLIO PRODUK YANG SUDAH DIGUNAKAN MITRA INDUSTRI (DENGAN RATING) */}
      <section id="portofolio" className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 dark:from-[#061628] dark:via-[#07192C] dark:to-[#07192C] transition-colors border-y border-slate-200/80 dark:border-white/10">
        {/* Technical Blueprint Grid ("Kotak-Kotak") Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 select-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 76, 129, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 76, 129, 0.08) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
          aria-hidden="true"
        />

        {/* AI-Generated SV Pusat Blueprint Architectural Ambient Graphic */}
        <div className="absolute -right-20 lg:right-0 top-1/2 -translate-y-1/2 w-[550px] lg:w-[750px] pointer-events-none opacity-[0.14] dark:opacity-[0.09] overflow-hidden select-none" aria-hidden="true">
          <img
            src="/images/backgrounds/sv-blueprint-grid-generated.jpg"
            alt="Blueprint Gedung Sekolah Vokasi UNS Pusat Surakarta"
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen"
          />
        </div>

        {/* Gedung SV Pusat 8 Lantai Isometric Watermark */}
        <div className="absolute -left-28 bottom-0 w-[420px] pointer-events-none opacity-[0.08] dark:opacity-[0.05] overflow-hidden select-none" aria-hidden="true">
          <img
            src="/images/backgrounds/gedung-sv-3d-iso-2.png"
            alt="Gedung Sekolah Vokasi UNS Pusat Surakarta"
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Smooth gradient blend masks */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-transparent to-slate-50/80 dark:from-[#061628]/70 dark:via-transparent dark:to-[#07192C]/80 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-gradient-to-r from-transparent to-[#000080] dark:to-[#FFD800]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#000080] dark:text-[#FFD800]">
                {t.portfolioTagline}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
              <span className="h-0.5 w-6 bg-gradient-to-l from-transparent to-[#000080] dark:to-[#FFD800]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.portfolioTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 font-medium leading-relaxed">
              {t.portfolioDesc}
            </p>
          </ScrollReveal>

          {/* Portfolio Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioCases.map((item, idx) => (
              <ScrollReveal key={item.id || idx} direction="up" delay={idx * 100}>
                <div className="h-full rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 shadow-md hover:shadow-xl hover:border-[#0F4C81] dark:hover:border-sky-400 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    {/* Header: Mitra & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-white/10">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0F4C81] dark:text-sky-300 border border-blue-200 dark:border-blue-800">
                        {item.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{item.status}</span>
                      </span>
                    </div>

                    {/* Foto Bukti Dokumentasi Penggunaan Mitra Industri */}
                    {item.image && (
                      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 group-hover:border-[#0F4C81]/30 dark:group-hover:border-sky-400/30 transition-all shadow-xs">
                        <img
                          src={item.image}
                          alt={`Bukti Implementasi ${item.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] sm:text-[11px] font-extrabold text-white flex items-center gap-1.5 shadow-md border border-white/20">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dokumentasi Mitra Industri</span>
                        </div>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-[#0F4C81] dark:group-hover:text-sky-400 transition-colors">
                      {item.title}
                    </h3>

                    {/* Mitra Institusi Badge */}
                    <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Building2 className="w-4 h-4 text-[#C5A059]" />
                      <span>Mitra: <strong className="text-slate-900 dark:text-white">{item.partner}</strong></span>
                    </div>

                    {/* Star Rating & Review Metric */}
                    <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80">
                      <div className="flex items-center text-amber-500">
                        {[...Array(Math.min(5, Math.max(1, Math.round(item.rating || 5))))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-800 dark:text-amber-300">
                        {Number(item.rating || 5).toFixed(1)} / 5.0
                      </span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        ({item.reviewCount || 10} Verifikasi DUDI)
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    {/* Testimonial Quote Box */}
                    {item.testimonial && (
                      <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 text-xs italic text-slate-700 dark:text-slate-200">
                        <Quote className="w-4 h-4 text-[#C5A059] mb-1 inline mr-1" />
                        &quot;{item.testimonial}&quot;
                        {item.reviewer && (
                          <span className="block not-italic font-bold text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                            — {item.reviewer}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Impact Metric & Detail Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="block text-lg sm:text-xl font-black text-[#0F4C81] dark:text-[#C5A059]">
                        {item.metricValue}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {item.metricLabel}
                      </span>
                    </div>

                    <Link
                      href={item.slug.startsWith("/") || item.slug.startsWith("http") ? item.slug : `/katalog/${item.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold transition-all shadow-sm hover:scale-105"
                    >
                      <span>Lihat Spesifikasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION 5: TESTIMONI & RUNNING LOGO MITRA (2 BARIS MENGALIR: KIRI & KANAN) */}
      <section id="testimoni" className="py-20 sm:py-28 overflow-hidden bg-white dark:bg-[#07192C] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-gradient-to-r from-transparent to-[#000080] dark:to-[#FFD800]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#000080] dark:text-[#FFD800]">
                {t.testimonialsTagline}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#FFD800] animate-pulse" />
              <span className="h-0.5 w-6 bg-gradient-to-l from-transparent to-[#000080] dark:to-[#FFD800]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              {t.testimonialsTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
              {t.testimonialsDesc}
            </p>
          </ScrollReveal>

          {/* Testimonial Cards Grid (Pimpinan Mitra) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {testimonialItems.map((tItem, idx) => (
              <ScrollReveal key={tItem.id || tItem.name || idx} direction="up" delay={idx * 100}>
                <div className="h-full rounded-3xl p-6 sm:p-7 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center text-amber-400 mb-3.5">
                      {[...Array(Math.min(5, Math.max(1, Math.round(tItem.rating || 5))))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    {/* Quote text */}
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      &quot;{tItem.text}&quot;
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white p-1 border border-slate-200 dark:border-white/15 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={tItem.avatar || "/images/brand/logo-sv-uns-official-color.png"} alt={tItem.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">{tItem.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{tItem.role} • <strong>{tItem.company}</strong></p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>


          {/* RUNNING LOGO MITRA INDUSTRI (DIPERBESAR & 2 BARIS MENGALIR: KIRI & KANAN) */}
          <div className="text-center pt-8 border-t border-slate-200/80 dark:border-white/10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              {isEn
                ? (settings.partners_network_title_en || "Trusted Industry Partners Network")
                : (settings.partners_network_title_id || "Jaringan Mitra Industri Terpercaya")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 font-medium">
              {isEn
                ? (settings.partners_network_desc_en || "Close synergy with state-owned enterprises (BUMN), leading corporations, and city governments.")
                : (settings.partners_network_desc_id || "Sinergi erat dengan BUMN, korporasi terkemuka, dan pemerintah kota mewujudkan ekosistem hilirisasi riset terapan.")}
            </p>

            {/* BARIS 1: MENGALIR KE KIRI (LOGOS ENLARGED) */}
            <div className="relative py-2 overflow-hidden mb-4">
              <InfiniteSlider gap={28} duration={35} durationOnHover={20} reverse={false}>
                {row1Partners.map((logo, idx) => (
                  <div
                    key={`r1-${logo.name}-${idx}`}
                    className="flex items-center gap-3.5 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/15 backdrop-blur-xl shadow-xs shrink-0 hover:border-[#0F4C81] dark:hover:border-[#C5A059] transition-all hover:scale-105"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        alt={logo.alt || logo.name}
                        className="h-8 sm:h-9 w-auto max-w-[140px] object-contain pointer-events-none"
                        src={logo.src}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white whitespace-nowrap">
                      {logo.name}
                    </span>
                  </div>
                ))}
              </InfiniteSlider>

              <ProgressiveBlur blurIntensity={0.8} className="pointer-events-none absolute top-0 left-0 h-full w-[100px] z-10" direction="left" />
              <ProgressiveBlur blurIntensity={0.8} className="pointer-events-none absolute top-0 right-0 h-full w-[100px] z-10" direction="right" />
            </div>

            {/* BARIS 2: MENGALIR KE KANAN (REVERSE = TRUE) */}
            <div className="relative py-2 overflow-hidden">
              <InfiniteSlider gap={28} duration={35} durationOnHover={20} reverse={true}>
                {row2Partners.map((logo, idx) => (
                  <div
                    key={`r2-${logo.name}-${idx}`}
                    className="flex items-center gap-3.5 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/15 backdrop-blur-xl shadow-xs shrink-0 hover:border-[#0F4C81] dark:hover:border-[#C5A059] transition-all hover:scale-105"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        alt={logo.alt || logo.name}
                        className="h-8 sm:h-9 w-auto max-w-[140px] object-contain pointer-events-none"
                        src={logo.src}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white whitespace-nowrap">
                      {logo.name}
                    </span>
                  </div>
                ))}
              </InfiniteSlider>

              <ProgressiveBlur blurIntensity={0.8} className="pointer-events-none absolute top-0 left-0 h-full w-[100px] z-10" direction="left" />
              <ProgressiveBlur blurIntensity={0.8} className="pointer-events-none absolute top-0 right-0 h-full w-[100px] z-10" direction="right" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 6: PERTANYAAN UMUM (FAQ) */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* 8. SECTION 7: FOOTER TRANSPARAN GLASSMORPHISM */}
      <Footer />

      {/* 9. Interactive Modals */}
      {selectedDemoItem && selectedDemoItem.live_demo_url && (
        <LiveDemoModal
          isOpen={!!selectedDemoItem}
          onClose={() => setSelectedDemoItem(null)}
          productName={selectedDemoItem.nama_item}
          demoUrl={selectedDemoItem.live_demo_url}
          techStack={selectedDemoItem.specs?.map((s: { spec_key?: string; spec_value?: string }) => `${s.spec_key}: ${s.spec_value}`)}
        />
      )}

      {selectedVideoItem && (
        <VideoDemoModal
          isOpen={!!selectedVideoItem}
          onClose={() => setSelectedVideoItem(null)}
          title={selectedVideoItem.nama_item}
          prodi={selectedVideoItem.prodi?.nama_prodi || "D3 Teknik Informatika"}
          price={new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedVideoItem.harga_nominal)}
          picContact={selectedVideoItem.pic_kontak}
          deliverables={selectedVideoItem.specs?.map((s: { spec_value?: string }) => s.spec_value || "") || ["Source Code", "PRD", "Bug Fixing"]}
        />
      )}
    </div>
  );
}
