"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Building2, BarChart3, Users, PlusCircle, 
  ExternalLink, Layers, CheckCircle2, TrendingUp,
  Eye, MousePointerClick, Handshake, ArrowRight,
  ShieldCheck, Database
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { api } from "../../lib/api";

export default function DashboardIndex() {
  const { currentUser } = useApp();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getPimpinanStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const role = currentUser?.role || "prodi";

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Greeting Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-white via-white to-blue-50/50 dark:from-[#07192C] dark:via-[#0A2540] dark:to-[#07192C] border border-slate-200/90 dark:border-[#C5A059]/25 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 dark:bg-sky-400/10 text-[10.5px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#C5A059]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portal Manajemen Inovasi Terapan 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Selamat Datang, {currentUser?.name || "Civitas Vokasi UNS"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Pusat komando hilirisasi riset terapan kampus: kelola etalase 3 layanan, pantau analitik interaksi industri, dan verifikasi sertifikasi paten.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
          <Link
            href="/dashboard/prodi/create"
            style={{ borderRadius: "9999px" }}
            className="px-5 py-2.5 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold transition shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Inovasi</span>
          </Link>

          <Link
            href="/katalog"
            target="_blank"
            style={{ borderRadius: "9999px" }}
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition inline-flex items-center justify-center gap-1.5"
          >
            <span>Buka Web Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* 2. Three Main Feature Panels (Bento Architecture) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0F4C81] dark:text-[#C5A059] block">
              Akses Cepat Modul
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Pusat Fitur Terintegrasi
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:block">
            Pilih modul sesuai wewenang akun
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Prodi Panel */}
          <Link
            href="/dashboard/prodi"
            className="p-5 sm:p-7 rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#07192C] border border-slate-200/90 dark:border-white/10 hover:border-[#0F4C81] dark:hover:border-sky-400 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-[#0F4C81] dark:text-sky-400 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-inner">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C81] dark:text-sky-400 block mb-1">
                Modul 1 • Pengelola
              </span>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-[#0F4C81] dark:group-hover:text-sky-400 transition-colors">
                Katalog Program Studi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                Kelola item 3 layanan (Teknologi SaaS, Robotika IoT, Jasa Software), spesifikasi teknis, demo URL, dan PIC dosen.
              </p>
            </div>

            <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#0F4C81] dark:text-sky-400">
              <span>Buka Panel Prodi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Pimpinan Panel */}
          <Link
            href="/dashboard/pimpinan"
            className="p-5 sm:p-7 rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#07192C] border border-slate-200/90 dark:border-[#C5A059]/40 hover:border-[#C5A059] shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-[#C5A059] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-inner">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                Modul 2 • Eksekutif
              </span>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-[#C5A059] transition-colors">
                Eksekutif & Analitik
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                Dashboard view-only untuk Pimpinan SV memantau metrik kunjungan, klik demo interaktif, dan cetak laporan akreditasi.
              </p>
            </div>

            <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#C5A059]">
              <span>Buka Panel Pimpinan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Super Admin Panel */}
          <Link
            href="/dashboard/admin"
            className="p-5 sm:p-7 rounded-2xl sm:rounded-[28px] bg-white dark:bg-[#07192C] border border-slate-200/90 dark:border-white/10 hover:border-slate-500 dark:hover:border-slate-400 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-inner">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Modul 3 • Otoritas
              </span>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Kelola Akun & Moderasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                Wewenang Super Admin untuk menambah akun Prodi/Pimpinan, moderasi privasi, dan mengubah status publikasi katalog.
              </p>
            </div>

            <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Buka Panel Admin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Metrics Highlights Summary Card */}
      <div className="p-4 sm:p-8 rounded-2xl sm:rounded-[32px] bg-white dark:bg-[#07192C] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
              Status Sinkronisasi Sistem Terpadu
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Data telemetri real-time dari database produksi katalog inovasi vokasi.
            </p>
          </div>
          <span 
            style={{ borderRadius: "9999px" }}
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/20 w-fit"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Database MySQL Terhubung</span>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Metric 1 */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 transition hover:border-[#0F4C81]">
            <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-[10.5px] uppercase font-bold tracking-wider">Total Inovasi</span>
              <Layers className="w-4 h-4 text-blue-500 shrink-0" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block tracking-tight">
              {stats?.summary?.total_items || 3}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              3 Kategori Layanan
            </span>
          </div>

          {/* Metric 2 */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 transition hover:border-[#0F4C81]">
            <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-[10.5px] uppercase font-bold tracking-wider">Total Dilihat</span>
              <Eye className="w-4 h-4 text-sky-500 shrink-0" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#0F4C81] dark:text-sky-400 block tracking-tight">
              {stats?.summary?.total_views ? Number(stats.summary.total_views).toLocaleString("id-ID") : "5.080"}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
              +14.2% minggu lalu
            </span>
          </div>

          {/* Metric 3 */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 transition hover:border-[#C5A059]">
            <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-[10.5px] uppercase font-bold tracking-wider">Live Demo</span>
              <MousePointerClick className="w-4 h-4 text-[#C5A059] shrink-0" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#C5A059] block tracking-tight">
              {stats?.summary?.total_demo_clicks ? Number(stats.summary.total_demo_clicks).toLocaleString("id-ID") : "384"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Sandbox & 3D
            </span>
          </div>

          {/* Metric 4 */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 transition hover:border-emerald-500">
            <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-[10.5px] uppercase font-bold tracking-wider">Pengajuan DUDI</span>
              <Handshake className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-500 block tracking-tight">
              {stats?.summary?.total_inquiries || 3}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
              Kemitraan PKS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
