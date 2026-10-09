/**
 * Multi-Language (i18n) Engine & Auto-Translation System
 * Sekolah Vokasi Universitas Sebelas Maret (UNS)
 * 
 * Supports seamless bilingual switching (ID <-> EN) and dynamic auto-adaptation
 * when settings or text are edited in the Admin CMS.
 */

import { SiteSettings } from "../context/SiteSettingsContext";

// Vocational & Institutional Academic Phrase Dictionary
const PHRASE_DICTIONARY: Record<string, string> = {
  // Brand & Institutional
  "SEKOLAH VOKASI": "VOCATIONAL SCHOOL",
  "Sekolah Vokasi": "Vocational School",
  "SEKOLAH VOKASI UNIVERSITAS SEBELAS MARET": "VOCATIONAL SCHOOL UNIVERSITAS SEBELAS MARET",
  "Sekolah Vokasi Universitas Sebelas Maret": "Vocational School Universitas Sebelas Maret",
  "Sekolah Vokasi UNS": "Vocational School UNS",
  "Universitas Sebelas Maret": "Universitas Sebelas Maret",
  "UNS KAMPUS MADIUN": "UNS MADIUN CAMPUS",
  "UNS Kampus Madiun": "UNS Madiun Campus",
  "Kampus Madiun": "Madiun Campus",
  "Kampus Tirtomoyo": "Tirtomoyo Campus",
  "Kampus Caruban": "Caruban Campus",
  "Pusat Hilirisasi Riset Terapan & Inovasi Unggulan": "Applied Research Commercialization & Premier Innovation Hub",
  "Pusat Hilirisasi Riset Terapan & Inovasi Unggulan Kampus Madiun":
    "Premier Applied Research Commercialization & Innovation Hub of Madiun Campus",
  "Pusat Hilirisasi Riset Terapan & Inovasi Unggulan Sekolah Vokasi UNS":
    "Premier Applied Research Commercialization & Innovation Hub of Vocational School UNS",
  "Pusat Hilirisasi Riset & Karya Unggulan Vokasi.":
    "Campus Applied Research & Vocational Innovation Hub.",
  "Pusat Hilirisasi Riset": "Applied Research Commercialization Hub",
  "Pusat Hilirisasi": "Commercialization Hub",
  "Hilirisasi Riset": "Research Commercialization",
  "Karya Orisinil Laboratorium SV": "Original Creations by Vocational Labs",
  "Lini Layanan Terpadu": "Integrated Service Lines",
  
  // Hero & Badges
  "Katalog Resmi Inovasi Terapan 2026": "Official Applied Innovations Catalog 2026",
  "Katalog Produk Unggulan dan Jasa": "Premier Products & Services Catalog",
  "Katalog Produk Unggulan & Jasa": "Premier Products & Services Catalog",
  "Katalog Produk Unggulan": "Premier Products Catalog",
  "Katalog Produk Inovasi": "Innovation Products Catalog",
  "Produk Unggulan dan Jasa": "Premier Products & Services",
  "Produk Unggulan": "Premier Products",
  "Produk Terapan": "Applied Products",
  "Produk Siap Terap": "Field-Ready Applied Products",
  "Produk Siap Pakai": "Ready-to-Use Products",
  "Bisnis & Inovasi Terapan": "Applied Business & Innovation",
  "Hilirisasi riset aplikatif, produk perangkat lunak SaaS, instrumen robotika IoT, dan jasa software house siap kemitraan Dunia Usaha & Dunia Industri (DUDI).":
    "Commercialization of applied research, SaaS platforms, IoT robotics instruments, and custom software house services ready for Industry & Enterprise (DUDI) partnerships.",
  "Hilirisasi riset aplikatif": "Commercialization of applied research",
  "Hilirisasi produk siap terap": "Commercialization of applied-ready products",
  "siap kemitraan Dunia Usaha & Dunia Industri (DUDI)": "ready for Industry & Enterprise (DUDI) partnerships",
  "siap kemitraan Dunia Usaha & Dunia Industri": "ready for Industry & Enterprise partnerships",
  "Dunia Usaha & Dunia Industri (DUDI)": "Industry & Enterprise (DUDI)",
  "Dunia Usaha & Dunia Industri": "Industry & Enterprise",
  "siap kemitraan": "ready for partnerships",
  "siap komersialisasi": "ready for commercialization",
  "siap terap": "applied-ready",
  "siap pakai": "ready-to-use",

  // CTAs & Stats
  "Jelajahi Katalog": "Explore Catalog",
  "Coba Live Demo": "Try Live Demo",
  "Buka Demo Sandbox": "Open Sandbox Demo",
  "Putar Objek 3D": "Rotate 3D Model",
  "Konsultasi Proyek": "Consult Project",
  "Hubungi PIC Kemitraan SV": "Contact Partnership Lead",
  "Hubungi PIC Kemitraan": "Contact Partnership Lead",
  "Unduh Katalog PDF": "Download Catalog PDF",
  "3 Lini": "3 Lines",
  "Layanan Terpadu": "Integrated Services",
  "100%": "100%",

  // Services Taxonomy
  "Taksonomi Layanan Vokasi": "Vocational Service Taxonomy",
  "Taksonomi 3 Lini Layanan": "3 Core Service Lines",
  "Taksonomi 3 Lini Layanan.": "3 Core Service Lines.",
  "Dirancang oleh dosen pakar dan talenta mahasiswa vokasi berbasis standar industri":
    "Engineered by expert faculty and talented vocational students to meet industry standards",
  "Layanan 1": "Service 1",
  "Teknologi": "Technology (SaaS)",
  "1. Teknologi & SaaS": "1. Technology & SaaS",
  "Platform web, modul AI, dan perangkat lunak siap pakai dengan pengujian sandbox langsung di browser.":
    "Turnkey web applications, AI models, and SaaS solutions with instant in-browser sandbox testing.",
  "Layanan 2 (Unggulan)": "Service 2 (Featured)",
  "Produk Fisik & IoT": "Hardware & IoT",
  "2. Produk Fisik & IoT": "2. Hardware & IoT",
  "Alat mekatronika presisi, robot patroli otonom, dan perangkat embedded cerdas berstandar manufaktur.":
    "Precision mechatronics, autonomous patrol robots, and industrial-grade embedded devices.",
  "Layanan 3": "Service 3",
  "Jasa Software House": "Software House & Services",
  "Jasa Layanan": "Software House Services",
  "3. Jasa Software House": "3. Software House Services",
  "Layanan konsultasi, rancang bangun sistem kustom, sprint agile, dan garansi pemeliharaan sistem teruji.":
    "Tailored software development, agile sprints, full code licensing, and guaranteed bug maintenance.",
  "Teknologi siap terap hasil riset terapan dan projek base learning yang sudah melewati pengujian.":
    "Field-ready technology from applied research and project-based learning with comprehensive testing.",
  "Produk unggulan siap edar hasil riset terapan dan sudah dilakukan pengujian  mendalam.":
    "Premier market-ready products resulting from applied research with rigorous in-depth testing.",
  "Produk unggulan siap edar hasil riset terapan dan sudah dilakukan pengujian mendalam.":
    "Premier market-ready products resulting from applied research with rigorous in-depth testing.",
  "Jasa layanan pengembangan dan konsultasi tenaga ahli.":
    "Professional software development services, custom systems, and expert academic consultancy.",

  // Hardware Lab Section
  "Laboratorium Hardware Engineering": "Hardware Engineering Laboratory",
  "Dari Cetak Biru CAD ke Prototipe Otonom Fisik": "From CAD Blueprint to Autonomous Physical Prototype",
  "Geser pemisah ke kiri dan kanan untuk membandingkan rancangan mekanikal 3D dengan unit fisik hasil perakitan mahasiswa SV UNS.":
    "Slide the divider left and right to compare the 3D mechanical CAD design with the physical unit assembled by SV UNS students.",
  "← Rancangan Awal 3D CAD": "← 3D CAD Blueprint",
  "Prototipe Fisik Otonom Siap Uji →": "Tested Physical Prototype →",

  // Software House Section
  "VOCATIONAL SOFTWARE HOUSE ECOSYSTEM": "VOCATIONAL SOFTWARE HOUSE ECOSYSTEM",
  "Ekosistem Software House Vokasi": "Vocational Software House Ecosystem",
  "Platform Digital Berstandar Enterprise": "Enterprise-Grade Digital Platforms",
  "Aplikasi web & mobile dirancang dengan Next.js App Router, Laravel RESTful API, dan arsitektur cloud teruji.":
    "Web & mobile applications engineered with Next.js App Router, Laravel RESTful API, and proven cloud architectures.",

  // DUDI Partnership Section
  "Kemitraan DUDI & Sinergi Industri": "Industry Partnerships & DUDI Synergy",
  "Mengapa Bermitra dengan Sekolah Vokasi UNS?": "Why Partner with Vocational School UNS?",
  "Kolaborasi riset terapan berbiaya terukur, didukung lisensi institusional resmi, dan pendampingan berkelanjutan dari akademisi berpengalaman.":
    "Cost-effective applied research collaboration, backed by official university IP licensing, and long-term academic support.",
  "PKS & MoA Resmi UNS": "Official University MoA & PKS",
  "Sertifikasi Hak Cipta / Paten": "Copyright & Patent Certified",
  "Insentif Super Tax Deduction": "Super Tax Deduction Incentive",
  "Jaringan Mitra Industri Terpercaya": "Trusted Industry Partners Network",
  "Sinergi erat dengan BUMN, korporasi terkemuka, dan pemerintah kota mewujudkan ekosistem hilirisasi riset terapan.":
    "Close synergy with state-owned enterprises (BUMN), leading corporations, and city governments drives applied research commercialization.",

  // Auth & Admin Defaults
  "Portal Autentikasi Pengguna": "User Authentication Portal",
  "Masuk sebagai Super Admin, Pimpinan SV, atau Administrator Prodi.":
    "Sign in as Super Admin, Vocational Leadership, or Department Administrator.",
  "Platform etalase resmi karya inovasi, riset terapan, produk teknologi siap komersialisasi, dan layanan jasa industri civitas akademika Sekolah Vokasi Universitas Sebelas Maret (UNS).":
    "Official showcase platform for applied innovations, research commercialization, turnkey technology products, and industrial software engineering services by the academic community of Vocational School, Universitas Sebelas Maret (UNS).",
  "© 2026 Sekolah Vokasi Universitas Sebelas Maret (UNS). Seluruh Hak Cipta Dilindungi.":
    "© 2026 Vocational School, Universitas Sebelas Maret (UNS). All Rights Reserved.",
  "Akreditasi Unggul & Kemitraan DUDI Teruji": "Accredited Excellence & Industry-Tested",
  "3 Lini Layanan": "3 Service Lines",
  "Semua Katalog Inovasi": "All Innovations Catalog",
  "Program Studi": "Academic Programs",
  "Sekretariat & Kampus": "Campus & Secretariat",
  "Portal Internal": "Internal Portal",

  // FAQ Section
  "Tanya Jawab & Informasi Kemitraan": "Q&A & Partnership Inquiries",
  "Pertanyaan Umum (FAQ)": "Frequently Asked Questions (FAQ)",
  "Informasi transparan seputar komersialisasi riset, live demo inovasi, garansi software, dan kerja sama DUDI.":
    "Transparent information regarding research commercialization, live product demos, software warranties, and enterprise collaboration.",

  // Pricing & Badges
  "Harga Tetap": "Fixed Price",
  "Mulai Dari": "Starting at",
  "Mulai dari": "Starting at",
  "Penawaran": "Custom Quote",
  "Hubungi Kami": "Contact Us",
  "Live Demo": "Live Demo",
  "Video Demo": "Video Demo",
  "Lihat 3D": "View 3D",
  "3D Frame Scroll": "3D Frame Scroll",

  // Academic Programs
  "D3 Akuntansi": "D3 Accounting",
  "D3 Teknik Informatika": "D3 Informatics Engineering",
  "Sarjana Terapan Teknologi Rekayasa Pangan": "D4 Applied Food Engineering Technology",
  "Sarjana Terapan Kesehatan dan Keselamatan Kerja": "D4 Applied Occupational Health & Safety",
  "Sarjana Terapan Teknologi Informasi dan Kecerdasan Artifisial": "D4 Applied IT & Artificial Intelligence",
  "D4 Teknologi Rekayasa Pangan": "D4 Applied Food Engineering Technology",
  "D4 Kesehatan dan Keselamatan Kerja": "D4 Applied Occupational Health & Safety",
  "D4 Teknologi Informasi dan Kecerdasan Artifisial": "D4 Applied IT & Artificial Intelligence",
};

// Word-level replacement dictionary
const WORD_MAP: Record<string, string> = {
  katalog: "catalog",
  resmi: "official",
  inovasi: "innovation",
  terapan: "applied",
  aplikatif: "applied",
  riset: "research",
  penelitian: "research",
  hilirisasi: "commercialization",
  layanan: "services",
  lini: "line",
  karya: "creations",
  unggul: "premier",
  unggulan: "premier",
  sekolah: "school",
  vokasi: "vocational",
  kampus: "campus",
  produk: "products",
  perangkat: "devices",
  lunak: "software",
  keras: "hardware",
  jasa: "services",
  kemitraan: "partnership",
  kerjasama: "cooperation",
  industri: "industry",
  mahasiswa: "students",
  dosen: "faculty",
  pakar: "experts",
  keamanan: "security",
  otonom: "autonomous",
  harga: "price",
  tetap: "fixed",
  mulai: "starting",
  dari: "from",
  penawaran: "quote",
  masuk: "sign in",
  keluar: "sign out",
  beranda: "home",
  semua: "all",
  terbaru: "latest",
  populer: "popular",
  kontak: "contact",
  pengguna: "user",
  pengaturan: "settings",
  dan: "and",
  atau: "or",
  dengan: "with",
  untuk: "for",
  ke: "to",
  di: "at",
  pada: "on",
  oleh: "by",
  dalam: "in",
  luar: "out",
  tentang: "about",
  kami: "us",
  kita: "our",
  siap: "ready",
  terap: "applied",
  alat: "instruments",
  mekatronika: "mechatronics",
  presisi: "precision",
  robot: "robot",
  patroli: "patrol",
  cerdas: "smart",
  standar: "standard",
  manufaktur: "manufacturing",
  sistem: "system",
  kustom: "custom",
  garansi: "warranty",
  pemeliharaan: "maintenance",
  teruji: "proven",
  konsultasi: "consultation",
  proyek: "project",
  laboratorium: "laboratory",
  rekayasa: "engineering",
  rancang: "design",
  bangun: "build",
  purwarupa: "prototype",
  cetak: "print",
  biru: "blueprint",
  fisik: "physical",
  uji: "test",
  otomasi: "automation",
  portal: "portal",
  autentikasi: "authentication",
  pimpinan: "leadership",
  informasi: "information",
  akademik: "academic",
  program: "program",
  studi: "study",
  fakultas: "faculty",
  departemen: "department",
  berita: "news",
  agenda: "events",
  galeri: "gallery",
  pengumuman: "announcement",
  unduh: "download",
  jelajahi: "explore",
  coba: "try",
  buka: "open",
  putar: "rotate",
  objek: "object",
  detail: "detail",
  selengkapnya: "more",
  tutup: "close",
  simpan: "save",
  batal: "cancel",
  hapus: "delete",
  ubah: "edit",
  tambah: "add",
  pencarian: "search",
  cari: "search",
};

/**
 * Intelligent Auto-Translation from Indonesian to English.
 * 1. Checks exact phrase match first.
 * 2. Uses indexed token placeholders for multi-word phrases (longest first) to prevent sub-string collisions.
 * 3. Applies word-level mapping for remaining words preserving casing and punctuation.
 * 4. Restores token placeholders and ensures pristine sentence casing.
 */
export function autoTranslateIndonesianToEnglish(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (!trimmed) return "";

  // 1. Direct phrase dictionary hit
  if (PHRASE_DICTIONARY[trimmed]) {
    return PHRASE_DICTIONARY[trimmed];
  }

  // 2. Sort phrase dictionary keys by length in descending order
  const sortedPhrases = Object.keys(PHRASE_DICTIONARY).sort((a, b) => b.length - a.length);

  const tokens: Record<string, string> = {};
  let tokenIdx = 0;
  let intermediate = trimmed;

  for (const phrase of sortedPhrases) {
    if (!phrase) continue;
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<=^|\\s|[,.!?:;()"'-])${escaped}(?=$|\\s|[,.!?:;()"'-])`, "gi");

    if (regex.test(intermediate)) {
      regex.lastIndex = 0;
      intermediate = intermediate.replace(regex, () => {
        const placeholder = `__PHRASE_TOK_${tokenIdx++}__`;
        tokens[placeholder] = PHRASE_DICTIONARY[phrase];
        return placeholder;
      });
    }
  }

  // 3. Fallback: Word by word tokenization for unknown words
  const words = intermediate.split(/(\s+|[.,!?:;()"-]+)/);
  const wordTranslated = words.map((token) => {
    if (!token || token.startsWith("__PHRASE_TOK_")) return token;
    const lower = token.toLowerCase();
    if (WORD_MAP[lower]) {
      const mapped = WORD_MAP[lower];
      // Preserve uppercase or titlecase
      if (token === token.toUpperCase() && token.length > 1) {
        return mapped.toUpperCase();
      }
      if (token[0] === token[0].toUpperCase()) {
        return mapped.charAt(0).toUpperCase() + mapped.slice(1);
      }
      return mapped;
    }
    return token;
  }).join("");

  // 4. Restore phrase tokens
  let finalResult = wordTranslated;
  for (const [placeholder, enVal] of Object.entries(tokens)) {
    finalResult = finalResult.replace(new RegExp(placeholder, "g"), enVal);
  }

  // 5. Clean up duplicate spaces
  finalResult = finalResult.replace(/\s{2,}/g, " ").trim();

  // 6. Ensure sentence capitalization if original started with uppercase
  if (trimmed.length > 0 && trimmed[0] === trimmed[0].toUpperCase() && finalResult.length > 0) {
    finalResult = finalResult.charAt(0).toUpperCase() + finalResult.slice(1);
  }

  return finalResult;
}

/**
 * Retrieves a localized string from CMS SiteSettings.
 * If user edits text in Settings dashboard, the English version automatically adapts!
 */
export function getLocalizedSetting(
  key: string,
  settings: Partial<SiteSettings> | undefined,
  lang: "id" | "en",
  fallbackId: string,
  fallbackEn: string
): string {
  if (!settings) {
    return lang === "en" ? fallbackEn : fallbackId;
  }

  const rawVal = (settings as any)[key];
  const hasValue = rawVal !== undefined && rawVal !== null && String(rawVal).trim().length > 0;
  const trimmed = hasValue ? String(rawVal).trim() : "";

  if (lang === "en") {
    // 1. Check if explicit _en field was saved
    const explicitEn = (settings as any)[`${key}_en`];
    if (explicitEn && typeof explicitEn === "string" && explicitEn.trim().length > 0) {
      return explicitEn.trim();
    }
    // 2. If empty or matches Indonesian fallback, return fallbackEn
    if (!hasValue || trimmed === fallbackId || trimmed === fallbackId.replace(/\.$/, "")) {
      return fallbackEn;
    }
    // 3. Check direct dictionary hit
    if (PHRASE_DICTIONARY[trimmed]) {
      return PHRASE_DICTIONARY[trimmed];
    }
    // 4. Translate custom setting text
    const translated = autoTranslateIndonesianToEnglish(trimmed);
    if (translated && translated !== trimmed) {
      return translated;
    }
    return fallbackEn || trimmed;
  }

  // Indonesian mode: always prioritize custom DB setting if present
  if (hasValue) {
    return trimmed;
  }
  return fallbackId;
}

/**
 * Universal text localization function
 */
export function t(idText: string, enText: string, lang: "id" | "en"): string {
  return lang === "en" ? enText : idText;
}
