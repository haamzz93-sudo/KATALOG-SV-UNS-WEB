"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CatalogItem } from "../../types/catalog";
import { useApp } from "../../context/AppContext";
import { 
  Laptop, Cpu, Wrench, Play, Eye, 
  ArrowUpRight, Building2, User 
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
    switch (item.category?.slug) {
      case "teknologi":
        return {
          icon: <Laptop className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Technology (SaaS)" : "Teknologi (SaaS)",
          bg: "bg-blue-50 dark:bg-blue-950/60 text-[#0F4C81] dark:text-sky-300 border-blue-200 dark:border-blue-900/50",
          actionText: currentLang === "en" ? "Live Demo" : "Coba Live Demo",
          actionIcon: <Play className="w-3.5 h-3.5 fill-current" />,
        };
      case "produk":
        return {
          icon: <Cpu className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Hardware (IoT)" : "Produk Fisik (IoT)",
          bg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
          actionText: currentLang === "en" ? "View 3D" : "3D Frame Scroll",
          actionIcon: <Eye className="w-3.5 h-3.5" />,
        };
      case "jasa":
      default:
        return {
          icon: <Wrench className="w-3.5 h-3.5" />,
          label: currentLang === "en" ? "Software Services" : "Jasa Software",
          bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
          actionText: "Video Demo",
          actionIcon: <Play className="w-3.5 h-3.5 fill-current" />,
        };
    }
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
          {item.category?.slug === "teknologi" && item.live_demo_url && (
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

          {item.category?.slug === "jasa" && (
            <button
              type="button"
              onClick={handleAction}
              style={{ borderRadius: "9999px" }}
              className="spring-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-[#000080] text-slate-800 hover:text-white dark:bg-slate-800 dark:hover:bg-[#FFD800] dark:text-slate-100 dark:hover:text-[#000080] text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-slate-200/80 dark:border-white/10 whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="whitespace-nowrap">Video Demo</span>
            </button>
          )}

          {item.category?.slug === "produk" && (
            <Link
              href={`/katalog/${item.slug}`}
              style={{ borderRadius: "9999px" }}
              className="spring-btn inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/10 hover:bg-[#FFD800] text-amber-800 hover:text-[#000080] dark:bg-amber-400/10 dark:text-[#FFD800] dark:hover:bg-[#FFD800] dark:hover:text-[#000080] text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-500/20 dark:border-[#FFD800]/30 whitespace-nowrap shrink-0"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{currentLang === "en" ? "View 3D" : "Lihat 3D"}</span>
            </Link>
          )}

          <Link
            href={`/katalog/${item.slug}`}
            style={{ borderRadius: "9999px" }}
            className="spring-btn w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-[#000080] text-slate-600 hover:text-white dark:bg-slate-800/90 dark:hover:bg-[#FFD800] dark:text-slate-300 dark:hover:text-[#000080] border border-slate-200/80 dark:border-white/10 shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
            title={currentLang === "en" ? "View Product Details" : "Lihat Detail Produk"}
          >
            <ArrowUpRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>
    </motion.div>

  );
};
