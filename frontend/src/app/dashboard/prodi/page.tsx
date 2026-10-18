"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, Trash2, Eye, ExternalLink, 
  Play, Building2, CheckCircle2, Images, Maximize2, X, ChevronLeft, ChevronRight 
} from "lucide-react";
import { api } from "../../../lib/api";
import { CatalogItem } from "../../../types/catalog";
import { useApp } from "../../../context/AppContext";
import { useToast } from "../../../context/ToastContext";

export default function ProdiDashboard() {
  const { currentUser } = useApp();
  const toast = useToast();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detail HD Photo Preview Modal State (Zero-Crop HD Inspector)
  const [previewPhotoItem, setPreviewPhotoItem] = useState<any | null>(null);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState<number>(0);

  const getCatalogItemPhotos = (item: any) => {
    if (!item) return [];
    const photos: { url: string; title: string; subtitle: string; badge: string }[] = [];
    
    if (item.thumbnail_url) {
      photos.push({
        url: item.thumbnail_url,
        title: "Foto #1 — Mockup Utama (Hero Marketplace)",
        subtitle: "Tampilan visual utama di katalog & etalase publik",
        badge: "Hero Utama",
      });
    }

    if (Array.isArray(item.media)) {
      const additional = item.media.filter((m: any) => {
        const u = m.file_url || m.url;
        return u && u !== item.thumbnail_url;
      });

      additional.forEach((m: any, idx: number) => {
        const u = m.file_url || m.url;
        const defaultTitle = idx === 0 
          ? "Foto #2 — Detail & Kualitas Macro 3/4" 
          : idx === 1 
            ? "Foto #3 — Infografis Fitur & Alasan Membeli" 
            : `Foto #${idx + 2} — Galeri Tambahan`;
        const defaultSub = idx === 0
          ? "Close-up material, presisi rancang bangun, dan keandalan komponen"
          : idx === 1
            ? "Matriks keunggulan, standar sertifikasi, dan daya saing industri"
            : "Dokumentasi visual pendukung";

        photos.push({
          url: u,
          title: m.caption ? `${defaultTitle} (${m.caption})` : defaultTitle,
          subtitle: defaultSub,
          badge: idx === 0 ? "Detail Macro" : idx === 1 ? "Infografis Fitur" : `Foto #${idx + 2}`,
        });
      });
    }

    if (photos.length === 0) {
      photos.push({
        url: "/images/brand/slogan-poster-vokasi.jpg",
        title: "Foto Mockup Standar",
        subtitle: "Belum ada foto studio terunggah",
        badge: "Standar",
      });
    }

    return photos;
  };

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMyItems();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus item "${name}"?`)) {
      try {
        await api.deleteItem(id);
        toast.info("Inovasi Dihapus", `Item "${name}" berhasil dihapus dari sistem.`);
        loadItems();
      } catch {
        toast.error("Gagal Menghapus", "Terjadi kesalahan saat menghapus data inovasi.");
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm("PERINGATAN PRODI:\nApakah Anda yakin ingin MENGHAPUS SEMUA produk inovasi katalog lama milik prodi ini?\n\nKatalog akan dikosongkan agar bersih dan siap diinput ulang dengan format foto studio dan prompt terkini.")) {
      try {
        setIsLoading(true);
        const res = await api.clearAllItems();
        if (res.success) {
          toast.success("Katalog Dibersihkan", res.message);
          setItems([]);
        } else {
          toast.error("Gagal Menghapus", res.message);
        }
      } catch {
        toast.error("Gagal", "Terjadi kesalahan saat mengosongkan katalog.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatRupiah = (val: number, tipe?: string) => {
    if (tipe === "contact_us" || val === 0) return "Hubungi PIC (RFQ)";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span 
            style={{ borderRadius: "9999px" }}
            className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest inline-block"
          >
            {currentUser?.role === "super_admin" || (currentUser?.role as any)?.name === "super_admin" ? "Otoritas Super Admin" : "Portal Administrator Prodi"}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            {currentUser?.role === "super_admin" || (currentUser?.role as any)?.name === "super_admin"
              ? "Katalog Inovasi Seluruh Program Studi (Super Admin)" 
              : `Katalog Inovasi Prodi ${currentUser?.prodi?.nama || (currentUser?.prodi as any)?.nama_prodi || "D3 Teknik Informatika"}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            {currentUser?.role === "super_admin" || (currentUser?.role as any)?.name === "super_admin"
              ? "Moderasi dan kelola seluruh produk inovasi, alat IoT, dan jasa dari seluruh prodi Sekolah Vokasi UNS."
              : "Kelola seluruh produk teknologi, alat mekatronika/IoT, dan paket jasa software house milik prodi."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              style={{ borderRadius: "9999px" }}
              className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 dark:text-rose-300 font-bold text-xs sm:text-sm border border-rose-200 dark:border-rose-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title="Hapus seluruh produk inovasi lama agar bersih"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Semua Produk Lawas</span>
            </button>
          )}

          <Link
            href="/dashboard/prodi/create"
            style={{ borderRadius: "9999px" }}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Inovasi Baru</span>
          </Link>
        </div>
      </div>

      {/* Items List Table */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Memuat daftar item prodi...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Belum ada item inovasi yang didaftarkan oleh Program Studi ini.
            </p>
            <Link
              href="/dashboard/prodi/create"
              style={{ borderRadius: "9999px" }}
              className="mt-3 inline-block px-6 py-2.5 rounded-full bg-[#0F4C81] text-white text-xs sm:text-sm font-bold hover:bg-[#0A2540] transition shadow-xs"
            >
              Tambah Produk Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-extrabold">
                    <th className="pb-3.5 font-bold">Produk & Mockup</th>
                    <th className="pb-3.5 font-bold">Lini Layanan</th>
                    <th className="pb-3.5 font-bold">Harga & Tipe</th>
                    <th className="pb-3.5 font-bold text-center">Live Demo / 3D</th>
                    <th className="pb-3.5 font-bold text-center">Status</th>
                    <th className="pb-3.5 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.thumbnail_url && !item.thumbnail_url.startsWith("blob:") ? item.thumbnail_url : "/images/brand/slogan-poster-vokasi.jpg"}
                            alt={item.nama_item}
                            className="w-11 h-14 aspect-[3/4] rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/images/brand/slogan-poster-vokasi.jpg";
                            }}
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                              {item.nama_item}
                            </h4>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1 font-medium mt-0.5">
                              PIC: {item.pic_nama}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-sm text-slate-700 dark:text-slate-300">
                        {item.category?.nama}
                      </td>
                      <td className="py-4">
                        <span className="font-black text-sm text-[#0A2540] dark:text-[#C5A059] block">
                          {formatRupiah(item.harga_nominal, item.harga_tipe)}
                        </span>
                        <span className="text-xs text-slate-400 font-bold uppercase mt-0.5 block">
                          {item.harga_tipe === "contact_us" ? "Kustom / RFQ" : item.harga_tipe}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        {item.live_demo_url ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-900/40">
                            <Play className="w-3.5 h-3.5" />
                            <span>Sandbox Aktif</span>
                          </span>
                        ) : item.model_3d_url ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                            <Eye className="w-3.5 h-3.5" />
                            <span>3D Canvas</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Katalog Standar</span>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full ${
                          item.status_publikasi === "published"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                        }`}>
                          {item.status_publikasi.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewPhotoItem(item);
                              setPreviewPhotoIndex(0);
                            }}
                            style={{ borderRadius: "9999px" }}
                            className="px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                            title="Lihat Detail 3 Foto Studio HD"
                          >
                            <Images className="w-3.5 h-3.5" />
                            <span>Lihat Foto</span>
                          </button>
                          <Link
                            href={`/katalog/${item.slug}`}
                            target="_blank"
                            style={{ borderRadius: "9999px" }}
                            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#C5A059] flex items-center justify-center transition"
                            title="Lihat Halaman Publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.nama_item)}
                            style={{ borderRadius: "9999px" }}
                            className="w-9 h-9 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center transition cursor-pointer"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card-Based Items View */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 space-y-2.5">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.thumbnail_url && !item.thumbnail_url.startsWith("blob:") ? item.thumbnail_url : "/images/brand/slogan-poster-vokasi.jpg"}
                      alt={item.nama_item}
                      className="w-14 h-18 aspect-[3/4] rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/brand/slogan-poster-vokasi.jpg";
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {item.nama_item}
                        </h4>
                        <span className={`inline-block text-[9.5px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          item.status_publikasi === "published"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                        }`}>
                          {item.status_publikasi.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block truncate font-medium mt-0.5">
                        {item.category?.nama} • PIC: {item.pic_nama}
                      </span>
                      <span className="font-black text-xs text-[#0A2540] dark:text-[#C5A059] block mt-1">
                        {formatRupiah(item.harga_nominal, item.harga_tipe)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <div>
                      {item.live_demo_url ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300">
                          <Play className="w-3 h-3" />
                          <span>Sandbox</span>
                        </span>
                      ) : item.model_3d_url ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          <Eye className="w-3 h-3" />
                          <span>3D Canvas</span>
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewPhotoItem(item);
                          setPreviewPhotoIndex(0);
                        }}
                        style={{ borderRadius: "9999px" }}
                        className="px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        title="Lihat Detail 3 Foto Studio HD"
                      >
                        <Images className="w-3 h-3" />
                        <span>Foto</span>
                      </button>
                      <Link
                        href={`/katalog/${item.slug}`}
                        target="_blank"
                        style={{ borderRadius: "9999px" }}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Lihat Publik</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.nama_item)}
                        style={{ borderRadius: "9999px" }}
                        className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail HD Photo Preview Modal (3 Foto Studio Zero-Crop HD Inspector) */}
      {previewPhotoItem && (() => {
        const photos = getCatalogItemPhotos(previewPhotoItem);
        const safeIdx = Math.min(previewPhotoIndex, Math.max(0, photos.length - 1));
        const activePhoto = photos[safeIdx] || photos[0];

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
            onClick={() => setPreviewPhotoItem(null)}
          >
            <div 
              className="relative w-full max-w-4xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Images className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-300 border border-blue-200 dark:border-blue-900/40">
                        {previewPhotoItem.category?.nama || "Inovasi Vokasi"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Total {photos.length} Foto Studio HD
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                      {previewPhotoItem.nama_item}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewPhotoItem(null)}
                  style={{ borderRadius: "9999px" }}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
                  title="Tutup Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Main Image Display with Anti-Crop */}
              <div className="relative flex-1 min-h-[300px] max-h-[58vh] bg-slate-900/90 dark:bg-black/90 rounded-2xl overflow-hidden flex items-center justify-center p-3 border border-slate-800">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain max-h-[55vh] select-none rounded-lg drop-shadow-2xl"
                />

                {/* Badge Photo Info */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    {activePhoto.badge} ({safeIdx + 1}/{photos.length})
                  </span>
                </div>

                {/* Action Link to Full Raw */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <a
                    href={activePhoto.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ borderRadius: "9999px" }}
                    className="px-3 py-1 rounded-full bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    title="Buka File Gambar Asli"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Buka Resolusi Asli</span>
                  </a>
                </div>

                {/* Prev/Next Navigation Arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                      style={{ borderRadius: "9999px" }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-white flex items-center justify-center shadow-xl transition cursor-pointer"
                      title="Foto Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                      style={{ borderRadius: "9999px" }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-white flex items-center justify-center shadow-xl transition cursor-pointer"
                      title="Foto Selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/10 text-white shadow-xl max-w-[90%]">
                    <p className="text-xs font-bold truncate">{activePhoto.title}</p>
                    {activePhoto.subtitle && (
                      <p className="text-[10px] text-slate-300 truncate">{activePhoto.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail Selector Strip (3 Foto) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewPhotoIndex(idx)}
                    className={`p-2 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                      safeIdx === idx
                        ? "bg-amber-500/10 border-amber-500/60 dark:border-amber-400 ring-2 ring-amber-500/30"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="w-10 h-13 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                      <img src={p.url} alt={p.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          safeIdx === idx ? "bg-amber-500 text-slate-950" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}>
                          #{idx + 1}
                        </span>
                        {safeIdx === idx && (
                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">Aktif</span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {p.badge}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  PIC: <span className="font-semibold text-slate-700 dark:text-slate-300">{previewPhotoItem.pic_nama || "Tim Dosen & Mahasiswa"}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {previewPhotoItem.slug && (
                    <a
                      href={`/katalog/${previewPhotoItem.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ borderRadius: "9999px" }}
                      className="px-4 py-2 rounded-full bg-[#0F4C81]/10 hover:bg-[#0F4C81]/20 text-[#0F4C81] dark:text-sky-300 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Halaman Detail Publik</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewPhotoItem(null)}
                    style={{ borderRadius: "9999px" }}
                    className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
