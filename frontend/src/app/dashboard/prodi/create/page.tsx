"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Plus, Trash2, CheckCircle2, 
  Laptop, Cpu, Wrench, Save, GraduationCap 
} from "lucide-react";
import { api } from "../../../../lib/api";
import { useToast } from "../../../../context/ToastContext";
import { useApp } from "../../../../context/AppContext";
import { MediaUploader } from "../../../../components/ui/MediaUploader";
import { SearchableProdiDropdown } from "../../../../components/ui/CustomCatalogSelect";
import { Prodi } from "../../../../types/catalog";

export default function CreateProdiItem() {
  const router = useRouter();
  const toast = useToast();
  const { currentUser } = useApp();

  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [prodiId, setProdiId] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [namaItem, setNamaItem] = useState("");
  const [tagline, setTagline] = useState("");
  const [deskripsiSingkat, setDeskripsiSingkat] = useState("");
  const [deskripsiLengkap, setDeskripsiLengkap] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [model3dUrl, setModel3dUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("/images/catalog/rintisku-saas-showcase.jpg");
  const [statusPublikasi, setStatusPublikasi] = useState<"draft" | "published">("published");
  const [hargaTipe, setHargaTipe] = useState<"starting_at" | "fixed" | "contact_us">("starting_at");
  const [hargaNominal, setHargaNominal] = useState<number>(5000000);
  const [picNama, setPicNama] = useState("");
  const [picKontak, setPicKontak] = useState("6281234567890");
  const [picLaboratorium, setPicLaboratorium] = useState("Laboratorium Rekayasa Perangkat Lunak");

  useEffect(() => {
    async function fetchProdis() {
      const data = await api.getProdis();
      setProdis(data);
      const userProdiId = currentUser?.prodi?.id || currentUser?.prodi_id;
      if (userProdiId) {
        setProdiId(Number(userProdiId));
      } else if (data.length > 0 && data[0].id) {
        setProdiId(data[0].id);
      }
    }
    fetchProdis();
  }, [currentUser]);

  // Dynamic specs
  const [specs, setSpecs] = useState([
    { group_name: "Tech Stack", spec_key: "Frontend", spec_value: "Next.js 14, Tailwind CSS" },
    { group_name: "Tech Stack", spec_key: "Backend API", spec_value: "Laravel 11 REST API" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddSpec = () => {
    setSpecs([...specs, { group_name: "Umum", spec_key: "", spec_value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: string, val: string) => {
    const updated = [...specs];
    (updated[index] as any)[field] = val;
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        category_id: categoryId,
        prodi_id: prodiId,
        nama_item: namaItem,
        tagline,
        deskripsi_singkat: deskripsiSingkat,
        deskripsi_lengkap: deskripsiLengkap,
        live_demo_url: liveDemoUrl || null,
        model_3d_url: model3dUrl || null,
        thumbnail_url: thumbnailUrl,
        status_publikasi: statusPublikasi,
        harga_tipe: hargaTipe,
        harga_nominal: hargaNominal,
        pic_nama: picNama,
        pic_kontak: picKontak,
        pic_laboratorium: picLaboratorium,
        specs: specs.filter((s) => s.spec_key.trim() !== ""),
      };

      const res = await api.createItem(payload);
      if (res.success) {
        setIsSuccess(true);
        toast.success("Inovasi Berhasil Didaftarkan!", `Produk "${namaItem}" telah berhasil disimpan ke katalog prodi.`);
        setTimeout(() => {
          router.push("/dashboard/prodi");
        }, 1200);
      } else {
        toast.error("Gagal Menyimpan", res.message || "Periksa kembali isian formulir.");
        setErrorMsg(res.message || "Gagal menyimpan item.");
      }
    } catch {
      toast.error("Koneksi Bermasalah", "Terjadi kegagalan komunikasi dengan server.");
      setErrorMsg("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/dashboard/prodi"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0F4C81] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Produk</span>
        </Link>

        <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
          Formulir 5 Elemen Wajib Inovasi
        </span>
      </div>

      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Tambah Produk Inovasi Baru
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Lengkapi data produk sesuai standar 5 Elemen (Mockup, Demo, Nama, Spesifikasi Teknis, Harga).
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Card 1: Kategori & Informasi Utama (Elemen 3) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              1. Klasifikasi 3 Lini Layanan & Identitas Produk
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0F4C81] dark:text-sky-300 border border-blue-200 dark:border-blue-800">
              39 Prodi Resmi Terhubung
            </span>
          </div>

          {/* Program Studi Pengembang (Pilihan dari 39 Program Studi) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                <span>Program Studi Pengembang / Pelaksana *</span>
              </label>
              {prodis.find((p) => p.id === prodiId) && (
                <span className="text-[11px] font-bold text-[#0F4C81] dark:text-sky-300">
                  {prodis.find((p) => p.id === prodiId)?.nama_prodi}
                </span>
              )}
            </div>
            <SearchableProdiDropdown
              prodis={prodis}
              selectedProdi={prodis.find((p) => p.id === prodiId)?.kode_prodi || ""}
              onChange={(kode) => {
                const found = prodis.find((p) => p.kode_prodi === kode);
                if (found && found.id) setProdiId(found.id);
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setCategoryId(1)}
              style={{ borderRadius: "20px" }}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                categoryId === 1
                  ? "border-[#0F4C81] bg-blue-50/50 dark:bg-blue-950/40 text-[#0F4C81] dark:text-sky-300 ring-2 ring-[#0F4C81]/20"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Laptop className="w-5 h-5 mb-2 text-[#0F4C81] dark:text-sky-400" />
              <h4 className="font-bold text-sm sm:text-base">1. Teknologi & SaaS</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live Demo Sandbox</p>
            </button>

            <button
              type="button"
              onClick={() => setCategoryId(2)}
              style={{ borderRadius: "20px" }}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                categoryId === 2
                  ? "border-[#C5A059] bg-amber-50/50 dark:bg-amber-950/40 text-[#C5A059] ring-2 ring-[#C5A059]/20"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Cpu className="w-5 h-5 mb-2 text-[#C5A059]" />
              <h4 className="font-bold text-sm sm:text-base">2. Produk Fisik & IoT</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">3D Frame Scroll</p>
            </button>

            <button
              type="button"
              onClick={() => setCategoryId(3)}
              style={{ borderRadius: "20px" }}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                categoryId === 3
                  ? "border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-2 ring-slate-400/20"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Wrench className="w-5 h-5 mb-2 text-slate-600 dark:text-slate-300" />
              <h4 className="font-bold text-sm sm:text-base">3. Jasa Software</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Video Demo & SLA</p>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Nama Produk / Layanan *
              </label>
              <input
                type="text"
                required
                value={namaItem}
                onChange={(e) => setNamaItem(e.target.value)}
                placeholder="Contoh: SIM Laboratorium Vokasi Cerdas"
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Tagline Singkat *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Contoh: Platform Manajemen Inventaris & Peminjaman Alat Lab"
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Deskripsi Singkat *
            </label>
            <input
              type="text"
              required
              value={deskripsiSingkat}
              onChange={(e) => setDeskripsiSingkat(e.target.value)}
              placeholder="Deskripsi 1-2 kalimat untuk kartu katalog..."
              className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Deskripsi Lengkap & Latar Belakang Riset *
            </label>
            <textarea
              rows={3}
              required
              value={deskripsiLengkap}
              onChange={(e) => setDeskripsiLengkap(e.target.value)}
              placeholder="Penjelasan detail mengenai manfaat, arsitektur sistem, dan keunggulan untuk mitra DUDI..."
              style={{ borderRadius: "20px" }}
              className="w-full p-3.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059] leading-relaxed"
            />
          </div>
        </div>

        {/* Card 2: Foto Mockup & Live Demo (Elemen 1 & 2) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Foto Mockup & Tautan Live Demo / 3D
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <MediaUploader
                label="Foto Mockup Produk (Drag & Drop) *"
                description="Upload gambar resolusi tinggi (PNG, JPG, WEBP maks 5MB)"
                acceptedType="image"
                maxSizeMb={5}
                currentUrl={thumbnailUrl}
                onUploadSuccess={(url) => {
                  if (url) setThumbnailUrl(url);
                }}
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500">Pintasan Contoh:</span>
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("/images/catalog/rintisku-saas-showcase.jpg")}
                  style={{ borderRadius: "9999px" }}
                  className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:text-[#C5A059] font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  Mockup SaaS
                </button>
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("/images/sequence/robot-frame-01.jpg")}
                  style={{ borderRadius: "9999px" }}
                  className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:text-[#C5A059] font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  Mockup Robot
                </button>
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("/images/catalog/software-house-showcase.jpg")}
                  style={{ borderRadius: "9999px" }}
                  className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:text-[#C5A059] font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  Mockup Jasa
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <MediaUploader
                label="Video Demo / Walkthrough (Drag & Drop)"
                description="Upload video MP4/WEBM (Maks 50MB, durasi maks 2 menit)"
                acceptedType="video"
                maxSizeMb={50}
                maxDurationSeconds={120}
                currentUrl={liveDemoUrl && liveDemoUrl.match(/\.(mp4|webm)$/i) ? liveDemoUrl : undefined}
                onUploadSuccess={(url) => {
                  if (url) setLiveDemoUrl(url);
                }}
              />

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Atau URL Live Demo Sandbox / 3D Embed
                </label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://demo-aplikasi.vokasi.uns.ac.id"
                  className="w-full px-4 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#C5A059]"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Tautan web interaktif (iframe Sandbox) atau link embed Spline 3D.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Spesifikasi Teknis Dinamis (Elemen 4) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              3. Matriks Spesifikasi Teknis (Apple/Framework Style)
            </h3>
            <button
              type="button"
              onClick={handleAddSpec}
              style={{ borderRadius: "9999px" }}
              className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#0F4C81] dark:text-[#C5A059] border border-blue-200 dark:border-blue-900/40 hover:bg-blue-100 flex items-center gap-1.5 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {specs.map((spec, i) => (
              <div key={i} className="flex gap-2.5 items-center">
                <input
                  type="text"
                  placeholder="Grup (cth: Hardware)"
                  value={spec.group_name}
                  onChange={(e) => handleSpecChange(i, "group_name", e.target.value)}
                  style={{ borderRadius: "9999px" }}
                  className="w-1/4 px-3.5 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Kunci (cth: Prosesor)"
                  value={spec.spec_key}
                  onChange={(e) => handleSpecChange(i, "spec_key", e.target.value)}
                  style={{ borderRadius: "9999px" }}
                  className="w-1/3 px-3.5 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Nilai (cth: Intel Core i7 / Jetson Orin)"
                  value={spec.spec_value}
                  onChange={(e) => handleSpecChange(i, "spec_value", e.target.value)}
                  style={{ borderRadius: "9999px" }}
                  className="flex-1 px-3.5 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(i)}
                  style={{ borderRadius: "9999px" }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full cursor-pointer transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Harga & PIC Kontak (Elemen 5) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            4. Penetapan Harga & Kontak PIC Dosen / Mahasiswa
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Tipe Skema Harga *
              </label>
              <select
                value={hargaTipe}
                onChange={(e) => setHargaTipe(e.target.value as any)}
                style={{ borderRadius: "9999px" }}
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="starting_at">Mulai Dari (Starting At)</option>
                <option value="fixed">Harga Tetap (Fixed Unit)</option>
                <option value="contact_us">Penawaran Kustom (RFQ)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Nominal Harga (Rupiah) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={hargaNominal}
                onChange={(e) => setHargaNominal(Number(e.target.value))}
                style={{ borderRadius: "9999px" }}
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Status Publikasi
              </label>
              <select
                value={statusPublikasi}
                onChange={(e) => setStatusPublikasi(e.target.value as any)}
                style={{ borderRadius: "9999px" }}
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="published">Langsung Publikasikan (Live)</option>
                <option value="draft">Simpan sebagai Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Nama PIC Dosen / Mahasiswa *
              </label>
              <input
                type="text"
                required
                value={picNama}
                onChange={(e) => setPicNama(e.target.value)}
                placeholder="Dr. Nama Dosen / Mahasiswa"
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                No. WhatsApp PIC (Aktif) *
              </label>
              <input
                type="text"
                required
                value={picKontak}
                onChange={(e) => setPicKontak(e.target.value)}
                placeholder="6281234567890"
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Laboratorium Pelaksana
              </label>
              <input
                type="text"
                value={picLaboratorium}
                onChange={(e) => setPicLaboratorium(e.target.value)}
                placeholder="Lab Software / Embedded / Mekatronika"
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <Link
            href="/dashboard/prodi"
            style={{ borderRadius: "9999px" }} className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            style={{ borderRadius: "9999px" }}
            className={`w-full sm:w-auto px-7 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 ${
              isSuccess
                ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/30"
                : "bg-[#0F4C81] hover:bg-[#0A2540] text-white"
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                <span>Berhasil Didaftarkan!</span>
              </>
            ) : isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan Data...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan & Daftarkan Inovasi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
