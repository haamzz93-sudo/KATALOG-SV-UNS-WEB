"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, Moon, 
  ChevronDown, ChevronRight,
  Layers, Menu, X, ArrowRight,
  GraduationCap, Search, ExternalLink,
  PhoneCall
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { getLocalizedSetting, autoTranslateIndonesianToEnglish } from "../../lib/i18n";
import { ALL_OFFICIAL_PROGRAMS } from "../../lib/academicPrograms";

interface NavItem {
  id: string;
  labelId: string;
  labelEn: string;
  href: string;
}

export const DynamicIslandHeader: React.FC = () => {
  const pathname = usePathname();
  const { currentLang, toggleLang, isDarkMode, toggleTheme, currentUser } = useApp();
  const { settings } = useSiteSettings();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("beranda");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isRightDropdownOpen, setIsRightDropdownOpen] = useState(false);
  const [isProdiModalOpen, setIsProdiModalOpen] = useState(false);
  const [prodiSearchQuery, setProdiSearchQuery] = useState("");
  const [prodiDegreeFilter, setProdiDegreeFilter] = useState<"all" | "S2" | "D4" | "D3">("all");

  const rightDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const configuredNavLinks: NavItem[] = (settings.header_nav_links && Array.isArray(settings.header_nav_links) && settings.header_nav_links.length > 0)
    ? settings.header_nav_links
        .filter((l: any) => l.isActive !== false)
        .map((l: any) => ({
          id: l.id || l.href.replace(/[^a-zA-Z0-9]/g, ""),
          labelId: l.labelId || l.label || "Menu",
          labelEn: l.labelEn || (l.labelId ? autoTranslateIndonesianToEnglish(l.labelId) : l.label || "Menu"),
          href: l.href,
        }))
    : [
        { id: "beranda", labelId: "Beranda", labelEn: "Home", href: "/#beranda" },
        { id: "layanan", labelId: "3 Layanan", labelEn: "Services", href: "/#layanan" },
        { id: "katalog", labelId: "Katalog", labelEn: "Catalog", href: "/#katalog" },
        { id: "portofolio", labelId: "Portofolio", labelEn: "Portfolio", href: "/#portofolio" },
        { id: "testimoni", labelId: "Mitra", labelEn: "Partners", href: "/#testimoni" },
        { id: "faq", labelId: "FAQ", labelEn: "FAQ", href: "/#faq" },
      ];

  const navLinks = configuredNavLinks;

  // Ref tracking for sliding switch pill animation (Kementan style)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const updatePill = (id: string) => {
    const idx = navLinks.findIndex((l) => l.id === id);
    if (idx !== -1 && navRefs.current[idx]) {
      const el = navRefs.current[idx];
      if (el) {
        setPillStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      }
    }
  };

  useEffect(() => {
    updatePill(activeNav);
  }, [activeNav, isScrolled, currentLang, settings.header_nav_links]);

  // Scroll detection & Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      if (pathname === "/") {
        if (scrollY < 260) {
          setActiveNav("beranda");
          return;
        }

        const sections = ["layanan", "katalog", "portofolio", "testimoni", "faq"];
        for (const secId of sections) {
          const el = document.getElementById(secId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 260 && rect.bottom >= 120) {
              setActiveNav(secId);
              return;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => updatePill(activeNav);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeNav]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavItem) => {
    setActiveNav(link.id);
    updatePill(link.id);

    if (link.id === "beranda" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      return;
    }

    if (pathname === "/" && link.href.includes("#")) {
      e.preventDefault();
      const targetId = link.href.split("#")[1];
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  const handleRightDropdownEnter = () => {
    if (rightDropdownTimeoutRef.current) clearTimeout(rightDropdownTimeoutRef.current);
    setIsRightDropdownOpen(true);
  };

  const handleRightDropdownLeave = () => {
    rightDropdownTimeoutRef.current = setTimeout(() => {
      setIsRightDropdownOpen(false);
    }, 180);
  };

  // Filter 39 Program Studi
  const filteredProdis = ALL_OFFICIAL_PROGRAMS.filter((p) => {
    const matchesDegree = prodiDegreeFilter === "all" || p.degree === prodiDegreeFilter;
    const matchesSearch =
      prodiSearchQuery.trim() === "" ||
      p.name.toLowerCase().includes(prodiSearchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(prodiSearchQuery.toLowerCase());
    return matchesDegree && matchesSearch;
  });

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none ${
          isScrolled ? "pt-3 sm:pt-4 px-3 sm:px-6" : "pt-0 px-0"
        }`}
      >
        {/* 
          CONTAINER NAVBAR:
          - Non-Scroll: KOTAK w-full, border-b, docked rapi di puncak layar
          - Scroll: DYNAMIC ISLAND SOLID GLASS (floating capsule, specular highlight, zero bleed)
        */}
        <div
          className={`pointer-events-auto transition-all duration-300 ease-out relative ${
            isScrolled
              ? "w-[96%] sm:w-[94%] xl:w-[92%] max-w-7xl rounded-full px-3 sm:px-6 md:px-8 py-2 bg-[#07192C]/95 dark:bg-[#07192C]/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.3)] ring-1 ring-blue-500/20 flex items-center justify-between"
              : "w-full rounded-none px-3.5 sm:px-6 py-3 bg-[#07192C]/95 backdrop-blur-xl border-b border-white/10 shadow-md flex items-center justify-between"
          }`}
        >
          {/* Liquid Glass Highlight Overlay (Hanya di mode scroll, dengan overflow-hidden terisolasi) */}
          {isScrolled && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-x-12 top-0 h-[40%] rounded-t-full bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
            </div>
          )}

          <div className={`w-full flex items-center justify-between gap-2 sm:gap-3.5 ${!isScrolled ? "max-w-7xl mx-auto" : ""}`}>
            {/* 1. Brand Logo & Typography */}
            <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2.5 group shrink min-w-0 relative z-10 no-underline text-decoration-none">
              <div className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-white p-1 flex items-center justify-center shadow-md ring-2 ring-[#0F4C81]/50 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <img
                  src={settings.brand_logo_color_url || settings.brand_logo_url || "/images/brand/logo-sv-uns-official-new.png"}
                  alt="Logo Resmi Sekolah Vokasi UNS"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-[11px] sm:text-xs md:text-sm text-white tracking-tight leading-none group-hover:text-sky-300 transition-colors truncate uppercase max-w-[125px] sm:max-w-none">
                    {getLocalizedSetting("brand_site_title", settings, currentLang, "VOKASI UNS", "VOCATIONAL UNS")}
                  </span>
                  <span className="text-slate-500 hidden sm:inline">•</span>
                  <span className="text-[10px] sm:text-[11px] font-black text-[#C5A059] tracking-wider hidden sm:inline whitespace-nowrap uppercase">
                    {getLocalizedSetting("brand_site_subtitle", settings, currentLang, "SEKOLAH VOKASI", "VOCATIONAL SCHOOL")}
                  </span>
                </div>
                {!isScrolled && (
                  <span className="text-[10px] text-slate-300 font-medium hidden 2xl:block whitespace-nowrap mt-0.5">
                    {settings.brand_tagline || "Pusat Hilirisasi Riset Terapan & Inovasi DUDI"}
                  </span>
                )}
              </div>
            </Link>

            {/* 2. Desktop Center Nav with Sliding Switch Pill (Kementan style) */}
            <nav className="hidden xl:flex items-center relative bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-inner z-10 shrink-0 h-8.5 sm:h-9">
              {/* Sliding Pill Indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-[#0F4C81] via-[#1A5994] to-[#2563EB] shadow-[0_2px_14px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.8)] border border-sky-300/40 transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                }}
              />

              {navLinks.map((link, idx) => {
                const isActive = activeNav === link.id;
                const label = currentLang === "en" 
                  ? (link.labelEn || autoTranslateIndonesianToEnglish(link.labelId)) 
                  : (link.labelId || link.labelEn);
                return (
                  <a
                    key={link.id}
                    ref={(el) => {
                      navRefs.current[idx] = el;
                    }}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    style={{ color: isActive ? "#FFFFFF" : "#E2E8F0" }}
                    className={`relative z-10 whitespace-nowrap px-2.5 xl:px-3 py-1 text-xs font-bold rounded-full transition-colors duration-200 select-none cursor-pointer no-underline flex items-center h-full ${
                      isActive
                        ? "!text-white font-extrabold drop-shadow-sm"
                        : "!text-slate-200 hover:!text-white"
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>

            {/* 3. FAR RIGHT AREA: Responsive unified controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative z-10">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={toggleLang}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xs flex items-center shrink-0 cursor-pointer"
                title="Ganti Bahasa (ID / EN)"
              >
                <span className={currentLang === "id" ? "text-[#FFD800]" : "text-slate-400"}>ID</span>
                <span className="text-white/40 mx-0.5 sm:mx-1">/</span>
                <span className={currentLang === "en" ? "text-[#FFD800]" : "text-slate-400"}>EN</span>
              </button>

              {/* Theme Switcher (Hidden on narrow mobile, available in mobile drawer) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="hidden xs:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full items-center justify-center text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xs shrink-0 cursor-pointer"
                title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-sky-200" />}
              </button>

              {/* DROPDOWN MENU DI PALING KANAN (Desktop/Tablet only) */}
              <div
                className="relative hidden md:block"
                onMouseEnter={handleRightDropdownEnter}
                onMouseLeave={handleRightDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setIsRightDropdownOpen(!isRightDropdownOpen)}
                  className="h-8 sm:h-9 inline-flex items-center gap-1.5 px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all hover:scale-105 shadow-xs shrink-0 cursor-pointer"
                  aria-label="Menu Direktori"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#FFD800]" />
                  <span>Menu</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRightDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Popover dengan Frosted Glass Blur */}
                <AnimatePresence>
                  {isRightDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-3 w-72 p-3.5 rounded-2xl bg-[#07192C]/96 backdrop-blur-xl border border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.25)] z-50 text-left space-y-2 text-white ring-1 ring-blue-500/25"
                    >
                      <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#FFD800] border-b border-white/10 flex items-center justify-between">
                        <span>{currentLang === "en" ? "UNS Vocational Portal Access" : "Pusat Akses Vokasi UNS"}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD800] animate-pulse" />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsRightDropdownOpen(false);
                          setIsProdiModalOpen(true);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/15 transition-all text-xs font-bold text-left text-white group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#FFD800] group-hover:scale-110 transition-transform" />
                          <span>
                            {currentLang === "en"
                              ? (settings.header_menu_prodi_label_en || "39 Study Programs Directory")
                              : (settings.header_menu_prodi_label || "Direktori 39 Program Studi")}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <a
                        href="/#katalog"
                        onClick={() => setIsRightDropdownOpen(false)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/15 transition-all text-xs font-bold text-white no-underline group"
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                          <span>
                            {currentLang === "en"
                              ? (settings.header_menu_catalog_label_en || "Complete Product Catalog")
                              : (settings.header_menu_catalog_label || "Katalog Produk Lengkap")}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                      </a>

                      <a
                        href={`https://wa.me/${settings.dudi_whatsapp_number || "6285191911130"}?text=Halo%20Sekolah%20Vokasi%20UNS,%20kami%20tertarik%20kemitraan%20riset%20inovasi.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/15 transition-all text-xs font-bold text-white no-underline group"
                      >
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span>
                            {currentLang === "en"
                              ? (settings.header_menu_contact_label_en || "Contact Partnership Lead")
                              : (settings.header_menu_contact_label || "Hubungi PIC Kemitraan")}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Portal CTA Button: Hidden on mobile screen, accessible in drawer */}
              <Link
                href={settings.header_cta_link || (currentUser ? "/dashboard" : "/login")}
                className="hidden sm:inline-flex h-8 sm:h-8.5 relative group overflow-hidden items-center gap-1.5 px-3 sm:px-3.5 rounded-full bg-gradient-to-r from-blue-600 via-[#0F4C81] to-[#000080] hover:from-blue-500 hover:to-[#0F4C81] text-white text-[11px] sm:text-xs font-bold shadow-md border border-white/25 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 no-underline"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <Layers className="w-3.5 h-3.5 text-sky-100 group-hover:rotate-6 transition-transform shrink-0" />
                <span>
                  {currentLang === "en"
                    ? (settings.header_cta_text_en || (currentUser ? "Dashboard" : "Login"))
                    : (settings.header_cta_text || (currentUser ? "Dashboard" : "Masuk"))}
                </span>
                <ArrowRight className="w-3 h-3 text-sky-100 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>

              {/* Mobile Menu Toggle Button (Prominent, High Contrast & Easy Tap) */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="xl:hidden p-2 rounded-xl text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                aria-label="Toggle Mobile Menu"
              >
                {mobileDrawerOpen ? <X className="w-5 h-5 text-sky-300" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Animated Drawer (High Contrast, Robust & Touch Friendly) */}
        {mobileDrawerOpen && (
          <div className="pointer-events-auto w-[95%] max-w-md mt-2.5 rounded-2xl bg-[#07192C] backdrop-blur-2xl border border-white/20 p-4 shadow-2xl transition-all animate-in fade-in slide-in-from-top-3 duration-200 z-50 ring-1 ring-blue-500/30 text-white">
            {/* Top Drawer Controls: Section Title, Language & Theme */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD800] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FFD800]" />
                <span>{currentLang === "en" ? "Navigation Menu" : "Menu Navigasi Portal"}</span>
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={toggleLang}
                  className="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase text-white hover:bg-white/20 border border-white/15 cursor-pointer"
                  title="Ganti Bahasa (ID / EN)"
                >
                  <span className={currentLang === "id" ? "text-[#FFD800]" : "text-slate-400"}>ID</span>
                  <span className="text-white/40 mx-0.5">/</span>
                  <span className={currentLang === "en" ? "text-[#FFD800]" : "text-slate-400"}>EN</span>
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 border border-white/15 cursor-pointer"
                  title="Ganti Tema"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-sky-200" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 border border-white/15 cursor-pointer"
                  title="Tutup Menu"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Nav Links with High Contrast Guaranteed */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = activeNav === link.id;
                const label = currentLang === "en" 
                  ? (link.labelEn || autoTranslateIndonesianToEnglish(link.labelId)) 
                  : (link.labelId || link.labelEn);
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link);
                      setMobileDrawerOpen(false);
                    }}
                    style={{ color: isActive ? "#FFFFFF" : "#F1F5F9" }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all no-underline flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#0F4C81] to-blue-600 !text-white shadow-md border border-sky-400/40"
                        : "!text-slate-100 hover:!text-white hover:bg-white/15"
                    }`}
                  >
                    <span className="!text-white font-extrabold">{label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-sky-200" : "text-slate-400"}`} />
                  </a>
                );
              })}

              <div className="pt-2.5 border-t border-white/10 space-y-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setIsProdiModalOpen(true);
                  }}
                  style={{ color: "#FFFFFF" }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 !text-white text-xs font-bold uppercase tracking-wider border border-white/15 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#FFD800]" />
                    <span className="!text-white font-bold">
                      {currentLang === "en"
                        ? (settings.header_menu_prodi_label_en || "39 Study Programs Directory")
                        : (settings.header_menu_prodi_label || "Direktori 39 Program Studi")}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </button>

                <a
                  href="/#katalog"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ color: "#FFFFFF" }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 !text-white text-xs font-bold uppercase tracking-wider border border-white/15 no-underline cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span className="!text-white font-bold">
                      {currentLang === "en"
                        ? (settings.header_menu_catalog_label_en || "Complete Product Catalog")
                        : (settings.header_menu_catalog_label || "Katalog Produk Lengkap")}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </a>

                <a
                  href={`https://wa.me/${settings.dudi_whatsapp_number || "6285191911130"}?text=Halo%20Sekolah%20Vokasi%20UNS,%20kami%20tertarik%20kemitraan%20riset%20inovasi.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ color: "#A7F3D0" }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 !text-emerald-200 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 no-underline cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span className="!text-emerald-200 font-bold">
                      {currentLang === "en"
                        ? (settings.header_menu_contact_label_en || "Contact Partnership Lead")
                        : (settings.header_menu_contact_label || "Hubungi PIC Kemitraan")}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </a>

                {/* Primary CTA in Drawer */}
                <Link
                  href={settings.header_cta_link || (currentUser ? "/dashboard" : "/login")}
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ color: "#FFFFFF" }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-[#0F4C81] to-[#000080] hover:from-blue-500 hover:to-[#0F4C81] !text-white text-xs font-black uppercase transition-all shadow-lg border border-white/25 no-underline mt-1 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-sky-100" />
                  <span className="!text-white font-black">
                    {currentLang === "en"
                      ? (settings.header_cta_text_en || (currentUser ? "Dashboard" : "Login"))
                      : (settings.header_cta_text || (currentUser ? "Dashboard" : "Masuk"))}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-100" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MODAL DIREKTORI 39 PROGRAM STUDI VOKASI */}
      <AnimatePresence>
        {isProdiModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl pointer-events-auto"
            onClick={() => setIsProdiModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[85vh] bg-[#07192C] text-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col ring-1 ring-blue-500/20"
            >
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-sky-400 border border-sky-400/40 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white m-0">
                      Direktori Resmi 39 Program Studi Sekolah Vokasi UNS
                    </h3>
                    <p className="text-xs text-slate-300 m-0">
                      Magister Terapan (S2), Sarjana Terapan (D4), dan Ahli Madya (D3)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProdiModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-900/60 border-b border-white/10 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={prodiSearchQuery}
                    onChange={(e) => setProdiSearchQuery(e.target.value)}
                    placeholder="Cari program studi (misal: Informatika, Akuntansi, Mesin, K3)..."
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(["all", "S2", "D4", "D3"] as const).map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setProdiDegreeFilter(deg)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        prodiDegreeFilter === deg
                          ? "bg-[#0F4C81] text-white border border-sky-400"
                          : "bg-white/10 text-slate-300 hover:bg-white/15"
                      }`}
                    >
                      {deg === "all" ? "Semua Jenjang" : deg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredProdis.map((p) => (
                  <div
                    key={p.code}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#0F4C81] transition-all flex items-start justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-sky-400/30">
                          {p.degree}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {p.code}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors m-0">
                        {p.name}
                      </h4>
                    </div>

                    <a
                      href={`/katalog?prodi=${p.code}`}
                      onClick={() => setIsProdiModalOpen(false)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-[#0F4C81] text-white transition-colors shrink-0"
                      title="Lihat Inovasi Prodi"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
