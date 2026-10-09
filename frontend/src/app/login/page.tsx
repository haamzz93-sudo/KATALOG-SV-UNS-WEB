"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Lock, User, ArrowRight, ShieldCheck, 
  Eye, EyeOff, Building2, 
  CheckCircle2, ArrowLeft, Check
} from "lucide-react";
import { api } from "../../lib/api";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { 
  checkLoginRateLimit, 
  recordFailedLoginAttempt, 
  resetLoginAttempts, 
  sanitizeInput,
  savePersistentAuth,
  getPersistentAuth,
  clearPersistentAuth
} from "../../lib/security";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const { toast } = useToast();
  const { settings } = useSiteSettings();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Cek apakah ada akun yang disimpan untuk auto-login otomatis
    const saved = getPersistentAuth();
    const isRemembered = typeof window !== "undefined" && localStorage.getItem("vokasi_remember_me") === "true";

    if (saved && isRemembered && saved.email && saved.pass) {
      setEmail(saved.email);
      setPassword(saved.pass);
      setRememberMe(true);
      setAutoLoggingIn(true);

      const performAutoLogin = async () => {
        try {
          const res = await api.login(saved.email, saved.pass, true);
          if (res.success && res.data) {
            resetLoginAttempts();
            setIsSuccess(true);
            setCurrentUser(res.data.user);
            toast.success("Autologin Aktif", `Selamat datang kembali, ${res.data.user.name}!`);
            setTimeout(() => {
              router.push("/dashboard");
            }, 600);
          } else {
            setAutoLoggingIn(false);
          }
        } catch {
          setAutoLoggingIn(false);
        }
      };

      performAutoLogin();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. Security Check: Brute Force Rate Limiting
    const rateLimit = checkLoginRateLimit();
    if (rateLimit.isLocked) {
      const msg = `Terlalu banyak percobaan gagal. Akses login terkunci selama ${rateLimit.remainingSeconds} detik demi keamanan.`;
      setErrorMsg(msg);
      toast.error("Keamanan Sistem", msg);
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail = sanitizeInput(email);
      const res = await api.login(cleanEmail, password, rememberMe);
      
      if (res.success && res.data) {
        resetLoginAttempts();
        if (rememberMe) {
          savePersistentAuth(cleanEmail, password);
        } else {
          clearPersistentAuth();
        }
        setIsSuccess(true);
        setCurrentUser(res.data.user);
        toast.success("Autentikasi Berhasil", `Selamat datang kembali, ${res.data.user.name}!`);
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      } else {
        const status = recordFailedLoginAttempt();
        const msg = status.isLocked
          ? `Batas percobaan login tercapai. Akun dikunci sementara selama 60 detik.`
          : res.message || `Kredensial tidak valid. Sisa percobaan: ${status.attemptsLeft}`;
        setErrorMsg(msg);
        toast.error("Gagal Masuk", msg);
      }
    } catch {
      setErrorMsg("Terjadi gangguan koneksi ke server backend.");
      toast.error("Gangguan Server", "Gagal menghubungi server autentikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07192C] text-white flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 relative overflow-hidden selection:bg-[#C5A059] selection:text-[#07192C]">
      {/* 1. CAMPUS CENTRAL BUILDING BACKGROUND (Sekolah Vokasi UNS Pusat Surakarta) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <picture>
          <img
            src={settings.login_bg_silhouette_url || "/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp"}
            alt="Gedung Baru Sekolah Vokasi UNS Pusat Surakarta"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter contrast-125 saturate-125"
          />
        </picture>
        {/* Soft Vignette Gradients matching dark blue color */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07192C] via-[#07192C]/75 to-[#07192C]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07192C]/90 via-transparent to-[#07192C]/90" />
      </div>

      {/* 2. Zero-Cost Ambient Lighting Halos */}
      <div 
        className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(15, 76, 129, 0.35) 0%, rgba(15, 76, 129, 0.06) 50%, transparent 70%)"
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(197, 160, 89, 0.20) 0%, rgba(197, 160, 89, 0.04) 50%, transparent 70%)"
        }}
      />

      {/* Top Bar: Back to Home Pill Button */}
      <div className="w-full max-w-5xl mb-3 sm:mb-6 z-20 flex justify-between items-center px-1 sm:px-2">
        <Link 
          href="/" 
          style={{ borderRadius: "9999px" }}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-slate-200 hover:text-white backdrop-blur-md transition-all group shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda Publik</span>
        </Link>

        <span 
          style={{ borderRadius: "9999px" }}
          className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full bg-[#0F4C81]/40 border border-sky-400/30 text-sky-200 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Portal Resmi SV UNS
        </span>
      </div>

      {/* 3. Dual-Panel Glassmorphic Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative w-full max-w-5xl bg-[#0A2540]/85 border border-[#C5A059]/40 backdrop-blur-2xl rounded-3xl sm:rounded-[36px] shadow-[0_30px_90px_rgba(0,0,0,0.65)] z-10 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        {/* LEFT COLUMN: Visual Showcase & Brand Institutional Pillar */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#07192C]/95 via-[#0A2540]/90 to-[#0d3153]/90 p-5 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
          {/* Subtle Corner Glow */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#C5A059]/15 blur-3xl rounded-full pointer-events-none" />

          <div>
            {/* Official Logo Header */}
            <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/10 border border-white/15 p-2 flex items-center justify-center shadow-inner shrink-0">
                <img
                  src={settings.login_logo_url || settings.brand_logo_color_url || settings.brand_logo_url || "/images/brand/logo-sv-uns-official-new.png"}
                  alt="Logo SV UNS"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block">
                  {settings.brand_site_title || "SEKOLAH VOKASI"}
                </span>
                <span className="text-xs font-bold text-[#C5A059] tracking-wider block">
                  {settings.brand_site_subtitle || "UNIVERSITAS SEBELAS MARET"}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2.5 sm:space-y-3">
              <span 
                style={{ borderRadius: "9999px" }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[11px] sm:text-xs font-extrabold text-[#C5A059] uppercase tracking-widest"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                Portal Riset & Inovasi 2026
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                Pusat Hilirisasi & Manajemen Inovasi
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Akses terpadu untuk pengujian live demo sandbox, tata kelola portofolio DUDI, serta pemantauan riset terapan civitas vokasi.
              </p>
            </div>

            {/* Campus Architectural Vector Visual Preview (Dark Blue Silhouette) */}
            <div className="mt-6 sm:mt-8 relative rounded-3xl overflow-hidden border border-sky-400/20 bg-[#07192C]/80 p-3 sm:p-4 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span className="flex items-center gap-1.5 text-[#C5A059]">
                  <Building2 className="w-3.5 h-3.5" />
                  Sekolah Vokasi UNS Pusat
                </span>
                <span 
                  style={{ borderRadius: "9999px" }}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-400/30 font-mono"
                >
                  Gedung 8 Lantai
                </span>
              </div>
              <div className="w-full h-28 sm:h-32 rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#07192C]">
                <img
                  src="/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp"
                  alt="Gedung Baru Sekolah Vokasi UNS"
                  className="w-full h-full object-cover object-center filter saturate-125"
                />
              </div>
            </div>
          </div>

          {/* Security & Accreditation Badges */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-Role RBAC: Super Admin, Pimpinan, & Prodi</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Proteksi Sesi Enkripsi JWT & Autentikasi Aman</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Login Form & Fully-Rounded 1-Click Demo */}
        <div className="lg:col-span-7 p-4 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {settings.login_title || "Portal Autentikasi Pengguna"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {settings.login_subtitle || "Masukkan kredensial akun resmi Anda untuk mengakses dashboard."}
                </p>
              </div>
              <div 
                style={{ borderRadius: "9999px" }}
                className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[#C5A059] shadow-inner"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ borderRadius: "9999px" }}
                className="mb-5 px-5 py-3 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center gap-2.5 font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Auto Logging In indicator */}
            {autoLoggingIn && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ borderRadius: "9999px" }}
                className="mb-5 px-4 py-2.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] text-xs font-bold flex items-center gap-2.5 shadow-sm"
              >
                <div className="w-3.5 h-3.5 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Akun tersimpan terdeteksi. Melakukan login otomatis ke dashboard...</span>
              </motion.div>
            )}

            {/* Form Fields with Fully Rounded Pill Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-200 block mb-1.5 ml-2">
                  Username atau Alamat Email
                </label>
                <div className="relative group">
                  <User className="w-4 h-4 text-slate-400 group-focus-within:text-[#C5A059] absolute left-4 top-3.5 transition-colors" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@vokasi.uns.ac.id atau username"
                    style={{ borderRadius: "9999px" }}
                    className="w-full pl-11 pr-5 py-3 text-sm rounded-full border border-slate-700/80 bg-slate-900/90 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/25 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 ml-2 mr-2">
                  <label className="text-sm font-bold text-slate-200 block">
                    Kata Sandi
                  </label>
                  <span className="text-xs text-slate-400">
                    Kredensial akun resmi
                  </span>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#C5A059] absolute left-4 top-3.5 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ borderRadius: "9999px" }}
                    className="w-full pl-11 pr-12 py-3 text-sm rounded-full border border-slate-700/80 bg-slate-900/90 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/25 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me / Simpan Akun Checkbox (Solid Gold Checkmark & Interactive Card) */}
              <div 
                onClick={() => setRememberMe(!rememberMe)}
                role="checkbox"
                aria-checked={rememberMe}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setRememberMe(!rememberMe);
                  }
                }}
                className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer select-none group ${
                  rememberMe
                    ? "bg-[#C5A059]/10 border-[#C5A059]/40 shadow-[0_4px_20px_rgba(197,160,89,0.15)]"
                    : "bg-slate-900/60 hover:bg-slate-900/90 border-slate-700/80 hover:border-slate-500"
                }`}
              >
                {/* Gold Checkbox Box with Crisp Checkmark */}
                <div 
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    rememberMe 
                      ? "bg-gradient-to-br from-[#E5C158] to-[#C5A059] border-2 border-amber-200 shadow-[0_0_12px_rgba(197,160,89,0.65)] scale-105" 
                      : "bg-slate-900 border-2 border-slate-500 group-hover:border-[#C5A059]/80"
                  }`}
                >
                  {rememberMe && (
                    <Check className="w-4 h-4 text-[#07192C] font-black stroke-[3.5]" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors">
                      Simpan akun & login otomatis
                    </span>
                    {rememberMe ? (
                      <span 
                        style={{ borderRadius: "9999px" }}
                        className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#C5A059] text-[#07192C] tracking-wider shrink-0"
                      >
                        Aktif
                      </span>
                    ) : (
                      <span 
                        style={{ borderRadius: "9999px" }}
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 tracking-wider shrink-0"
                      >
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-300 font-normal leading-relaxed mt-0.5">
                    Otomatis login ke dashboard tanpa perlu ketik ulang email & kata sandi, kecuali Anda logout manual.
                  </span>
                </div>
              </div>

              {/* Submit Button with Explicit Ultra-Rounded Pill & Success Animation */}
              <motion.button
                type="submit"
                disabled={isLoading || isSuccess}
                whileHover={!isSuccess ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isSuccess ? { scale: 0.98 } : {}}
                style={{ borderRadius: "9999px" }}
                className={`w-full py-3.5 px-6 rounded-full border text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 mt-3 shadow-lg ${
                  isSuccess
                    ? "bg-emerald-600 border-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.5)] scale-102"
                    : "bg-gradient-to-r from-[#0F4C81] via-[#1a5b96] to-[#0A2540] hover:from-[#135996] hover:to-[#0c2f52] border-sky-400/40 shadow-[0_10px_25px_rgba(15,76,129,0.4)]"
                }`}
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                    <span>Autentikasi Berhasil! Mengalihkan...</span>
                  </>
                ) : isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Institutional Security Notice (Replaces Demo Buttons) */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-start gap-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-white block">Sistem Terotentikasi & Terproteksi</span>
                <p className="text-slate-300 leading-relaxed font-normal">
                  Gunakan alamat email resmi UNS atau username yang telah terdaftar di Sekolah Vokasi. Hubungi Administrator jika membutuhkan bantuan pemulihan akses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer System Info */}
      <div className="mt-6 text-center text-xs text-slate-400 z-10 font-medium">
        Katalog Resmi Inovasi Terapan © 2026 Sekolah Vokasi Universitas Sebelas Maret. All rights reserved.
      </div>
    </div>
  );
}
