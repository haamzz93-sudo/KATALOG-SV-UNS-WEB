"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { FAQItem, DEFAULT_FAQS } from "../lib/faq";

export interface PortfolioCaseItem {
  id: string;
  title: string;
  category: string;
  partner: string;
  status: string;
  rating: number;
  reviewCount: number;
  metricValue: string;
  metricLabel: string;
  description: string;
  testimonial: string;
  reviewer: string;
  image?: string;
  slug: string;
  isActive?: boolean;
}

export interface IndustryTestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
  text: string;
  isActive?: boolean;
}

export const DEFAULT_PORTFOLIO_CASES: PortfolioCaseItem[] = [
  {
    id: "robot-patroli",
    title: "Robot Patroli Otonom SV-01 (LiDAR & Edge AI)",
    category: "Hardware & IoT Robotika",
    partner: "PT Petrokimia Gresik & Kawasan Industri Jawa Tengah",
    status: "Telah Diimplementasikan & Aktif Beroperasi",
    rating: 5.0,
    reviewCount: 18,
    metricValue: "65%",
    metricLabel: "Efisiensi Biaya Patroli Keamanan",
    description: "Digunakan untuk pengawasan otonom indoor-outdoor fasilitas gudang 24/7 dengan sensor LiDAR 360°, deteksi intrusi Edge AI tanpa awak, dan integrasi streaming terenkripsi.",
    testimonial: "Robot patroli karya Vokasi UNS sangat presisi dalam mapping gedung bertingkat dan tahan operasional cuaca ekstrem tanpa jeda.",
    reviewer: "Ir. Bambang Trihatmojo — Kepala Divisi K3 & Pengamanan Aset Industri",
    image: "/images/sequence/robot-frame-01.jpg",
    slug: "robot-patroli-otonom",
    isActive: true,
  },
  {
    id: "rintisku-saas",
    title: "Rintisku - SaaS Inkubasi Bisnis & Pitching DUDI",
    category: "Teknologi & SaaS Enterprise",
    partner: "Rumah BUMN Surakarta & Inkubator Startup DUDI",
    status: "Diadopsi di 12+ Batch Inkubasi Usaha",
    rating: 4.9,
    reviewCount: 32,
    metricValue: "1.200+",
    metricLabel: "Mahasiswa & Startup Terfasilitasi",
    description: "Platform memfasilitasi lean canvas digital, kurasi milestone keuangan portofolio usaha mahasiswa, dan automasi penjadwalan pitching mitra industri DUDI secara transparan.",
    testimonial: "Monitoring performa rintisan bisnis mahasiswa menjadi sangat rapi dan real-time berkat platform SaaS Rintisku.",
    reviewer: "Dr. Sri Hartati, M.M. — Koordinator Program Kewirausahaan BUMN",
    image: "/images/catalog/rintisku-saas-showcase.jpg",
    slug: "rintisku-saas-inkubasi-bisnis",
    isActive: true,
  },
  {
    id: "software-house-erp",
    title: "Vokasi Software House - Custom ERP & Supply Chain",
    category: "Jasa Rekayasa Software House",
    partner: "PT Tri Usaha Sejahtera & Asosiasi Logistik Soloraya",
    status: "Live Production (Garansi & Maintenance)",
    rating: 5.0,
    reviewCount: 24,
    metricValue: "3x Lebih Cepat",
    metricLabel: "Pencatatan Inventaris & 99.8% Akurasi",
    description: "Pengembangan sistem informasi pergudangan berbasis Next.js App Router dan Laravel RESTful API dengan arsitektur cloud terisolasi, sertifikasi pentest, dan dukungan agile sprint.",
    testimonial: "Proses pengerjaan sprint agile sangat profesional, didampingi dosen ahli dan garansi bug-fixing yang sangat memuaskan.",
    reviewer: "Hendrawan Prasetyo, S.T. — Direktur Operasional & IT",
    image: "/images/catalog/software-house-showcase.jpg",
    slug: "vokasi-software-house-web-mobile",
    isActive: true,
  },
  {
    id: "telemetri-k3",
    title: "Smart Telemetry & Monitoring Sensorik K3 Industri",
    category: "Produk Fisik & Instrumentasi K3",
    partner: "PT Industri Kereta Api (Persero) / INKA & RS UNS",
    status: "Sertifikasi Terpasang & Uji Fungsi Lapangan",
    rating: 5.0,
    reviewCount: 15,
    metricValue: "Zero-Incident",
    metricLabel: "Audit Keselamatan Kerja ISO 45001",
    description: "Instrumen sensor pemantau suhu, kebisingan, dan emisi gas berbahaya area pabrik dengan notifikasi darurat instan ke WhatsApp PIC dan dashboard analytics terpusat.",
    testimonial: "Sistem telemetri sensorik K3 dari Sekolah Vokasi UNS sangat andal dan memenuhi standar audit ISO 45001 manufaktur.",
    reviewer: "Agus Sulistyo, M.Sc. — Lead HSE Officer Manufaktur",
    image: "/images/sequence/robot-frame-03.jpg",
    slug: "robot-patroli-otonom",
    isActive: true,
  },
];

export const DEFAULT_INDUSTRY_TESTIMONIALS: IndustryTestimonialItem[] = [
  {
    id: "petrokimia-bambang",
    name: "Ir. Bambang Trihatmojo",
    role: "Kepala Divisi K3 & Pengamanan Aset",
    company: "PT Petrokimia Gresik",
    avatar: "/images/brand/logo-sv-uns-official-color.png",
    rating: 5,
    text: "Kolaborasi riset terapan dengan Sekolah Vokasi UNS melahirkan solusi robotik yang langsung menjawab kebutuhan pengawasan gudang kami. Sangat membanggakan dan siap komersialisasi skala besar.",
    isActive: true,
  },
  {
    id: "rumah-bumn-hartati",
    name: "Dr. Sri Hartati, M.M.",
    role: "Koordinator Program Kewirausahaan",
    company: "Rumah BUMN Surakarta",
    avatar: "/images/brand/logo-sv-uns-official-color.png",
    rating: 5,
    text: "Platform SaaS Rintisku karya mahasiswa dan dosen vokasi telah mendampingi ratusan talenta muda mengkurasi model bisnis mereka. Sistemnya intuitif, cepat, dan berstandar industri modern.",
    isActive: true,
  },
  {
    id: "tri-usaha-hendrawan",
    name: "Hendrawan Prasetyo, S.T.",
    role: "Direktur Operasional & Sistem Informasi",
    company: "PT Tri Usaha Sejahtera",
    avatar: "/images/brand/logo-sv-uns-official-color.png",
    rating: 5,
    text: "Jasa software house Vokasi UNS menyelesaikan aplikasi ERP kami tepat waktu dengan arsitektur cloud yang sangat stabil. Dokumentasi API lengkap dan dukungan purnajualnya luar biasa.",
    isActive: true,
  },
];


export interface SiteSettings {
  brand_logo_url: string;
  brand_logo_color_url: string;
  brand_site_title: string;
  brand_site_subtitle: string;
  brand_tagline: string;
  hero_badge: string;
  hero_title_p1: string;
  hero_title_p2: string;
  hero_subtitle: string;
  login_title: string;
  login_subtitle: string;
  login_logo_url: string;
  login_bg_silhouette_url: string;
  footer_address: string;
  footer_email: string;
  footer_phone: string;
  footer_copyright: string;
  footer_description: string;
  industry_partners?: Array<{ name: string; src: string; alt: string; link?: string }>;
  partners_network_title_id?: string;
  partners_network_title_en?: string;
  partners_network_desc_id?: string;
  partners_network_desc_en?: string;

  // Hero CTA & Stats
  hero_cta_catalog_text?: string;
  hero_cta_demo_text?: string;
  hero_stat_1_val?: string;
  hero_stat_1_lbl?: string;
  hero_stat_2_val?: string;
  hero_stat_2_lbl?: string;

  // 3 Lini Layanan (Categories / Services)
  services_tagline?: string;
  services_title?: string;
  services_subtitle?: string;
  service_1_badge?: string;
  service_1_title?: string;
  service_1_desc?: string;
  service_1_btn?: string;
  service_1_link?: string;
  service_2_badge?: string;
  service_2_title?: string;
  service_2_desc?: string;
  service_2_btn?: string;
  service_2_link?: string;
  service_3_badge?: string;
  service_3_title?: string;
  service_3_desc?: string;
  service_3_btn?: string;
  service_3_link?: string;

  // Hardware Lab Comparison Slider
  hardware_section_tagline?: string;
  hardware_section_title?: string;
  hardware_section_desc?: string;
  hardware_left_label?: string;
  hardware_right_label?: string;
  hardware_left_image?: string;
  hardware_right_image?: string;

  // Software House Enterprise Platform
  softhouse_section_tagline?: string;
  softhouse_section_title?: string;
  softhouse_section_desc?: string;

  // Kemitraan DUDI Section
  dudi_section_tagline?: string;
  dudi_section_title?: string;
  dudi_section_desc?: string;
  dudi_benefit_1?: string;
  dudi_benefit_2?: string;
  dudi_benefit_3?: string;
  dudi_whatsapp_number?: string;
  dudi_whatsapp_text?: string;
  dudi_pdf_url?: string;
  site_faqs?: FAQItem[];

  // Portofolio Inovasi yang Telah Digunakan Mitra
  portfolio_section_tagline?: string;
  portfolio_section_title?: string;
  portfolio_section_desc?: string;
  portfolio_cases?: PortfolioCaseItem[];

  // Testimoni Kolaborasi & Sinergi Mitra
  testimonials_section_tagline?: string;
  testimonials_section_title?: string;
  testimonials_section_desc?: string;
  industry_testimonials?: IndustryTestimonialItem[];

  // Background & Gedung Kampus SV
  bg_building_left_url?: string;

  bg_building_right_url?: string;
  bg_campus_landscape_url?: string;
  bg_hero_url?: string;
  hero_bg_opacity?: number;

  // Footer & Kontak Resmi
  footer_address_surakarta?: string;
  footer_fax?: string;
  footer_whatsapp?: string;
  footer_map_url?: string;
  footer_map_embed_url?: string;
  system_services_list?: { id?: string; name: string; url: string; desc?: string; isActive?: boolean }[];
  portal_info_list?: { id?: string; name: string; url: string; desc?: string; isActive?: boolean }[];

  // Header & Sidebar Navigation CRUD
  header_nav_links?: Array<{ id: string; labelId: string; labelEn: string; href: string; isActive?: boolean }>;
  header_cta_text?: string;
  header_cta_text_en?: string;
  header_cta_link?: string;
  header_menu_prodi_label?: string;
  header_menu_prodi_label_en?: string;
  header_menu_catalog_label?: string;
  header_menu_catalog_label_en?: string;
  header_menu_contact_label?: string;
  header_menu_contact_label_en?: string;
  sidebar_portal_title?: string;
  sidebar_portal_subtitle?: string;
  sidebar_custom_links?: Array<{ id: string; label: string; href: string; isActive?: boolean }>;

  // Catalog Category Tabs Rename
  catalog_tab_all_id?: string;
  catalog_tab_all_en?: string;
  catalog_tab_teknologi_id?: string;
  catalog_tab_teknologi_en?: string;
  catalog_tab_produk_id?: string;
  catalog_tab_produk_en?: string;
  catalog_tab_jasa_id?: string;
  catalog_tab_jasa_en?: string;

  [key: string]: any;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brand_logo_url: "/images/brand/logo-sv-putih-official.png",
  brand_logo_color_url: "/images/brand/logo-sv-biru-official.png",
  brand_site_title: "SEKOLAH VOKASI",
  brand_site_subtitle: "UNIVERSITAS SEBELAS MARET",
  brand_tagline: "Pusat Hilirisasi Riset Terapan & Inovasi Unggulan Sekolah Vokasi UNS",
  hero_badge: "Katalog Resmi Inovasi Terapan 2026",
  hero_title_p1: "Bisnis & Inovasi Terapan",
  hero_title_p2: "Sekolah Vokasi UNS",
  hero_subtitle:
    "Hilirisasi riset aplikatif, produk perangkat lunak SaaS, instrumen robotika IoT, dan jasa software house siap kemitraan Dunia Usaha & Dunia Industri (DUDI).",
  hero_cta_catalog_text: "Jelajahi Katalog",
  hero_cta_demo_text: "Coba Live Demo",
  hero_stat_1_val: "3 Lini",
  hero_stat_1_lbl: "Layanan Terpadu",
  hero_stat_2_val: "100%",
  hero_stat_2_lbl: "Karya Orisinil Laboratorium SV",

  // 3 Lini Layanan
  services_tagline: "Taksonomi Layanan Vokasi",
  services_title: "Taksonomi 3 Lini Layanan.",
  services_subtitle: "Dirancang oleh dosen pakar dan talenta mahasiswa vokasi berbasis standar industri",
  service_1_badge: "Layanan 1",
  service_1_title: "1. Teknologi & SaaS",
  service_1_desc: "Platform web, modul AI, dan perangkat lunak siap pakai dengan pengujian sandbox langsung di browser.",
  service_1_btn: "Buka Demo Sandbox",
  service_1_link: "/katalog?kategori=teknologi",
  service_2_badge: "Layanan 2 (Unggulan)",
  service_2_title: "2. Produk Fisik & IoT",
  service_2_desc: "Alat mekatronika presisi, robot patroli otonom, dan perangkat embedded cerdas berstandar manufaktur.",
  service_2_btn: "Putar Objek 3D",
  service_2_link: "/katalog?kategori=produk",
  service_3_badge: "Layanan 3",
  service_3_title: "3. Jasa Software House",
  service_3_desc: "Layanan konsultasi, rancang bangun sistem kustom, sprint agile, dan garansi pemeliharaan sistem teruji.",
  service_3_btn: "Konsultasi Proyek",
  service_3_link: "/katalog?kategori=jasa",

  // Hardware Lab Slider
  hardware_section_tagline: "Laboratorium Hardware Engineering",
  hardware_section_title: "Dari Cetak Biru CAD ke Prototipe Otonom Fisik",
  hardware_section_desc: "Geser pemisah ke kiri dan kanan untuk membandingkan rancangan mekanikal 3D dengan unit fisik hasil perakitan mahasiswa SV UNS.",
  hardware_left_label: "← Rancangan Awal 3D CAD",
  hardware_right_label: "Prototipe Fisik Otonom Siap Uji →",
  hardware_left_image: "/images/sequence/robot-frame-01.jpg",
  hardware_right_image: "/images/sequence/robot-frame-03.jpg",

  // Software House Ecosystem Banner
  softhouse_section_tagline: "VOCATIONAL SOFTWARE HOUSE ECOSYSTEM",
  softhouse_section_title: "Platform Digital Berstandar Enterprise",
  softhouse_section_desc: "Aplikasi web & mobile dirancang dengan Next.js App Router, Laravel RESTful API, dan arsitektur cloud teruji.",

  // Kemitraan DUDI
  dudi_section_tagline: "Kemitraan DUDI & Sinergi Industri",
  dudi_section_title: "Mengapa Bermitra dengan Sekolah Vokasi UNS?",
  dudi_section_desc: "Kolaborasi riset terapan berbiaya terukur, didukung lisensi institusional resmi, dan pendampingan berkelanjutan dari akademisi berpengalaman.",
  dudi_benefit_1: "PKS & MoA Resmi UNS",
  dudi_benefit_2: "Sertifikasi Hak Cipta / Paten",
  dudi_benefit_3: "Insentif Super Tax Deduction",
  dudi_whatsapp_number: "6285191911130",
  dudi_whatsapp_text: "Hubungi PIC Kemitraan SV",
  dudi_pdf_url: "/katalog",

  login_title: "Portal Autentikasi Pengguna",
  login_subtitle: "Masuk sebagai Super Admin, Pimpinan SV, atau Administrator Prodi.",
  login_logo_url: "/images/brand/logo-sv-biru-official.png",
  login_bg_silhouette_url: "/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp",
  footer_address: "Kampus Tirtomoyo: Jalan Kolonel Sutarto 150 K, Jebres, Surakarta 57126 – Indonesia",
  footer_address_surakarta: "Kampus Tirtomoyo, Universitas Sebelas Maret\nJalan Kolonel Sutarto 150 K, Jebres, Surakarta – Indonesia",
  footer_email: "vokasi@unit.uns.ac.id",
  footer_phone: "0271-664126",
  footer_fax: "0271-664126",
  footer_whatsapp: "(+62) 851 9191 1130",
  footer_map_url: "https://maps.google.com/?q=Sekolah+Vokasi+UNS+Kampus+Tirtomoyo",
  footer_map_embed_url: "https://maps.google.com/maps?q=Sekolah+Vokasi+UNS+Kampus+Tirtomoyo+Jalan+Kolonel+Sutarto+150+K+Jebres+Surakarta&t=&z=16&ie=UTF8&iwloc=&output=embed",
  footer_copyright: "© 2026 Sekolah Vokasi Universitas Sebelas Maret (UNS). Seluruh Hak Cipta Dilindungi.",
  footer_description:
    "Platform etalase resmi karya inovasi, riset terapan, produk teknologi siap komersialisasi, dan layanan jasa industri civitas akademika Sekolah Vokasi Universitas Sebelas Maret (UNS).",
  bg_building_left_url: "/images/backgrounds/gedung-vokasi-pusat-left.png",
  bg_building_right_url: "/images/backgrounds/gedung-vokasi-pusat-right.png",
  bg_campus_landscape_url: "/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp",
  bg_hero_url: "/videos/WEB-RONAL.mp4",
  hero_bg_opacity: 80,
  system_services_list: [
    { id: "1", name: "Satu Data", url: "https://satudata.uns.ac.id", desc: "Integrasi Data Terpadu UNS", isActive: true },
    { id: "2", name: "e-Service", url: "https://eservice.vokasi.uns.ac.id", desc: "Layanan Surat & Tiket Administrasi", isActive: true },
    { id: "3", name: "Siakad", url: "https://siakad.uns.ac.id", desc: "Sistem Informasi Akademik Terpadu", isActive: true },
    { id: "4", name: "SPMB", url: "https://spmb.uns.ac.id", desc: "Seleksi Penerimaan Mahasiswa Baru", isActive: true },
    { id: "5", name: "Kantor Hukum", url: "https://kantorhukum.uns.ac.id", desc: "Layanan Tata Hukum & Regulasi", isActive: true },
    { id: "6", name: "CDC", url: "https://cdc.uns.ac.id", desc: "Pusat Pengembangan Karir & Alumni", isActive: true },
  ],
  portal_info_list: [
    { id: "1", name: "Akademik", url: "https://vokasi.uns.ac.id/akademik/", desc: "Informasi Kurikulum & Perkuliahan", isActive: true },
    { id: "2", name: "Kerja Sama", url: "https://vokasi.uns.ac.id/kerjasama/", desc: "Kemitraan DUDI & Jejaring Global", isActive: true },
    { id: "3", name: "Program Studi", url: "https://vokasi.uns.ac.id/program-studi/", desc: "Daftar Lengkap Prodi SV", isActive: true },
    { id: "4", name: "Visi Misi dan Tujuan", url: "https://vokasi.uns.ac.id/visi-misi-tujuan/", desc: "Arah & Sasaran Strategis Institusi", isActive: true },
    { id: "5", name: "PPID", url: "https://ppid.uns.ac.id", desc: "Pejabat Pengelola Informasi & Dokumentasi", isActive: true },
    { id: "6", name: "Berita", url: "https://vokasi.uns.ac.id/kategori/berita/", desc: "Warta Prestasi & Kabar Terkini", isActive: true },
    { id: "7", name: "Zona Integritas", url: "https://vokasi.uns.ac.id/zona-integritas/", desc: "Wilayah Bebas Korupsi (WBK/WBBM)", isActive: true },
  ],
  industry_partners: [
    { name: "Slot 1: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Slot 1 UNS" },
    { name: "Slot 2: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Slot 2 UNS" },
    { name: "Slot 3: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Slot 3 UNS" },
    { name: "Slot 4: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Slot 4 UNS" },
    { name: "Slot 5: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Slot 5 UNS" },
    { name: "Slot 6: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-new.png", alt: "Slot 6 UNS" },
  ],
  partners_network_title_id: "Jaringan Mitra Industri Terpercaya",
  partners_network_title_en: "Trusted Industry Partners Network",
  partners_network_desc_id: "Sinergi erat dengan BUMN, korporasi terkemuka, dan pemerintah kota mewujudkan ekosistem hilirisasi riset terapan.",
  partners_network_desc_en: "Close synergy with state-owned enterprises (BUMN), leading corporations, and city governments drives applied research commercialization.",
  site_faqs: DEFAULT_FAQS,

  // Default Header Navigation Links (Full CRUD Live Sync)
  header_nav_links: [
    { id: "beranda", labelId: "Beranda", labelEn: "Home", href: "/#beranda", isActive: true },
    { id: "layanan", labelId: "3 Layanan", labelEn: "Services", href: "/#layanan", isActive: true },
    { id: "katalog", labelId: "Katalog", labelEn: "Catalog", href: "/#katalog", isActive: true },
    { id: "portofolio", labelId: "Portofolio", labelEn: "Portfolio", href: "/#portofolio", isActive: true },
    { id: "testimoni", labelId: "Mitra", labelEn: "Partners", href: "/#testimoni", isActive: true },
    { id: "faq", labelId: "FAQ", labelEn: "FAQ", href: "/#faq", isActive: true },
  ],
  header_cta_text: "Dashboard",
  header_cta_text_en: "Dashboard",
  header_cta_link: "/dashboard",
  header_menu_prodi_label: "Direktori 39 Program Studi",
  header_menu_prodi_label_en: "39 Study Programs Directory",
  header_menu_catalog_label: "Katalog Produk Lengkap",
  header_menu_catalog_label_en: "Complete Product Catalog",
  header_menu_contact_label: "Hubungi PIC Kemitraan",
  header_menu_contact_label_en: "Contact Partnership Lead",

  // Default Sidebar Configuration
  sidebar_portal_title: "PORTAL VOKASI UNS",
  sidebar_portal_subtitle: "UNIVERSITAS SEBELAS MARET",
  sidebar_custom_links: [],

  // Default Portofolio Inovasi yang Telah Digunakan Mitra
  portfolio_section_tagline: "Impactful Applied Implementations",
  portfolio_section_title: "Portofolio Inovasi yang Telah Digunakan Mitra",
  portfolio_section_desc: "Bukti nyata karya riset terapan dan produk teknologi Sekolah Vokasi UNS yang telah resmi diadopsi, diintegrasikan, dan beroperasi di BUMN, korporasi swasta, dan instansi pemerintah.",
  portfolio_cases: DEFAULT_PORTFOLIO_CASES,

  // Default Testimoni Kolaborasi & Sinergi Mitra
  testimonials_section_tagline: "Industry Trust & DUDI Synergy",
  testimonials_section_title: "Testimoni Kolaborasi & Sinergi",
  testimonials_section_desc: "Pengalaman nyata mitra industri bekerja sama dengan Sekolah Vokasi UNS dalam hilirisasi teknologi.",
  industry_testimonials: DEFAULT_INDUSTRY_TESTIMONIALS,

  // Default Tab Filter Kategori Katalog
  catalog_tab_all_id: "Semua",
  catalog_tab_all_en: "All",
  catalog_tab_teknologi_id: "Teknologi (SaaS)",
  catalog_tab_teknologi_en: "Technology (SaaS)",
  catalog_tab_produk_id: "Produk (IoT/Robot)",
  catalog_tab_produk_en: "Hardware (IoT)",
  catalog_tab_jasa_id: "Jasa Software",
  catalog_tab_jasa_en: "Software House",
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    // 1. Quick initial hydration from local cache
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("VOKASI_SITE_SETTINGS");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            setSettings((prev) => ({ ...DEFAULT_SITE_SETTINGS, ...prev, ...parsed }));
          }
        }
      } catch (e) {
        console.error("Local cache error:", e);
      }
    }

    // 2. Authoritative fresh fetch from MySQL API
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
      const res = await fetch(`${API_BASE}/public/settings?t=${Date.now()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        const rawData = json.data || {};
        const unwrapped = rawData.settings && typeof rawData.settings === "object"
          ? { ...rawData.settings, ...rawData }
          : rawData;

        if (Object.keys(unwrapped).length > 0) {
          setSettings((prev) => {
            const merged = { ...DEFAULT_SITE_SETTINGS, ...prev, ...unwrapped };
            if (typeof window !== "undefined") {
              localStorage.setItem("VOKASI_SITE_SETTINGS", JSON.stringify(merged));
            }
            return merged;
          });
        }
      }
    } catch (e) {
      console.warn("Backend settings sync failed, using cached settings:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    const handleUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === "object") {
        setSettings((prev) => ({ ...prev, ...customEvent.detail }));
      } else {
        loadSettings();
      }
    };

    window.addEventListener("site_settings_updated", handleUpdated);
    return () => window.removeEventListener("site_settings_updated", handleUpdated);
  }, [loadSettings]);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    // First, persist to backend MySQL API
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
      const token = typeof window !== "undefined" ? localStorage.getItem("vokasi_auth_token") : null;

      const res = await fetch(`${API_BASE}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newSettings),
      });

      if (res.ok) {
        // Query fresh state to guarantee synchronization
        const fetchRes = await fetch(`${API_BASE}/public/settings?t=${Date.now()}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        let serverSettings: Partial<SiteSettings> = {};
        if (fetchRes.ok) {
          const json = await fetchRes.json();
          const rawData = json.data || {};
          serverSettings = rawData.settings && typeof rawData.settings === "object"
            ? { ...rawData.settings, ...rawData }
            : rawData;
        }

        const merged = { ...settings, ...newSettings, ...serverSettings };
        setSettings(merged);
        if (typeof window !== "undefined") {
          localStorage.setItem("VOKASI_SITE_SETTINGS", JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent("site_settings_updated", { detail: merged }));
        }
        return true;
      }
    } catch (e) {
      console.warn("Backend settings save failed, falling back to local state:", e);
    }

    // Fallback if backend temporarily unreachable
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("VOKASI_SITE_SETTINGS", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("site_settings_updated", { detail: updated }));
    }
    return true;
  };

  const resetSettings = async (): Promise<void> => {
    setSettings(DEFAULT_SITE_SETTINGS);
    if (typeof window !== "undefined") {
      localStorage.removeItem("VOKASI_SITE_SETTINGS");
      window.dispatchEvent(new CustomEvent("site_settings_updated", { detail: DEFAULT_SITE_SETTINGS }));
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      settings: DEFAULT_SITE_SETTINGS,
      updateSettings: async () => false,
      resetSettings: async () => {},
      isLoading: false,
    };
  }
  return context;
};
