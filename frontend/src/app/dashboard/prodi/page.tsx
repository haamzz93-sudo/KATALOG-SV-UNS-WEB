"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, Trash2, Eye, ExternalLink, 
  Play, Building2, CheckCircle2 
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

  const formatRupiah = (val: number) => {
    if (val === 0) return "Hubungi Kami";
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
            Portal Administrator Prodi
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            Katalog Inovasi Prodi {currentUser?.prodi?.nama || "D3 Teknik Informatika"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Kelola seluruh produk teknologi, alat mekatronika/IoT, dan paket jasa software house milik prodi.
          </p>
        </div>

        <Link
          href="/dashboard/prodi/create"
          style={{ borderRadius: "9999px" }}
          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Inovasi Baru</span>
        </Link>
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
                            src={item.thumbnail_url || "/images/brand/slogan-poster-vokasi.jpg"}
                            alt={item.nama_item}
                            className="w-14 h-11 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
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
                          {formatRupiah(item.harga_nominal)}
                        </span>
                        <span className="text-xs text-slate-400 font-bold uppercase mt-0.5 block">
                          {item.harga_tipe}
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
                      src={item.thumbnail_url || "/images/brand/slogan-poster-vokasi.jpg"}
                      alt={item.nama_item}
                      className="w-16 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
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
                        {formatRupiah(item.harga_nominal)} ({item.harga_tipe})
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
    </div>
  );
}
