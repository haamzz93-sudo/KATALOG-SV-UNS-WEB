"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Laptop, Cpu, Wrench, Play, Eye, MessageSquare, 
  ArrowLeft, Building2, User, Phone, Mail, 
  CheckCircle2, Layers, ShieldCheck, Download
} from "lucide-react";
import { DynamicIslandHeader } from "../../../components/navigation/DynamicIslandHeader";
import { LiveDemoModal } from "../../../components/catalog/LiveDemoModal";
import { VideoDemoModal } from "../../../components/catalog/VideoDemoModal";
import { InquiryModal } from "../../../components/catalog/InquiryModal";
import { Footer } from "../../../components/layout/Footer";
import { api } from "../../../lib/api";
import { CatalogItem } from "../../../types/catalog";

export default function DetailProdukPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [item, setItem] = useState<CatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Modals
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    async function loadItem() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await api.getCatalogItem(slug);
        setItem(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadItem();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#07192C]">
        <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
          Memuat Detail Produk...
        </p>
      </div>
    );
  }

      if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#07192C] p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Item Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-2">Produk yang Anda cari mungkin telah diarsipkan atau dipindahkan.</p>
        <Link href="/#katalog" className="mt-4 px-7 py-2.5 rounded-full bg-[#000080] hover:bg-[#0A2540] text-white text-xs font-bold transition shadow-sm">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const formatRupiah = (val: number) => {
    if (val === 0) return "Hubungi Kami";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const mediaList = item.media && item.media.length > 0
    ? item.media
    : [{ id: 1, file_url: item.thumbnail_url, is_primary: true, media_type: "image" as const, caption: item.nama_item }];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#07192C] text-slate-900 dark:text-white transition-colors">
      <DynamicIslandHeader />

      {/* Top Breadcrumb Bar */}
      <section className="pt-28 pb-4 bg-slate-100 dark:bg-[#0A2540] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/#katalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#000080] dark:hover:text-[#C5A059] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>

          <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
            {item.prodi?.nama_prodi} • {item.category?.nama}
          </span>
        </div>
      </section>

      {/* Main Product Showcase Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left Column: Visual Media & Demo Triggers (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Media Display */}
            <div className="relative aspect-[16/10] w-full rounded-2xl sm:rounded-[32px] overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src={mediaList[activeMediaIndex]?.file_url || item.thumbnail_url}
                alt={item.nama_item}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges on top */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#0A2540]/80 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/40">
                  {item.category?.nama}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                  {item.prodi?.kode_prodi}
                </span>
              </div>
            </div>

            {/* Media Thumbnails Carousel */}
            {mediaList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {mediaList.map((m, idx) => (
                  <button
                    key={m.id || idx}
                    type="button"
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-16 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeMediaIndex === idx
                        ? "border-[#C5A059] scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={m.file_url} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Interactive Demo Action Bar */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[32px] bg-white dark:bg-[#0A2540] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
                  Simulasi & Pengujian Langsung
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Uji Coba Interaktif di Peramban
                </h4>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                {item.live_demo_url && (
                  <button
                    type="button"
                    onClick={() => {
                      api.logDemoClick(item.id);
                      setIsDemoOpen(true);
                    }}
                    style={{ borderRadius: "9999px" }}
                    className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0F4C81] hover:bg-[#0A2540] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>Live Sandbox</span>
                  </button>
                )}

                {item.category?.slug === "jasa" && (
                  <button
                    type="button"
                    onClick={() => setIsVideoOpen(true)}
                    style={{ borderRadius: "9999px" }}
                    className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#C5A059] hover:bg-[#d6af5d] text-[#0A2540] font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>Video Demo</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsInquiryOpen(true)}
                  style={{ borderRadius: "9999px" }}
                  className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span>Kemitraan DUDI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Elements Info & Specifications (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Title & Tagline */}
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#0F4C81] dark:text-[#C5A059] uppercase tracking-wider block">
                {item.category?.nama} • {item.prodi?.nama_prodi}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 leading-tight">
                {item.nama_item}
              </h1>
              {item.tagline && (
                <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {item.tagline}
                </p>
              )}
            </div>

            {/* Pricing Box */}
            <div className="p-6 rounded-[28px] bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-[#0A2540] dark:to-[#07192C] border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                {item.harga_tipe === "fixed" ? "Harga Paten Unit" : item.harga_tipe === "starting_at" ? "Estimasi Biaya Dasar" : "Skema Biaya"}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-[#C5A059] mt-0.5">
                {formatRupiah(item.harga_nominal)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Tersedia skema lisensi resmi institusi, MoU riset terapan DUDI, dan garansi pemeliharaan.
              </p>
            </div>

            {/* Description Paragraph */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Deskripsi Lengkap
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.deskripsi_lengkap || item.deskripsi_singkat}
              </p>
            </div>

            {/* Technical Specifications Matrix (Apple-style) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Spesifikasi Teknis
                </h3>
                <span className="text-xs text-slate-400 font-semibold">Tervalidasi Lab SV</span>
              </div>

              <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-sm shadow-xs">
                {item.specs && item.specs.length > 0 ? (
                  item.specs.map((spec) => (
                    <div key={spec.id} className="p-3.5 bg-white dark:bg-[#07192C] flex justify-between gap-4">
                      <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        {spec.spec_key}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-right">
                        {spec.spec_value}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400">
                    Spesifikasi standar terapan Sekolah Vokasi UNS.
                  </div>
                )}
              </div>
            </div>

            {/* PIC & Laboratorium Contact Box */}
            <div className="p-6 rounded-[28px] bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Penanggung Jawab & Laboratorium
              </span>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-400 flex items-center justify-center font-bold shadow-inner">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.pic_nama}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {item.pic_laboratorium || item.prodi?.nama_prodi}
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2 flex gap-2">
                <a
                  href={`https://wa.me/${item.pic_kontak}?text=Halo%20${encodeURIComponent(item.pic_nama)},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(item.nama_item)}%20di%20Katalog%20SV%20UNS.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm text-center shadow-md transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi PIC via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {isDemoOpen && item.live_demo_url && (
        <LiveDemoModal
          isOpen={isDemoOpen}
          onClose={() => setIsDemoOpen(false)}
          productName={item.nama_item}
          demoUrl={item.live_demo_url}
          techStack={item.specs?.map((s) => `${s.spec_key}: ${s.spec_value}`)}
        />
      )}

      {isVideoOpen && (
        <VideoDemoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          title={item.nama_item}
          prodi={item.prodi?.nama_prodi || "D3 Teknik Informatika"}
          price={formatRupiah(item.harga_nominal)}
          picContact={item.pic_kontak}
          deliverables={item.specs?.map((s) => s.spec_value) || ["Source Code", "PRD", "Bug Fixing"]}
        />
      )}

      {isInquiryOpen && (
        <InquiryModal
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          item={item}
        />
      )}
    </div>
  );
}
