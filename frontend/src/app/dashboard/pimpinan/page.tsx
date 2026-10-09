"use client";

import React, { useEffect, useState } from "react";
import { 
  BarChart3, Eye, Play, MessageSquare, Printer, 
  Download, Layers, Award, TrendingUp, CheckCircle2 
} from "lucide-react";
import { api } from "../../../lib/api";

export default function PimpinanDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await api.getPimpinanStats();
        setStats(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Memuat Metrik Eksekutif...
        </p>
      </div>
    );
  }

  const s = stats?.summary || {};

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span 
              style={{ borderRadius: "9999px" }}
              className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 uppercase tracking-widest inline-block"
            >
              Akses View-Only Dekanat
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            Executive Analytics & Laporan Inovasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Pemantauan performa produk inovasi Sekolah Vokasi UNS dan rekapitulasi data akreditasi & mitra industri.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          style={{ borderRadius: "9999px" }}
          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Ekspor Rekap Laporan</span>
        </button>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-[#0F4C81] dark:text-sky-400 w-fit mb-2">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">
            Total Inovasi
          </span>
          <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block mt-0.5">
            {s.total_items || 3}
          </span>
          <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            {s.total_published || 3} Terpublikasi
          </span>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 w-fit mb-2">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">
            Total Views
          </span>
          <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block mt-0.5">
            {s.total_views || 5080}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-1 block">
            Impresi Publik
          </span>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-[#C5A059] w-fit mb-2">
            <Play className="w-4 h-4" />
          </div>
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">
            Klik Live Demo
          </span>
          <span className="text-xl sm:text-3xl font-black text-[#C5A059] block mt-0.5">
            {s.total_demo_clicks || 380}
          </span>
          <span className="text-[10px] sm:text-xs text-amber-600 font-semibold mt-1 block">
            Interaksi Sandbox
          </span>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 w-fit mb-2">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">
            Inquiry DUDI
          </span>
          <span className="text-xl sm:text-3xl font-black text-emerald-600 block mt-0.5">
            {s.total_inquiries || 65}
          </span>
          <span className="text-[10px] sm:text-xs text-emerald-600 font-semibold mt-1 block">
            Minat Kerja Sama
          </span>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 w-fit mb-2">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">
            Akreditasi
          </span>
          <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block mt-0.5">
            Unggul
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-1 block">
            Sekolah Vokasi UNS
          </span>
        </div>
      </div>

      {/* Distribution Charts & Ranking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Distribution per 3 Services */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Distribusi Inovasi per 3 Lini Layanan
          </h3>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1.5">
                <span>1. Teknologi & SaaS</span>
                <span className="text-slate-500 font-bold">1 Item (33.3%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-[#0F4C81] rounded-full w-1/3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1.5">
                <span>2. Produk Fisik & IoT (Robotika)</span>
                <span className="text-slate-500 font-bold">1 Item (33.3%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-[#C5A059] rounded-full w-1/3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1.5">
                <span>3. Jasa Software House</span>
                <span className="text-slate-500 font-bold">1 Item (33.3%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Productivity per Program Studi */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Produktivitas Inovasi per Program Studi
          </h3>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1.5">
                <span className="font-bold text-[#0F4C81] dark:text-sky-300">D3 Teknik Informatika (TIF)</span>
                <span className="font-bold text-emerald-600">3 Item (100%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1.5">
                <span className="text-slate-500">D3 Teknik Mesin (TM)</span>
                <span className="text-slate-400 font-medium">0 Item (Tahap Input)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-300 w-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Rankings Table */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
          Peringkat Inovasi Paling Diminati Mitra DUDI & Pengunjung
        </h3>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-extrabold">
                <th className="pb-3.5 font-bold">Inovasi Produk</th>
                <th className="pb-3.5 font-bold">Kategori</th>
                <th className="pb-3.5 font-bold">Prodi</th>
                <th className="pb-3.5 font-bold text-right">Views</th>
                <th className="pb-3.5 font-bold text-right">Demo Clicks</th>
                <th className="pb-3.5 font-bold text-right">Inquiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                  Robot Patroli Otonom
                </td>
                <td className="py-3.5 font-medium text-slate-700 dark:text-slate-300">Produk Fisik & IoT</td>
                <td className="py-3.5 font-medium text-slate-500">D3 Teknik Informatika</td>
                <td className="py-3.5 text-right font-black text-[#0F4C81] dark:text-sky-400">2.890</td>
                <td className="py-3.5 text-right font-semibold text-slate-400">-</td>
                <td className="py-3.5 text-right font-black text-emerald-500">32</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                  Rintisku - SaaS Inkubasi Bisnis
                </td>
                <td className="py-3.5 font-medium text-slate-700 dark:text-slate-300">Teknologi & SaaS</td>
                <td className="py-3.5 font-medium text-slate-500">D3 Teknik Informatika</td>
                <td className="py-3.5 text-right font-black text-[#0F4C81] dark:text-sky-400">1.240</td>
                <td className="py-3.5 text-right font-black text-[#C5A059]">380</td>
                <td className="py-3.5 text-right font-black text-emerald-500">14</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                  Vokasi Software House
                </td>
                <td className="py-3.5 font-medium text-slate-700 dark:text-slate-300">Jasa Software</td>
                <td className="py-3.5 font-medium text-slate-500">D3 Teknik Informatika</td>
                <td className="py-3.5 text-right font-black text-[#0F4C81] dark:text-sky-400">950</td>
                <td className="py-3.5 text-right font-semibold text-slate-400">-</td>
                <td className="py-3.5 text-right font-black text-emerald-500">19</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Rankings Cards */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          <div className="py-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  1. Robot Patroli Otonom
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Produk Fisik & IoT • D3 Teknik Informatika
                </p>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                32 Inquiry
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>👁 2.890 Views</span>
              <span className="text-slate-400">⚡ Demo: -</span>
            </div>
          </div>

          <div className="py-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  2. Rintisku - SaaS Inkubasi Bisnis
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Teknologi & SaaS • D3 Teknik Informatika
                </p>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                14 Inquiry
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>👁 1.240 Views</span>
              <span className="text-[#C5A059]">⚡ 380 Sandbox Demo</span>
            </div>
          </div>

          <div className="py-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  3. Vokasi Software House
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Jasa Software • D3 Teknik Informatika
                </p>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                19 Inquiry
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>👁 950 Views</span>
              <span className="text-slate-400">⚡ Demo: -</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export / Printable Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-[#C5A059]/40 rounded-3xl p-8 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src="/images/brand/logo-sv-uns-official-color.png"
                  alt="Logo SV UNS"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Laporan Rekapitulasi Hilirisasi Inovasi Vokasi
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Dokumen Resmi Sekolah Vokasi Universitas Sebelas Maret • Siap Akreditasi
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-400 block text-xs">Total Produk:</span>
                  <span className="font-bold text-base text-slate-900 dark:text-white">3 Item</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Total Impresi:</span>
                  <span className="font-bold text-base text-slate-900 dark:text-white">5.080 Tayangan</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Uji Coba Sandbox:</span>
                  <span className="font-bold text-base text-slate-900 dark:text-white">380 Sesi</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Mitra DUDI Tertarik:</span>
                  <span className="font-bold text-base text-emerald-500">65 Penawaran</span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-3.5 bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white">
                  Daftar Produk Terdaftar (Poin 1 - 5)
                </div>
                <div className="p-4 space-y-3.5">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <p className="font-bold">1. SaaS Rintisku (D3 Teknik Informatika)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Harga: Rp 2.500.000 / thn | Live Demo: Aktif | PIC: Dr. Darmawan, M.T.</p>
                  </div>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <p className="font-bold">2. Robot Patroli Otonom (D3 Teknik Informatika)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Harga: Rp 45.000.000 | 3D Frame Sequence: Tersedia | PIC: Lab Embedded Vokasi</p>
                  </div>
                  <div>
                    <p className="font-bold">3. Vokasi Software House (D3 Teknik Informatika)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Harga: Mulai Rp 15.000.000 | SLA: 30-60 Hari | PIC: Unit Bisnis Mahasiswa TIF</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handlePrint}
                style={{ borderRadius: "9999px" }} className="px-6 py-2.5 rounded-full bg-[#0F4C81] text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
