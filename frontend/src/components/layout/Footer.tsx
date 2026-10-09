"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Mail, Phone, MapPin, Award, ExternalLink, ArrowRight, 
  GraduationCap, Server, Compass, Building2, ChevronDown, ChevronUp,
  PhoneCall, MessageSquare, Printer, CheckCircle2
} from "lucide-react";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { useApp } from "../../context/AppContext";
import { getLocalizedSetting } from "../../lib/i18n";

// Definisi Resmi Program Studi Sekolah Vokasi Universitas Sebelas Maret (UNS Pusat)
export const OFFICIAL_ACADEMIC_PROGRAMS = {
  magister: [
    { name: "S2 Terapan Keselamatan dan Kesehatan Kerja (K3)", code: "S2-K3" }
  ],
  sarjanaTerapan: [
    { name: "Bisnis Kreatif", code: "D4-BK" },
    { name: "Keselamatan dan Kesehatan Kerja", code: "D4-K3" },
    { name: "Manajemen Logistik", code: "D4-ML" },
    { name: "Pengelolaan Konvensi dan Acara (MICE)", code: "D4-MICE" },
    { name: "Kebidanan", code: "D4-KEB" },
    { name: "Usaha Perjalanan Wisata", code: "D4-UPW" },
    { name: "Produksi Ternak", code: "D4-PT" },
    { name: "Rekayasa Perangkat Lunak", code: "D4-RPL" },
    { name: "Sains Data", code: "D4-SD" },
    { name: "Sumber Daya Air", code: "D4-SDA" },
    { name: "Tata Boga", code: "D4-TB" },
    { name: "Teknologi Komputer", code: "D4-TK" },
    { name: "Teknologi Pangan", code: "D4-TP" },
    { name: "Teknologi Rekayasa Kendaraan Listrik", code: "D4-TRKL" },
    { name: "Teknologi Rekayasa Otomasi", code: "D4-TRO" },
    { name: "Teknologi Terapan Informasi dan Komunikasi Terapan (TIKA)", code: "D4-TIKA" },
    { name: "Teknologi Rekayasa Pangan (TRP)", code: "D4-TRP" },
  ],
  diplomaTiga: [
    { name: "Akuntansi", code: "D3-AKT" },
    { name: "Bahasa Inggris", code: "D3-BING" },
    { name: "Bahasa Mandarin", code: "D3-BMAND" },
    { name: "Budidaya Ternak", code: "D3-BDT" },
    { name: "Desain Komunikasi Visual", code: "D3-DKV" },
    { name: "Farmasi", code: "D3-FAR" },
    { name: "Kebidanan", code: "D3-KEB" },
    { name: "Keuangan Perbankan", code: "D3-KP" },
    { name: "Manajemen Bisnis", code: "D3-MB" },
    { name: "Manajemen Pemasaran", code: "D3-MPEM" },
    { name: "Manajemen Perdagangan", code: "D3-MPER" },
    { name: "Manajemen Administrasi", code: "D3-MA" },
    { name: "Perpajakan", code: "D3-PJK" },
    { name: "Teknik Mesin", code: "D3-TM" },
    { name: "Teknik Sipil", code: "D3-TS" },
    { name: "Teknik Informatika", code: "D3-TIF" },
    { name: "Teknologi Hasil Pertanian", code: "D3-THP" },
    { name: "Komunikasi Terapan", code: "D3-KT" },
  ]
};

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();
  const { currentLang } = useApp();
  const [showAllProdi, setShowAllProdi] = useState(false);

  const brandTitle = getLocalizedSetting("brand_site_title", settings, currentLang, "SEKOLAH VOKASI", "VOCATIONAL SCHOOL");
  const brandSubtitle = getLocalizedSetting("brand_site_subtitle", settings, currentLang, "UNIVERSITAS SEBELAS MARET", "UNIVERSITAS SEBELAS MARET");
  const footerDesc = getLocalizedSetting(
    "footer_description", 
    settings, 
    currentLang, 
    "Platform etalase resmi karya inovasi, riset terapan, produk teknologi siap komersialisasi, dan layanan jasa industri civitas akademika Sekolah Vokasi Universitas Sebelas Maret (UNS).",
    "Official showcase platform for applied innovations, research commercialization, turnkey technology products, and industrial software engineering services by the academic community of UNS Vocational School."
  );
  const footerCopyright = getLocalizedSetting(
    "footer_copyright", 
    settings, 
    currentLang, 
    "© 2026 Sekolah Vokasi Universitas Sebelas Maret (UNS). Seluruh Hak Cipta Dilindungi.",
    "© 2026 Vocational School, Universitas Sebelas Maret (UNS). All Rights Reserved."
  );

  // Dynamic CRUD lists from settings (filtered to show only active items)
  const rawSystemServices = settings.system_services_list || [
    { id: "1", name: "Satu Data", url: "https://satudata.uns.ac.id", desc: "Integrasi Data Terpadu UNS", isActive: true },
    { id: "2", name: "e-Service", url: "https://eservice.vokasi.uns.ac.id", desc: "Layanan Surat & Tiket Digital", isActive: true },
    { id: "3", name: "Siakad", url: "https://siakad.uns.ac.id", desc: "Sistem Informasi Akademik", isActive: true },
    { id: "4", name: "SPMB", url: "https://spmb.uns.ac.id", desc: "Penerimaan Mahasiswa Baru", isActive: true },
    { id: "5", name: "Kantor Hukum", url: "https://kantorhukum.uns.ac.id", desc: "Layanan Regulasi & Legalitas", isActive: true },
    { id: "6", name: "CDC", url: "https://cdc.uns.ac.id", desc: "Career Development Center", isActive: true },
  ];

  const rawPortalInfo = settings.portal_info_list || [
    { id: "1", name: "Akademik", url: "https://vokasi.uns.ac.id/akademik/", desc: "Kurikulum & Kalender", isActive: true },
    { id: "2", name: "Kerja Sama", url: "https://vokasi.uns.ac.id/kerjasama/", desc: "Kemitraan Industri & MoA", isActive: true },
    { id: "3", name: "Program Studi", url: "https://vokasi.uns.ac.id/program-studi/", desc: "Daftar Prodi D3, D4 & S2", isActive: true },
    { id: "4", name: "Visi Misi dan Tujuan", url: "https://vokasi.uns.ac.id/visi-misi-tujuan/", desc: "Landasan Institusi Vokasi", isActive: true },
    { id: "5", name: "PPID", url: "https://ppid.uns.ac.id", desc: "Keterbukaan Informasi Publik", isActive: true },
    { id: "6", name: "Berita", url: "https://vokasi.uns.ac.id/kategori/berita/", desc: "Warta & Agenda Terkini", isActive: true },
    { id: "7", name: "Zona Integritas", url: "https://vokasi.uns.ac.id/zona-integritas/", desc: "Reformasi Birokrasi WBK/WBBM", isActive: true },
  ];

  const systemServices = rawSystemServices.filter((s: any) => s.isActive !== false);
  const portalInfo = rawPortalInfo.filter((p: any) => p.isActive !== false);

  const phoneNum = settings.footer_phone || "0271-664126";
  const faxNum = settings.footer_fax || "0271-664126";
  const waNum = settings.footer_whatsapp || "(+62) 851 9191 1130";
  const emailAddr = settings.footer_email || "vokasi@unit.uns.ac.id";
  const mapUrl = settings.footer_map_url || "https://maps.google.com/?q=Sekolah+Vokasi+UNS+Kampus+Tirtomoyo";

  return (
    <footer className="bg-gradient-to-b from-blue-50/90 via-white/95 to-blue-100/90 dark:from-[#05101D]/90 dark:via-[#07192C]/90 dark:to-[#030d18]/95 backdrop-blur-3xl text-slate-700 dark:text-slate-300 border-t border-blue-200/60 dark:border-white/10 text-left relative overflow-hidden shadow-[0_-20px_50px_rgba(0,0,128,0.06)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      {/* Specular Liquid Top Border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#000080]/30 dark:via-blue-400/40 to-transparent pointer-events-none" />

      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-blue-200/30 dark:bg-[#0F4C81]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-amber-200/20 dark:bg-[#C5A059]/10 blur-[100px] pointer-events-none" />

      {/* Main Top Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Slogan (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 no-underline group">
              <div className="h-12 w-auto px-2 py-1 rounded-2xl bg-white/95 dark:bg-white/90 border border-[#C5A059]/60 shadow-[0_4px_20px_rgba(197,160,89,0.25)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={settings.brand_logo_color_url || "/images/brand/logo-sv-biru-official.png"}
                  alt="Logo Resmi SV UNS"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-black text-sm tracking-wide text-[#000080] dark:text-white block leading-tight">
                  {brandTitle}
                </span>
                <span className="text-[11px] font-black text-[#C5A059] tracking-wider block">
                  {brandSubtitle}
                </span>
              </div>
            </Link>

            {/* Diktisaintek Berdampak Partner Lockup */}
            <div className="flex items-center gap-3 py-2 px-3 rounded-2xl bg-blue-100/60 dark:bg-white/5 border border-blue-200/70 dark:border-white/10 max-w-sm">
              <img
                src="/images/brand/diktisaintek-horizontal.png"
                alt="Diktisaintek Berdampak"
                className="h-6 w-auto object-contain opacity-90"
              />
              <div className="h-4 w-px bg-slate-300 dark:bg-white/20" />
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                Diktisaintek Berdampak
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
              {footerDesc}
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 dark:bg-white/5 border border-[#C5A059]/40 text-xs shadow-inner">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[11px] text-slate-700 dark:text-slate-200 font-bold">
                {currentLang === "en" ? "Accredited Excellence & Industry-Tested" : "Akreditasi Unggul & Kemitraan DUDI Teruji"}
              </span>
            </div>
          </div>

          {/* Col 2: Layanan Sistem (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-blue-100 dark:border-slate-800">
              <Server className="w-4 h-4 text-[#000080] dark:text-[#38BDF8]" />
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#000080] dark:text-white">
                {currentLang === "en" ? "System Services" : "Layanan Sistem"}
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs">
              {systemServices.map((srv: any, idx: number) => (
                <li key={`srv-${srv.id || idx}`}>
                  <a
                    href={srv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between text-slate-600 hover:text-[#000080] dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <span className="group-hover:text-[#000080] dark:group-hover:text-sky-300 transition-colors font-medium">{srv.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#000080] dark:group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portal Informasi (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-blue-100 dark:border-slate-800">
              <Compass className="w-4 h-4 text-[#C5A059]" />
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#000080] dark:text-white">
                {currentLang === "en" ? "Information Portal" : "Portal Informasi"}
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs">
              {portalInfo.map((p: any, idx: number) => (
                <li key={`portal-${p.id || idx}`}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between text-slate-600 hover:text-[#000080] dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <span className="group-hover:text-[#000080] dark:group-hover:text-amber-300 transition-colors font-medium">{p.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#000080] dark:group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Sekretariat & Kontak Kampus (3.5 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-blue-100 dark:border-slate-800">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#000080] dark:text-white">
                {currentLang === "en" ? "Campus & Secretariat" : "Sekretariat & Kampus"}
              </h4>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              {/* Kampus Tirtomoyo (Surakarta) - UNS Vokasi Pusat */}
              <div className="p-3.5 rounded-2xl bg-blue-100/40 dark:bg-white/[0.04] border border-blue-200/60 dark:border-white/10 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#000080] dark:text-white text-xs">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Kampus Tirtomoyo (Surakarta) — Kantor Pusat</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-5.5 leading-relaxed font-medium">
                  {settings.footer_address_surakarta || "Jalan Kolonel Sutarto 150 K, Jebres, Surakarta – Indonesia"}
                </p>
              </div>

              {/* Kontak Phone, Fax, WA, Email */}
              <ul className="space-y-2 pt-1 text-[11px]">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>Telepon: <strong className="text-slate-900 dark:text-white">{phoneNum}</strong></span>
                  <span className="text-slate-400">|</span>
                  <Printer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Faksimile: <strong className="text-slate-900 dark:text-white">{faxNum}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>WA Resmi: <a href={`https://wa.me/${waNum.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold">{waNum}</a></span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>Surel: <a href={`mailto:${emailAddr}`} className="text-sky-600 dark:text-sky-300 hover:underline font-bold">{emailAddr}</a></span>
                </li>
              </ul>

              {/* Peta Lokasi Google Maps Interaktif Kampus Tirtomoyo */}
              <div className="pt-2 space-y-2.5">
                <div className="relative w-full h-40 sm:h-44 rounded-2xl overflow-hidden border border-blue-200/60 dark:border-white/15 bg-slate-950 shadow-inner group">
                  <iframe
                    title="Peta Lokasi Kampus Sekolah Vokasi UNS Surakarta"
                    src={settings.footer_map_embed_url || "https://maps.google.com/maps?q=Sekolah+Vokasi+UNS+Kampus+Tirtomoyo+Jalan+Kolonel+Sutarto+150+K+Jebres+Surakarta&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full filter contrast-105 opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-[10px] font-extrabold text-white flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Kampus Tirtomoyo Surakarta</span>
                  </div>
                </div>

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-blue-100/60 dark:bg-white/5 hover:bg-blue-200/60 dark:hover:bg-white/10 border border-[#C5A059]/40 text-xs text-[#000080] dark:text-[#C5A059] hover:text-[#000080] dark:hover:text-white font-bold transition-all shadow-xs group"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
                  <span>Buka Petunjuk Arah di Google Maps</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-blue-200/60 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl py-4 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-3">
          <p>{footerCopyright}</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-[#000080] dark:hover:text-[#C5A059] transition font-medium">
              {currentLang === "en" ? "Internal CMS Portal" : "Portal Internal CMS"}
            </Link>
            <span>•</span>
            <a
              href="https://vokasi.uns.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#000080] dark:hover:text-[#C5A059] transition inline-flex items-center gap-1 font-medium"
            >
              <span>vokasi.uns.ac.id</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
