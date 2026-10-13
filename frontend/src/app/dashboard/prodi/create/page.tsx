"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Plus, Trash2, CheckCircle2, 
  Laptop, Cpu, Wrench, Save, GraduationCap,
  Wand2, Bot, RefreshCw, Eye, Download, Check, UploadCloud, ChevronDown
} from "lucide-react";
import { api } from "../../../../lib/api";
import { useToast } from "../../../../context/ToastContext";
import { useApp } from "../../../../context/AppContext";
import { useSiteSettings } from "../../../../context/SiteSettingsContext";
import { MediaUploader } from "../../../../components/ui/MediaUploader";
import { SearchableProdiDropdown } from "../../../../components/ui/CustomCatalogSelect";
import { Prodi } from "../../../../types/catalog";

export default function CreateProdiItem() {
  const router = useRouter();
  const toast = useToast();
  const { currentUser } = useApp();
  const { settings } = useSiteSettings();

  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [prodiId, setProdiId] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [namaItem, setNamaItem] = useState("");
  const [tagline, setTagline] = useState("");
  const [deskripsiSingkat, setDeskripsiSingkat] = useState("");
  const [deskripsiLengkap, setDeskripsiLengkap] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [model3dUrl, setModel3dUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [statusPublikasi, setStatusPublikasi] = useState<"draft" | "published">("published");
  const [hargaTipe, setHargaTipe] = useState<"starting_at" | "fixed" | "contact_us">("starting_at");
  const [hargaNominal, setHargaNominal] = useState<number>(0);
  const [picNama, setPicNama] = useState("");
  const [picKontak, setPicKontak] = useState("");
  const [picLaboratorium, setPicLaboratorium] = useState("");

  // AI Studio Edit Foto State (Gemini AI)
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [aiJenis, setAiJenis] = useState<"produk" | "teknologi" | "layanan">("produk");
  const [aiSubJenis, setAiSubJenis] = useState("Makanan");
  const [aiPrompt, setAiPrompt] = useState(
    settings.ai_default_prompt ||
      "Tolong buatkan gambar dinamis ukuran landscape (1280x720 pixel), produk untuk display katalog produk pada marketplace. Pastikan hasilnya menjadi produk bagus, dinamis, kualitas HD, layak jual. Desain clean, tidak terlalu banyak kalimat."
  );
  const [aiRawPhoto, setAiRawPhoto] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPhotos, setAiPhotos] = useState<any[]>([]);

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

  // Clean dynamic specs (Bebas dari data dummy)
  const [specs, setSpecs] = useState([
    { group_name: "Spesifikasi Umum", spec_key: "", spec_value: "" }
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

  const handleGenerateAiPhotos = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/catalog-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: settings.gemini_api_key,
          jenis: aiJenis,
          subJenis: aiSubJenis,
          rawImageBase64: aiRawPhoto || thumbnailUrl || undefined,
          customPrompt: aiPrompt,
          namaItem: namaItem.trim() || "Produk Inovasi Vokasi UNS",
          domain: settings.ai_default_domain || "spsbu.unsmadiun.id",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data?.photos) {
        setAiPhotos(data.data.photos);
        toast.success("Foto AI Siap", "3 sudut foto produk katalog kualitas HD berhasil dihasilkan!");
      } else {
        toast.error("Gagal AI Studio", data.message || "Gagal memproses gambar");
      }
    } catch (e: any) {
      toast.error("Error AI Studio", e.message || "Terjadi kesalahan koneksi");
    } finally {
      setAiLoading(false);
    }
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
              <h4 className="font-bold text-sm sm:text-base">1. Teknologi & Digital</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Aplikasi, AI, SaaS & Web</p>
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
              <h4 className="font-bold text-sm sm:text-base">2. Produk Inovasi & Riset</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pangan, Herbal, Mesin & Fisik</p>
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
              <h4 className="font-bold text-sm sm:text-base">3. Jasa & Layanan Keahlian</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Konsultasi, Uji Lab & Pelatihan</p>
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
            2. Foto Mockup & Tautan Live Demo / 3D (Opsional)
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
              {/* AI STUDIO EDIT FOTO KATALOG (GEMINI AI) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAiStudioOpen(!isAiStudioOpen)}
                  style={{ borderRadius: "9999px" }}
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-500/15 to-[#0F4C81]/15 hover:from-amber-500/25 hover:to-[#0F4C81]/25 text-[#0F4C81] dark:text-amber-300 font-extrabold text-xs border border-amber-400/40 dark:border-amber-500/30 flex items-center justify-between transition cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-amber-500" />
                    <span>✨ AI Studio: Edit & Generate Foto Katalog (Gemini AI)</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isAiStudioOpen ? "rotate-180" : ""}`} />
                </button>

                {isAiStudioOpen && (
                  <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-amber-400/30 dark:border-amber-500/20 space-y-4 text-left shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <Bot className="w-4 h-4" />
                        <span>Generator 3 Foto Multi-Sudut (HD Landscape)</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold">
                        Domain: {settings.ai_default_domain || "spsbu.unsmadiun.id"}
                      </span>
                    </div>

                    {/* 1. Tambah Foto Mentah (Raw Photo) */}
                    <div>
                      <MediaUploader
                        label="1. Tambah Foto Mentah Produk (Opsional untuk AI Visual Enhancer)"
                        description="Upload foto produk asli/mentah dari lab atau handphone"
                        acceptedType="image"
                        maxSizeMb={5}
                        currentUrl={aiRawPhoto}
                        onUploadSuccess={(url) => {
                          if (url) setAiRawPhoto(url);
                        }}
                      />
                    </div>

                    {/* 2. Pilihan Jenis */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        2. Pilih Jenis Inovasi:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["produk", "teknologi", "layanan"] as const).map((j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => {
                              setAiJenis(j);
                              if (j === "produk") setAiSubJenis("Makanan");
                              else if (j === "teknologi") setAiSubJenis("Mesin");
                              else setAiSubJenis("Konsultasi");
                            }}
                            style={{ borderRadius: "9999px" }}
                            className={`py-1.5 px-3 rounded-full text-xs font-bold capitalize transition border cursor-pointer ${
                              aiJenis === j
                                ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {j}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Pilihan Sub-Jenis Sesuai Instruksi Dosen */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        3. Kategori Spesifik ({aiJenis}):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {aiJenis === "produk" && (
                          ["Makanan", "Minuman", "Obat", "Kosmetik", "Hasil Pertanian", "Animasi"].map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setAiSubJenis(sub)}
                              style={{ borderRadius: "9999px" }}
                              className={`py-1 px-3 rounded-full text-[11px] font-bold transition border cursor-pointer ${
                                aiSubJenis === sub
                                  ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {sub}
                            </button>
                          ))
                        )}

                        {aiJenis === "teknologi" && (
                          ["Mesin", "IoT", "Software As A Service"].map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setAiSubJenis(sub)}
                              style={{ borderRadius: "9999px" }}
                              className={`py-1 px-3 rounded-full text-[11px] font-bold transition border cursor-pointer ${
                                aiSubJenis === sub
                                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {sub}
                            </button>
                          ))
                        )}

                        {aiJenis === "layanan" && (
                          ["Konsultasi", "Pelatihan", "Uji Lab", "Preservasi"].map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setAiSubJenis(sub)}
                              style={{ borderRadius: "9999px" }}
                              className={`py-1 px-3 rounded-full text-[11px] font-bold transition border cursor-pointer ${
                                aiSubJenis === sub
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {sub}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* 4. Prompt Dinamis (Editable) */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        4. Prompt Dinamis (Dapat Diedit):
                      </label>
                      <textarea
                        rows={3}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        style={{ borderRadius: "14px" }}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                      />
                    </div>

                    {/* 5. Tombol Generate */}
                    <button
                      type="button"
                      onClick={handleGenerateAiPhotos}
                      disabled={aiLoading}
                      style={{ borderRadius: "9999px" }}
                      className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-[#0F4C81] hover:from-amber-600 hover:to-[#135996] text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : ""}`} />
                      <span>{aiLoading ? "Memproses 3 Foto AI..." : "Proses AI: Hasilkan 3 Foto HD (Tampak Depan, Samping & Display)"}</span>
                    </button>

                    {/* 6. Hasil 3 Foto Produk */}
                    {aiPhotos.length > 0 && (
                      <div className="pt-2 space-y-3">
                        <span className="text-xs font-black text-slate-900 dark:text-white block border-b border-slate-200 dark:border-slate-800 pb-1">
                          📸 Hasil Foto AI (Klik untuk Memilih Mockup Utama):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {aiPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              className={`rounded-2xl p-2 border transition ${
                                thumbnailUrl === photo.url
                                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400"
                              }`}
                            >
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-2">
                                <img
                                  src={photo.url}
                                  alt={photo.title}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-bold text-white">
                                  {photo.angle}
                                </span>
                              </div>
                              <h5 className="font-bold text-[11px] text-slate-900 dark:text-white truncate mb-2">
                                {photo.title}
                              </h5>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setThumbnailUrl(photo.url);
                                    toast.success("Foto Dipilih", `Foto "${photo.title}" dijadikan sebagai mockup produk.`);
                                  }}
                                  style={{ borderRadius: "9999px" }}
                                  className={`flex-1 py-1 px-2 rounded-full text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                                    thumbnailUrl === photo.url
                                      ? "bg-emerald-600 text-white"
                                      : "bg-[#0F4C81] text-white hover:bg-[#135996]"
                                  }`}
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{thumbnailUrl === photo.url ? "Terpilih" : "Gunakan"}</span>
                                </button>
                                <a
                                  href={photo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  style={{ borderRadius: "9999px" }}
                                  className="p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500"
                                  title="Buka / Unduh HD"
                                >
                                  <Download className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
