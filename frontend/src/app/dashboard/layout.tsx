"use client";

import React, { useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, PlusCircle, BarChart3, Users, 
  LogOut, Sun, Moon, ArrowLeft, Shield, Building2,
  ExternalLink, Bell, Search, CheckCircle2, ChevronRight,
  Menu, X, Pin, PinOff, Globe, Film, HelpCircle, ShieldCheck, Handshake, GraduationCap
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeAdminTab = searchParams ? (searchParams.get("tab") || "users") : "users";
  const { currentUser, logout, isDarkMode, toggleTheme } = useApp();
  const { settings } = useSiteSettings();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isExpanded = isHovered || isPinned || mobileMenuOpen;

  const handleLogout = () => {
    toast.info("Sesi Berakhir", "Anda telah keluar dari akun.");
    logout();
    router.push("/login");
  };

  const handleToggleTheme = () => {
    toggleTheme();
    toast.info(isDarkMode ? "Mode Terang Diaktifkan" : "Mode Gelap Diaktifkan");
  };

  const role = currentUser?.role || "prodi";

  // Breadcrumb / Title mapping
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Ringkasan Utama & Status Inovasi";
    if (pathname === "/dashboard/prodi") return "Katalog Program Studi";
    if (pathname === "/dashboard/prodi/create") return "Tambah Inovasi Baru (1-5)";
    if (pathname === "/dashboard/pimpinan") return "Eksekutif & Analitik Pimpinan";
    if (pathname === "/dashboard/admin") {
      if (activeAdminTab === "prodis") return "Kelola Program Studi SV (39 Prodi)";
      if (activeAdminTab === "moderation") return "Kelola & Moderasi Katalog Inovasi";
      if (activeAdminTab === "showcase") return "Showcase Video 3D Beranda";
      if (activeAdminTab === "faqs") return "Kelola Tanya Jawab (FAQ)";
      if (activeAdminTab === "site_cms") return "Pusat Tata Kelola Landing Page & Footer";
      if (activeAdminTab === "partners") return "Mitra Industri & Running Logo";
      return "Manajemen Pengguna & RBAC Super Admin";
    }
    return "Portal Manajemen Inovasi";
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-[#F8FAFC] dark:bg-[#050D18] text-slate-900 dark:text-white transition-colors">
      {/* ============================================================== */}
      {/* 1. COLLAPSIBLE HOVER-EXPAND SIDEBAR (DEEP NAVY BLUE THEME)     */}
      {/* ============================================================== */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed md:relative inset-y-0 left-0 z-50 md:z-30 h-[100dvh] max-h-[100dvh]
          bg-gradient-to-b from-[#07192C] via-[#0A2540] to-[#07192C] text-white
          border-r border-[#C5A059]/25 flex flex-col justify-between shrink-0
          shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"}
          ${!mobileMenuOpen && (isExpanded ? "md:w-72" : "md:w-20")}
        `}
      >
        {/* Subtle Sidebar Grid Background */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sidebar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sidebar-grid)" />
          </svg>
        </div>

        {/* Scrollable Container with Hidden Scrollbar so nothing is cut off */}
        <div className="relative z-10 flex flex-col h-full justify-between overflow-y-auto overflow-x-hidden scrollbar-none p-3.5 sm:p-4">
          <div>
            {/* Header: Logo, Brand & Pin toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 min-h-[52px]">
              <Link href="/" className="flex items-center gap-3 group min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 p-2 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src={settings.brand_logo_color_url || settings.brand_logo_url || "/images/brand/logo-sv-uns-official-new.png"}
                    alt={settings.brand_site_title || "Logo SV UNS"}
                    className="w-full h-full object-contain"
                  />
                </div>
                {isExpanded && (
                  <div className="text-left overflow-hidden whitespace-nowrap transition-opacity duration-200">
                    <span className="font-black text-sm tracking-tight text-white leading-tight block truncate uppercase">
                      {settings.sidebar_portal_title || settings.brand_site_title || "PORTAL VOKASI UNS"}
                    </span>
                    <span className="text-xs font-bold text-[#C5A059] tracking-wider block truncate uppercase">
                      {settings.sidebar_portal_subtitle || settings.brand_site_subtitle || "UNIVERSITAS SEBELAS MARET"}
                    </span>
                  </div>
                )}
              </Link>

              {/* Pin & Mobile Close Buttons */}
              <div className="flex items-center gap-1">
                {isExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsPinned(!isPinned)}
                    className="hidden md:flex p-1.5 rounded-full text-slate-400 hover:text-[#C5A059] hover:bg-white/10 transition cursor-pointer"
                    title={isPinned ? "Lepas Pin (Auto-Collapse)" : "Kunci Sidebar Terbuka (Pin)"}
                  >
                    {isPinned ? <PinOff className="w-4 h-4 text-[#C5A059]" /> : <Pin className="w-4 h-4" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="md:hidden p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* User Profile Card */}
            <div className={`mt-3.5 transition-all duration-200 ${
              isExpanded 
                ? "p-3 rounded-2xl bg-[#0F4C81]/30 border border-[#C5A059]/30 text-left backdrop-blur-md shadow-inner" 
                : "flex justify-center"
            }`}>
              <div className="flex items-center gap-3">
                <div 
                  style={{ borderRadius: "9999px" }}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5A059] to-amber-300 text-[#07192C] flex items-center justify-center text-sm font-black shadow-md shrink-0 relative"
                  title={`${currentUser?.name || "User"} (${currentUser?.role_label || role})`}
                >
                  {currentUser?.name?.charAt(0).toUpperCase() || "A"}
                  {!isExpanded && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#07192C]" />
                  )}
                </div>

                {isExpanded && (
                  <div className="overflow-hidden min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate tracking-tight">
                      {currentUser?.name || "Super Admin"}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span 
                        style={{ borderRadius: "9999px" }}
                        className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 tracking-wide inline-block truncate"
                      >
                        {currentUser?.role_label || (role === "super_admin" ? "Super Administrator" : role === "pimpinan_sv" ? "Pimpinan SV" : "Admin Prodi")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-5 space-y-1 text-sm font-semibold text-left">
              {isExpanded ? (
                <div className="px-3 pb-1 text-xs uppercase tracking-wider font-extrabold text-[#C5A059]/90 whitespace-nowrap">
                  Menu Utama
                </div>
              ) : (
                <div className="w-8 h-px bg-white/10 mx-auto my-2" />
              )}

              {/* 1. Ringkasan Utama */}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                title="Ringkasan Utama"
                style={{ borderRadius: "9999px" }}
                className={`flex items-center transition-all ${
                  isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                } ${
                  pathname === "/dashboard"
                    ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                    : "!text-white/90 hover:!text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-[#C5A059] shrink-0" />
                  {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Ringkasan Utama</span>}
                </div>
                {isExpanded && pathname === "/dashboard" && <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />}
              </Link>

              {/* 2. Prodi Menus */}
              {(role === "prodi" || role === "super_admin") && (
                <>
                  <Link
                    href="/dashboard/prodi"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Katalog Prodi Saya"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/prodi"
                        ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Katalog Prodi Saya</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/prodi" && <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />}
                  </Link>

                  <Link
                    href="/dashboard/prodi/create"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Tambah Inovasi"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/prodi/create"
                        ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Tambah Inovasi</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/prodi/create" && <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />}
                  </Link>
                </>
              )}

              {/* 3. Pimpinan Menus */}
              {(role === "pimpinan_sv" || role === "super_admin") && (
                <Link
                  href="/dashboard/pimpinan"
                  onClick={() => setMobileMenuOpen(false)}
                  title="Eksekutif & Analitik"
                  style={{ borderRadius: "9999px" }}
                  className={`flex items-center transition-all ${
                    isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                  } ${
                    pathname === "/dashboard/pimpinan"
                      ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                      : "!text-white/90 hover:!text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" />
                    {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Eksekutif & Analitik</span>}
                  </div>
                  {isExpanded && pathname === "/dashboard/pimpinan" && <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />}
                </Link>
              )}

              {/* 4. Super Admin Dedicated Menus */}
              {role === "super_admin" && (
                <div className="pt-2 space-y-1">
                  {isExpanded ? (
                    <div className="px-3 pb-1 text-xs uppercase tracking-wider font-extrabold text-[#C5A059] flex items-center justify-between">
                      <span>Menu Super Admin</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] font-mono font-bold">PUSAT</span>
                    </div>
                  ) : (
                    <div className="w-8 h-px bg-[#C5A059]/30 mx-auto my-2" />
                  )}

                  {/* 4.1 Kelola Akun & User */}
                  <Link
                    href="/dashboard/admin?tab=users"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Kelola Akun & User"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/admin" && (activeAdminTab === "users" || !activeAdminTab)
                        ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-purple-400 shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Kelola Akun (RBAC)</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/admin" && (activeAdminTab === "users" || !activeAdminTab) && (
                      <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    )}
                  </Link>

                  {/* 4.2 Kelola & Moderasi Katalog */}
                  <Link
                    href="/dashboard/admin?tab=moderation"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Kelola & Moderasi Katalog"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/admin" && activeAdminTab === "moderation"
                        ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Kelola Katalog</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/admin" && activeAdminTab === "moderation" && (
                      <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    )}
                  </Link>

                  {/* 4.3 Kelola Program Studi SV (39 Prodi) */}
                  <Link
                    href="/dashboard/admin?tab=prodis"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Kelola Program Studi (39 Prodi)"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/admin" && activeAdminTab === "prodis"
                        ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-[#FFD800] shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Kelola Program Studi (39)</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/admin" && activeAdminTab === "prodis" && (
                      <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    )}
                  </Link>

                  {/* 4.4 Showcase Video Beranda */}
                  <Link
                    href="/dashboard/admin?tab=showcase"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Showcase Video 3D Beranda"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/admin" && activeAdminTab === "showcase"
                        ? "bg-gradient-to-r from-[#C5A059] to-[#dfba6a] !text-[#0A2540] shadow-[0_4px_16px_rgba(197,160,89,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Film className="w-4 h-4 text-amber-300 shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Showcase Video 3D</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/admin" && activeAdminTab === "showcase" && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#0A2540] shrink-0" />
                    )}
                  </Link>

                  {/* 4.5 Kelola FAQ */}
                  <Link
                    href="/dashboard/admin?tab=faqs"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Kelola Tanya Jawab (FAQ)"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/admin" && activeAdminTab === "faqs"
                        ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Kelola FAQ</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/admin" && activeAdminTab === "faqs" && (
                      <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    )}
                  </Link>

                  {/* 4.6 CMS Landing Page & Footer */}
                  <Link
                    href="/dashboard/admin?tab=site_cms"
                    onClick={() => setMobileMenuOpen(false)}
                    title="CMS Landing Page & Footer"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/admin" && activeAdminTab === "site_cms"
                        ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">CMS Landing Page</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/admin" && activeAdminTab === "site_cms" && (
                      <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    )}
                  </Link>

                  {/* 4.7 Mitra Industri & Running Logo */}
                  <Link
                    href="/dashboard/admin?tab=partners"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Mitra Industri & Running Logo"
                    style={{ borderRadius: "9999px" }}
                    className={`flex items-center transition-all ${
                      isExpanded ? "justify-between px-3.5 py-2.5 rounded-full" : "justify-center w-11 h-11 rounded-2xl mx-auto"
                    } ${
                      pathname === "/dashboard/admin" && activeAdminTab === "partners"
                        ? "bg-[#0F4C81] !text-white border border-sky-400/40 shadow-[0_4px_16px_rgba(15,76,129,0.5)] font-black"
                        : "!text-white/90 hover:!text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Handshake className="w-4 h-4 text-indigo-300 shrink-0" />
                      {isExpanded && <span className="whitespace-nowrap !text-white font-semibold">Mitra Industri & Logo</span>}
                    </div>
                    {isExpanded && pathname === "/dashboard/admin" && activeAdminTab === "partners" && (
                      <ChevronRight className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    )}
                  </Link>
                </div>
              )}

            </nav>
          </div>

          {/* Bottom Actions - Clean Flexbox with Guaranteed Spacing */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5 text-sm mt-4 shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              title={isDarkMode ? "Ganti ke Tema Terang" : "Ganti ke Tema Gelap"}
              className={`flex items-center transition-all cursor-pointer font-bold border border-white/10 ${
                isExpanded 
                  ? "w-full justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white" 
                  : "justify-center w-11 h-11 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 mx-auto"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDarkMode ? <Moon className="w-4 h-4 text-sky-300 shrink-0" /> : <Sun className="w-4 h-4 text-amber-400 shrink-0" />}
                {isExpanded && <span className="whitespace-nowrap text-xs font-semibold">{isDarkMode ? "Tema: Gelap" : "Tema: Terang"}</span>}
              </div>
              {isExpanded && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/15 text-amber-300 font-extrabold whitespace-nowrap">
                  {isDarkMode ? "Ubah Terang" : "Ubah Gelap"}
                </span>
              )}
            </button>

            {/* Back to Public Web */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              title="Kembali ke Beranda Publik"
              className={`flex items-center transition font-bold border border-white/5 ${
                isExpanded 
                  ? "w-full gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 !text-white/90 hover:!text-white" 
                  : "justify-center w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 !text-white/90 mx-auto"
              }`}
            >
              <ArrowLeft className="w-4 h-4 shrink-0 text-slate-300" />
              {isExpanded && <span className="whitespace-nowrap !text-white text-xs font-semibold">Kembali ke Beranda</span>}
            </Link>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              title="Keluar Akun"
              className={`flex items-center transition font-black cursor-pointer border border-rose-500/30 ${
                isExpanded 
                  ? "w-full gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-200" 
                  : "justify-center w-11 h-11 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 mx-auto"
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {isExpanded && <span className="whitespace-nowrap text-xs font-bold">Keluar Akun</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ============================================================== */}
      {/* 2. MAIN WORKSPACE (INDEPENDENT SCROLL + BLUE HEADER + UNS BG)   */}
      {/* ============================================================== */}
      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden relative transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
        {/* ============================================================== */}
        {/* 2.1 STICKY BLUE HEADER (RESPONSIVE & DYNAMIC ADJUSTMENT)       */}
        {/* ============================================================== */}
        <header className="h-14 sm:h-16 bg-[#07192C] border-b border-[#C5A059]/20 px-3 sm:px-6 lg:px-8 flex items-center justify-between z-20 shrink-0 text-white shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1 mr-2 sm:mr-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/15 shrink-0 cursor-pointer"
              title="Buka Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Quick Toggle for Sidebar (Pin / Unpin) */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className="hidden md:flex p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition cursor-pointer shrink-0"
              title={isPinned ? "Lepas Kunci Sidebar (Auto-Collapse saat Kursor Keluar)" : "Kunci Sidebar Terbuka"}
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C5A059] block truncate">
                  {settings.sidebar_portal_title || settings.brand_site_title || "PORTAL VOKASI UNS"}
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 truncate">
                  {settings.sidebar_portal_subtitle || settings.brand_site_subtitle || "Universitas Sebelas Maret"}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm lg:text-base font-black text-white tracking-tight truncate">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* System Online Badge */}
            <span 
              style={{ borderRadius: "9999px" }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>MySQL Live</span>
            </span>

            {/* Quick Link to Public Web */}
            <Link
              href="/katalog"
              target="_blank"
              style={{ borderRadius: "9999px" }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0F4C81] hover:bg-[#135996] border border-sky-400/30 text-white text-xs sm:text-sm font-bold transition shadow-xs whitespace-nowrap cursor-pointer"
            >
              <span className="hidden sm:inline">Web Publik</span>
              <span className="sm:hidden">Web</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </header>

        {/* ============================================================== */}
        {/* 2.2 INDEPENDENT SCROLLABLE MAIN CONTENT AREA                   */}
        {/* ============================================================== */}
        <main className="flex-1 overflow-y-auto relative p-3.5 sm:p-6 lg:p-8 text-left">
          {/* Gedung Baru Sekolah Vokasi UNS Pusat Architectural Watermark */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.14] dark:opacity-[0.12]" aria-hidden="true">
            <picture>
              <img
                src={settings.bg_campus_landscape_url || "/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp"}
                alt="Gedung Baru Sekolah Vokasi UNS Pusat Watermark"
                className="w-full h-full object-cover object-center filter saturate-120 contrast-110"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/70 via-transparent to-[#F8FAFC]/85 dark:from-[#050D18]/70 dark:via-transparent dark:to-[#050D18]/85" />
          </div>

          {/* Coordinate Grid in Content Surface */}
          <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="content-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#content-grid)" />
            </svg>
          </div>

          {/* Children View Layer (z-10) */}
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#07192C] flex items-center justify-center text-[#C5A059] font-bold">Memuat Portal...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
