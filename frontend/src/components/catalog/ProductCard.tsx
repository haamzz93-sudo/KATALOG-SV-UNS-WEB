"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CatalogItem } from "../../types/catalog";
import { useApp } from "../../context/AppContext";
import { 
  Laptop, Cpu, Wrench, Play, Eye, 
  ArrowUpRight, Building2, User,
  Sparkles, Package
} from "lucide-react";

interface ProductCardProps {
  item: CatalogItem;
  onOpenLiveDemo?: (item: CatalogItem) => void;
  onOpenVideoDemo?: (item: CatalogItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onOpenLiveDemo,
  onOpenVideoDemo,
}) => {
  const { currentLang } = useApp();

  const formatRupiah = (val: number) => {
    if (val === 0) return currentLang === "en" ? "Contact Us" : "Hubungi Kami";
    if (currentLang === "en") {
      return `IDR ${val.toLocaleString("en-US")}`;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getCategoryConfig = () => {
    const slug = item.category?.slug || "produk";
    const nama = (item.nama_item || "").toLowerCase();
    const prodi = (item.prodi?.nama_prodi || "").toLowerCase();
    const kodeProdi = (item.prodi?.kode_prodi || "").toUpperCase();

    if (slug === "teknologi") {
      return {
        icon: <Laptop className="w-3.5 h-3.5" />,
        label: currentLang === "en" ? "Technology & Digital" : "Teknologi & Digital",
        bg: "bg-blue-50 dark:bg-blue-950/60 text-[#0F4C81] dark:text-sky-300 border-blue-200 dark:border-blue-900/50",
      };
    }

    if (slug === "produk") {
      // Deteksi bidang produk agar relevan untuk seluruh fakultas/prodi
      if (prodi.includes("farmasi") || kodeProdi.includes("FAR") || nama.includes("oil") || nama.includes("effervescent") || nama.includes("sehati") || nama.includes("herbliss")) {
        return {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Herbal & Health" : "Produk Herbal & Farmasi",
          bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
        };
      }
      if (prodi.includes("kebidanan") || prodi.includes("agribisnis") || prodi.includes("pangan") || kodeProdi.includes("KEB") || kodeProdi.includes("AGR") || nama.includes("beras") || nama.includes("vookies") || nama.includes("snazzle") || nama.includes("latte")) {
        return {
          icon: <Package className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Food & Nutrition" : "Produk Pangan & Gizi",
          bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
        };
      }
      if (prodi.includes("kimia") || kodeProdi.includes("TKIM") || nama.includes("mhp") || nama.includes("powder")) {
        return {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Chemical Materials" : "Material & Kimia Terapan",
          bg: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
        };
      }
      if (prodi.includes("desain") || prodi.includes("media") || kodeProdi.includes("DMD") || kodeProdi.includes("DKV") || nama.includes("animasi") || nama.includes("rajamala")) {
        return {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Creative & Media" : "Karya Animasi & Media",
          bg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50",
        };
      }
      if (prodi.includes("manufaktur") || prodi.includes("mesin") || kodeProdi.includes("TRM") || nama.includes("cnc") || nama.includes("milling") || nama.includes("turning")) {
        return {
          icon: <Cpu className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Precision Machinery" : "Permesinan & Manufaktur",
          bg: "bg-blue-50 dark:bg-blue-950/60 text-[#0F4C81] dark:text-sky-300 border-blue-200 dark:border-blue-900/50",
        };
      }
      if (nama.includes("robot") || nama.includes("iot") || nama.includes("pest control")) {
        return {
          icon: <Cpu className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Hardware & IoT" : "Hardware & IoT Cerdas",
          bg: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/50",
        };
      }
      return {
        icon: <Package className="w-3.5 h-3.5" />,
        label: currentLang === "en" ? "Applied Product" : "Produk Inovasi & Riset",
        bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
      };
    }

    // Default: Jasa / Layanan Keahlian
    if (prodi.includes("pajak") || kodeProdi.includes("PJK") || nama.includes("pajak") || nama.includes("brevet")) {
      return {
        icon: <Building2 className="w-3.5 h-3.5" />,
        label: currentLang === "en" ? "Tax & Finance Clinic" : "Klinik Pajak & Keuangan",
        bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
      };
    }
    if (prodi.includes("sipil") || kodeProdi.includes("TS") || nama.includes("bim") || nama.includes("gatc")) {
      return {
        icon: <Wrench className="w-3.5 h-3.5" />,
        label: currentLang === "en" ? "BIM & Civil Training" : "Pelatihan BIM Konstruksi",
        bg: "bg-blue-50 dark:bg-blue-950/60 text-[#0F4C81] dark:text-sky-300 border-blue-200 dark:border-blue-900/50",
      };
    }
    if (nama.includes("ndt") || nama.includes("test")) {
      return {
        icon: <Wrench className="w-3.5 h-3.5" />,
        label: currentLang === "en" ? "NDT Material Testing" : "Pengujian Material (NDT)",
        bg: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/50",
      };
    }
    if (prodi.includes("pustaka") || kodeProdi.includes("PUS") || nama.includes("naskah") || nama.includes("alih media")) {
      return {
        icon: <Building2 className="w-3.5 h-3.5" />,
        label: currentLang === "en" ? "Digital Preservation" : "Preservasi & Digitalisasi",
        bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
      };
    }
    if (prodi.includes("wisata") || kodeProdi.includes("UPW") || nama.includes("wellness") || nama.includes("wisata")) {
      return {
        icon: <Sparkles className="w-3.5 h-3.5" />,
        label: currentLang === "en" ? "Wellness Tourism" : "Layanan Wisata Kebugaran",
        bg: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900/50",
      };
    }
    return {
      icon: <Wrench className="w-3.5 h-3.5" />,
      label: currentLang === "en" ? "Expert Services" : "Jasa & Layanan Keahlian",
      bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    };
  };

  const cat = getCategoryConfig();

  const handleAction = (e: React.MouseEvent) => {
    if (item.category?.slug === "teknologi" && item.live_demo_url && onOpenLiveDemo) {
      e.preventDefault();
      onOpenLiveDemo(item);
    } else if (item.category?.slug === "jasa" && onOpenVideoDemo) {
      e.preventDefault();
      onOpenVideoDemo(item);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.8 }}
      whileHover={{ y: -8, scale: 1.018, transition: { type: "spring", stiffness: 380, damping: 18 } }}
      whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 450, damping: 20 } }}
      className="tactile-glass-card group relative bg-white dark:bg-[#07192C] border border-slate-200/90 dark:border-white/10 hover:border-[#C5A059]/80 dark:hover:border-[#C5A059] rounded-[32px] overflow-hidden hover:shadow-[0_25px_50px_-10px_rgba(197,160,89,0.25)] transition-all duration-300 flex flex-col justify-between h-full"
    >
      {/* 21st.dev Benchmark: Gold Shimmer Light Beam on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-10" />

      {/* Top Image & Badge */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-t-[32px]">
          <img
            src={item.thumbnail_url || "/images/brand/slogan-poster-vokasi.jpg"}
            alt={item.nama_item}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges on top of image */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${cat.bg}`}>
              {cat.icon}
              <span>{cat.label}</span>
            </span>

            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-md border border-white/20 shadow-sm">
              {item.prodi?.kode_prodi || "SV UNS"}
            </span>
          </div>
        </div>

        {/* Card Content (Apple-Style Crisp Typography) */}
        <div className="p-5 text-left">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="line-clamp-1">{item.pic_laboratorium || item.prodi?.nama_prodi}</span>
          </div>

          <Link href={`/katalog/${item.slug}`}>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#0F4C81] dark:group-hover:text-[#C5A059] transition-colors line-clamp-2 min-h-[48px] leading-snug tracking-tight">
              {item.nama_item}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed font-medium">
            {item.tagline || item.deskripsi_singkat}
          </p>

          {/* Specs tags pills */}
          {item.specs && item.specs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.specs.slice(0, 2).map((spec) => (
                <span
                  key={spec.id}
                  style={{ borderRadius: "9999px" }}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 font-medium"
                >
                  {spec.spec_key}: {spec.spec_value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Actions */}
      <div className="p-5 pt-0 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="text-left">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block tracking-wider">
            {item.harga_tipe === "fixed" 
              ? (currentLang === "en" ? "Fixed Price" : "Harga Tetap") 
              : item.harga_tipe === "starting_at" 
              ? (currentLang === "en" ? "Starting at" : "Mulai Dari") 
              : (currentLang === "en" ? "Custom Quote" : "Penawaran")}
          </span>
          <span className="text-base font-black text-[#000080] dark:text-[#FFD800] tracking-tight">
            {formatRupiah(item.harga_nominal)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.live_demo_url && (
            <button
              type="button"
              onClick={handleAction}
              style={{ borderRadius: "9999px" }}
              className="spring-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#000080] to-blue-700 hover:from-blue-900 hover:to-blue-600 text-white dark:from-[#FFD800] dark:to-[#e6c300] dark:text-[#000080] text-xs sm:text-sm font-black shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-blue-400/20 dark:border-[#FFD800]/40 whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="whitespace-nowrap">Live Demo</span>
            </button>
          )}

          {item.model_3d_url && (
            <Link
              href={`/katalog/${item.slug}`}
              style={{ borderRadius: "9999px" }}
              className="spring-btn inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/10 hover:bg-[#FFD800] text-amber-800 hover:text-[#000080] dark:bg-amber-400/10 dark:text-[#FFD800] dark:hover:bg-[#FFD800] dark:hover:text-[#000080] text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-500/20 dark:border-[#FFD800]/30 whitespace-nowrap shrink-0"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{currentLang === "en" ? "View 3D" : "Model 3D"}</span>
            </Link>
          )}

          {!item.live_demo_url && !item.model_3d_url && (
            <Link
              href={`/katalog/${item.slug}`}
              style={{ borderRadius: "9999px" }}
              className="spring-btn inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-[#000080] text-slate-800 hover:text-white dark:bg-slate-800 dark:hover:bg-[#FFD800] dark:text-slate-100 dark:hover:text-[#000080] text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-200/80 dark:border-white/10 whitespace-nowrap shrink-0"
            >
              <span>{currentLang === "en" ? "Details" : "Lihat Detail"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          )}

          {(item.live_demo_url || item.model_3d_url) && (
            <Link
              href={`/katalog/${item.slug}`}
              style={{ borderRadius: "9999px" }}
              className="spring-btn w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-[#000080] text-slate-600 hover:text-white dark:bg-slate-800/90 dark:hover:bg-[#FFD800] dark:text-slate-300 dark:hover:text-[#000080] border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
              title={currentLang === "en" ? "View Product Details" : "Lihat Detail Produk"}
            >
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>

  );
};
