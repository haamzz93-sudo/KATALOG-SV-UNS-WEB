"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Plus, Trash2, CheckCircle2, 
  Laptop, Cpu, Wrench, Save, GraduationCap,
  Camera, SlidersHorizontal, RefreshCw, Eye, Download, Check, UploadCloud, ChevronDown
} from "lucide-react";
import { api } from "../../../../lib/api";
import { useToast } from "../../../../context/ToastContext";
import { useApp } from "../../../../context/AppContext";
import { useSiteSettings } from "../../../../context/SiteSettingsContext";
import { MediaUploader } from "../../../../components/ui/MediaUploader";
import { SearchableProdiDropdown } from "../../../../components/ui/CustomCatalogSelect";
import { Prodi } from "../../../../types/catalog";
import { generateStudioMarketplacePhotos } from "../../../../lib/studioMarketplaceGenerator";

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

  // AI Studio Edit Foto State (4 Marketplace Photos)
  const AI_PRODUCT_CATEGORIES = [
    "PRODUK MAKANAN",
    "PRODUK MINUMAN",
    "PRODUK OBAT HERBAL",
    "PRODUK TEKNOLOGI",
    "PRODUK KIMIA",
    "PRODUK LAINNYA",
  ];

  const AI_DETAIL_TAGS = [
    "Detail Material",
    "Finishing Rapi",
    "Desain Presisi",
    "Tekstur Berkualitas",
    "Kemasan Premium",
    "Detail Fungsional",
  ];

  const AI_BENEFIT_HEADLINES = [
    "KENAPA PRODUK INI LAYAK DIPILIH?",
    "WHY YOU'LL LOVE IT",
  ];

  const DEFAULT_AI_PROMPT = "Pencahayaan studio komersial lembut, resolusi HD 8k, format portrait 3:4 (960x1280), clean minimalis, pertahankan keaslian warna, logo, dan identitas visual konsisten di seluruh 4 foto.";

  const getCleanPrompt = (val?: string) => {
    if (!val || val.includes("1280x720") || val.includes("landscape") || val.includes("16:9")) {
      return DEFAULT_AI_PROMPT;
    }
    return val;
  };

  const draftKey = `katalog_create_draft_${currentUser?.id || "anon"}`;
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [aiKategori, setAiKategori] = useState<string>("PRODUK MAKANAN");
  const [aiDetailLabels, setAiDetailLabels] = useState<string[]>([
    "Detail Material",
    "Finishing Rapi",
    "Desain Presisi",
  ]);
  const [aiBenefitHeadline, setAiBenefitHeadline] = useState<string>("KENAPA PRODUK INI LAYAK DIPILIH?");
  const [aiPrompt, setAiPrompt] = useState<string>(
    getCleanPrompt(settings.ai_default_prompt)
  );
  const [aiRawPhoto, setAiRawPhoto] = useState<string>("");
  const [aiRawPhotoBase64, setAiRawPhotoBase64] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPhotos, setAiPhotos] = useState<any[]>([]);

  // Clean dynamic specs (Bebas dari data dummy)
  const [specs, setSpecs] = useState([
    { group_name: "Spesifikasi Umum", spec_key: "", spec_value: "" }
  ]);

  const handleToggleDetailTag = (tag: string) => {
    if (aiDetailLabels.includes(tag)) {
      if (aiDetailLabels.length > 1) {
        setAiDetailLabels(aiDetailLabels.filter((t) => t !== tag));
      } else {
        toast.error("Minimal 1 Tag", "Pilih minimal satu karakter detail produk.");
      }
    } else {
      if (aiDetailLabels.length < 5) {
        setAiDetailLabels([...aiDetailLabels, tag]);
      } else {
        toast.info("Maksimal 5 Tag", "Maksimal 5 tag detail agar infografis tetap fokus.");
      }
    }
  };

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

  // 1. Restore draft per user account on initial load
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.namaItem !== undefined) setNamaItem(d.namaItem);
        if (d.tagline !== undefined) setTagline(d.tagline);
        if (d.deskripsiSingkat !== undefined) setDeskripsiSingkat(d.deskripsiSingkat);
        if (d.deskripsiLengkap !== undefined) setDeskripsiLengkap(d.deskripsiLengkap);
        if (d.prodiId !== undefined) setProdiId(d.prodiId);
        if (d.categoryId !== undefined) setCategoryId(d.categoryId);
        if (d.liveDemoUrl !== undefined) setLiveDemoUrl(d.liveDemoUrl);
        if (d.model3dUrl !== undefined) setModel3dUrl(d.model3dUrl);
        if (d.thumbnailUrl !== undefined) setThumbnailUrl(d.thumbnailUrl);
        if (d.statusPublikasi !== undefined) setStatusPublikasi(d.statusPublikasi);
        if (d.hargaTipe !== undefined) setHargaTipe(d.hargaTipe);
        if (d.hargaNominal !== undefined) setHargaNominal(d.hargaNominal);
        if (d.picNama !== undefined) setPicNama(d.picNama);
        if (d.picKontak !== undefined) setPicKontak(d.picKontak);
        if (d.picLaboratorium !== undefined) setPicLaboratorium(d.picLaboratorium);
        if (d.specs && Array.isArray(d.specs) && d.specs.length > 0) setSpecs(d.specs);
        if (d.isAiStudioOpen !== undefined) setIsAiStudioOpen(d.isAiStudioOpen);
        if (d.aiKategori !== undefined) setAiKategori(d.aiKategori);
        if (d.aiDetailLabels && Array.isArray(d.aiDetailLabels) && d.aiDetailLabels.length > 0) setAiDetailLabels(d.aiDetailLabels);
        if (d.aiBenefitHeadline !== undefined) setAiBenefitHeadline(d.aiBenefitHeadline);
        if (d.aiPrompt) setAiPrompt(getCleanPrompt(d.aiPrompt));
        if (d.aiRawPhoto !== undefined) setAiRawPhoto(d.aiRawPhoto);
        if (d.aiRawPhotoBase64 !== undefined) setAiRawPhotoBase64(d.aiRawPhotoBase64);
        if (d.aiPhotos && Array.isArray(d.aiPhotos) && d.aiPhotos.length > 0) setAiPhotos(d.aiPhotos);
        if (d.savedAt) setDraftSavedAt(d.savedAt);
        toast.info("Draft Dipulihkan", "Data formulir yang Anda input sebelumnya berhasil dimuat kembali.");
      }
    } catch (e) {
      console.warn("Gagal memuat draft formulir:", e);
    } finally {
      setIsDraftLoaded(true);
    }
  }, [draftKey]);

  // 2. Debounced auto-save draft to localStorage whenever form data changes
  useEffect(() => {
    if (!isDraftLoaded || typeof window === "undefined") return;

    const hasData =
      namaItem.trim() ||
      tagline.trim() ||
      deskripsiSingkat.trim() ||
      deskripsiLengkap.trim() ||
      thumbnailUrl ||
      aiRawPhoto ||
      (aiPhotos && aiPhotos.length > 0) ||
      liveDemoUrl.trim() ||
      picNama.trim();

    if (!hasData) return;

    const timer = setTimeout(() => {
      try {
        const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        const draftData = {
          prodiId,
          categoryId,
          namaItem,
          tagline,
          deskripsiSingkat,
          deskripsiLengkap,
          liveDemoUrl,
          model3dUrl,
          thumbnailUrl,
          statusPublikasi,
          hargaTipe,
          hargaNominal,
          picNama,
          picKontak,
          picLaboratorium,
          specs,
          isAiStudioOpen,
          aiKategori,
          aiDetailLabels,
          aiBenefitHeadline,
          aiPrompt,
          aiRawPhoto,
          aiRawPhotoBase64,
          aiPhotos,
          savedAt: now,
        };

        try {
          localStorage.setItem(draftKey, JSON.stringify(draftData));
          setDraftSavedAt(now);
        } catch (storageErr) {
          const safeDraft = {
            ...draftData,
            aiPhotos: [],
            aiRawPhotoBase64: "",
          };
          localStorage.setItem(draftKey, JSON.stringify(safeDraft));
          setDraftSavedAt(now);
        }
      } catch (err) {
        console.error("Gagal menyimpan auto-draft:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    isDraftLoaded,
    draftKey,
    prodiId,
    categoryId,
    namaItem,
    tagline,
    deskripsiSingkat,
    deskripsiLengkap,
    liveDemoUrl,
    model3dUrl,
    thumbnailUrl,
    statusPublikasi,
    hargaTipe,
    hargaNominal,
    picNama,
    picKontak,
    picLaboratorium,
    specs,
    isAiStudioOpen,
    aiKategori,
    aiDetailLabels,
    aiBenefitHeadline,
    aiPrompt,
    aiRawPhoto,
    aiRawPhotoBase64,
    aiPhotos,
  ]);

  const handleClearDraft = () => {
    if (confirm("Kosongkan isian formulir dan hapus draft akun ini?")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(draftKey);
      }
      setNamaItem("");
      setTagline("");
      setDeskripsiSingkat("");
      setDeskripsiLengkap("");
      setLiveDemoUrl("");
      setModel3dUrl("");
      setThumbnailUrl("");
      setStatusPublikasi("published");
      setHargaTipe("starting_at");
      setHargaNominal(0);
      setPicNama("");
      setPicKontak("");
      setPicLaboratorium("");
      setSpecs([{ group_name: "Spesifikasi Umum", spec_key: "", spec_value: "" }]);
      setAiRawPhoto("");
      setAiRawPhotoBase64("");
      setAiPhotos([]);
      setAiPrompt(DEFAULT_AI_PROMPT);
      setDraftSavedAt(null);
      toast.info("Draft Dikosongkan", "Formulir telah direset kembali.");
    }
  };

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

  const handleGenerateAiPhotos = async (forceAi = false) => {
    setAiLoading(true);
    const rawImg = aiRawPhotoBase64 || aiRawPhoto || (thumbnailUrl && !thumbnailUrl.startsWith("blob:") ? thumbnailUrl : undefined);

    if (!rawImg && !forceAi) {
      toast.info(
        "Unggah Foto Produk Terlebih Dahulu",
        "Silakan unggah foto produk mentah pada bagian 1 di atas agar 4 foto marketplace presisi dapat dihasilkan."
      );
      setAiLoading(false);
      return;
    }

    // 1. Prioritaskan Backend Photoroom AI → OpenAI DALL-E → Pollinations fallback
    if (rawImg || forceAi) {
      try {
        const API_BASE = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1");
        const payload = {
          apiKey: settings.gemini_api_key,
          openaiApiKey: settings.openai_api_key,
          photoroom_api_key: settings.photoroom_api_key || "sandbox_sk_pr_kataloguns_1dba88ad21d6609f8fd00ac6058273fae7de8253",
          namaItem: namaItem.trim() || "Produk Inovasi Vokasi UNS",
          tagline: tagline.trim() || undefined,
          kategori: aiKategori,
          detailLabels: aiDetailLabels,
          benefitHeadline: aiBenefitHeadline,
          rawImageBase64: rawImg,
          customPrompt: aiPrompt,
        };

        let res = await fetch(`${API_BASE}/public/ai/catalog-photo`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          res = await fetch("/api/ai/catalog-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
        }

        if (res.ok) {
          const data = await res.json();
          if (data.success && (data.data?.photos || data.photos)) {
            const resultPhotos = data.data?.photos || data.photos;
            setAiPhotos(resultPhotos);
            const engine = data.data?.engine || "";
            const toastMsg =
              engine === "photoroom_ai"
                ? "Foto produk fotorealistik dihasilkan dengan Photoroom AI!"
                : engine === "openai_dalle"
                ? "4 foto marketplace HD dihasilkan dengan OpenAI DALL-E!"
                : "4 foto katalog standar marketplace profesional berhasil diproses!";
            toast.success("4 Foto Marketplace Siap!", toastMsg);
            setAiLoading(false);
            return;
          }
        }
      } catch (backendErr) {
        console.warn("Backend AI call error, falling back to local studio generator:", backendErr);
      }
    }


    // 2. Fallback Studio Komposisi Produk Asli Presisi (Local Canvas Generator)
    if (rawImg && !forceAi) {
      try {
        const studioPhotos = await generateStudioMarketplacePhotos({
          imageSrc: rawImg,
          namaItem: namaItem.trim() || "Produk Inovasi Vokasi UNS",
          kategori: aiKategori,
          detailTags: aiDetailLabels,
          benefitHeadline: aiBenefitHeadline,
        });

        setAiPhotos(studioPhotos);
        toast.success(
          "4 Foto Marketplace Siap!",
          "Produk asli Anda berhasil dikomposisikan ke 4 standar marketplace HD (Hero, Macro Detail, Infografis, Lifestyle) secara presisi 100%!"
        );
      } catch (err: any) {
        console.error("Studio generator error:", err);
        toast.error(
          "Gagal Komposisi Studio Foto",
          err?.message || "Terjadi kendala saat memproses gambar produk mentah."
        );
      } finally {
        setAiLoading(false);
      }
      return;
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
        thumbnail_url: thumbnailUrl && !thumbnailUrl.startsWith("blob:") ? thumbnailUrl : "/images/brand/slogan-poster-vokasi.jpg",
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
        if (typeof window !== "undefined") {
          localStorage.removeItem(draftKey);
        }
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

      <div className="flex flex-wrap items-center justify-between gap-3 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Tambah Produk Inovasi Baru
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Lengkapi data produk sesuai standar 5 Elemen (Mockup, Demo, Nama, Spesifikasi Teknis, Harga).
          </p>
        </div>

        {/* Auto-Save Draft Status Per Akun */}
        <div className="flex items-center gap-2">
          {draftSavedAt && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Draft tersimpan ({draftSavedAt})</span>
            </div>
          )}
          {draftSavedAt && (
            <button
              type="button"
              onClick={handleClearDraft}
              title="Kosongkan formulir dan hapus draft akun ini"
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>
          )}
        </div>
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
                onUploadSuccess={(url, info) => {
                  if (url) setThumbnailUrl(url);
                  if (info?.dataUrl) {
                    setAiRawPhotoBase64(info.dataUrl);
                    if (!aiRawPhoto) setAiRawPhoto(url);
                  }
                }}
              />
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

          {/* AI STUDIO EDIT FOTO KATALOG (GEMINI AI) - FULL WIDTH */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <button
                  type="button"
                  onClick={() => setIsAiStudioOpen(!isAiStudioOpen)}
                  style={{ borderRadius: "9999px" }}
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-500/15 to-[#0F4C81]/15 hover:from-amber-500/25 hover:to-[#0F4C81]/25 text-[#0F4C81] dark:text-amber-300 font-extrabold text-xs border border-amber-400/40 dark:border-amber-500/30 flex items-center justify-between transition cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-500" />
                    <span>Studio Foto Visual Katalog (Multi-Angle Studio)</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isAiStudioOpen ? "rotate-180" : ""}`} />
                </button>

                {isAiStudioOpen && (
                  <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-amber-400/30 dark:border-amber-500/20 space-y-4 text-left shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Generator 4 Foto Marketplace Komersial (Format Portrait 3:4)</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold">
                        Target: {settings.ai_default_domain || "spsbu.unsmadiun.id"}
                      </span>
                    </div>

                    {/* Aturan Identitas Visual Konsisten */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-[11px] text-amber-800 dark:text-amber-300">
                      <strong>Standar 4 Foto Marketplace:</strong> Menghasilkan 1 set komplit (1. Foto Utama / Hero, 2. Detail & Kualitas Macro, 3. Infografis Fitur & Alasan Membeli, 4. Konteks Lifestyle) dengan visual identity, warna, logo, dan pencahayaan studio yang konsisten.
                    </div>

                    {/* 1. Tambah Foto Mentah (Raw Photo) */}
                    <div>
                      <MediaUploader
                        label="1. Unggah Foto Mentah Produk (Opsional / Rekomendasi)"
                        description="Upload foto produk asli/mentah dari lab atau handphone untuk dianalisis oleh AI Studio"
                        acceptedType="image"
                        maxSizeMb={5}
                        currentUrl={aiRawPhoto}
                        onUploadSuccess={(url, info) => {
                          if (url) setAiRawPhoto(url);
                          if (info?.dataUrl) setAiRawPhotoBase64(info.dataUrl);
                        }}
                      />
                    </div>

                    {/* 2. PROMT CEKBOK JENIS PRODUK */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        2. Pilih Jenis Produk:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {AI_PRODUCT_CATEGORIES.map((cat) => {
                          const isSelected = aiKategori === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setAiKategori(cat)}
                              style={{ borderRadius: "14px" }}
                              className={`p-2.5 text-xs font-bold transition border flex items-center justify-between px-3 cursor-pointer text-left ${
                                isSelected
                                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs ring-2 ring-[#0F4C81]/30"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              <span className="truncate">{cat}</span>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-white bg-[#C5A059]" : "border-slate-400"
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Pilihan Tag Karakter Detail (Foto 2 - Detail & Craftsmanship) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          3. Tag Karakter Detail & Kualitas (Foto 2 Macro Shot):
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Pilih 1–5 karakter terlihat
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {AI_DETAIL_TAGS.map((tag) => {
                          const isChecked = aiDetailLabels.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleDetailTag(tag)}
                              style={{ borderRadius: "9999px" }}
                              className={`px-3 py-1.5 text-xs font-bold transition border flex items-center gap-1.5 cursor-pointer ${
                                isChecked
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-600/30"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 ${
                                isChecked ? "bg-white text-emerald-600" : "border border-slate-400"
                              }`}>
                                {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span>{tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Headline Infografis Keunggulan (Foto 3 - Benefit Infographic) */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        4. Headline Infografis Keunggulan (Foto 3 Infografis):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {AI_BENEFIT_HEADLINES.map((hl) => {
                          const isSelected = aiBenefitHeadline === hl;
                          return (
                            <button
                              key={hl}
                              type="button"
                              onClick={() => setAiBenefitHeadline(hl)}
                              style={{ borderRadius: "14px" }}
                              className={`p-2.5 text-xs font-bold transition border flex items-center gap-2 cursor-pointer text-left ${
                                isSelected
                                  ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-xs ring-2 ring-[#0F4C81]/30"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-white bg-[#C5A059]" : "border-slate-400"
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <span className="truncate">{hl}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. Detail Identitas Produk */}
                    <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        5. Identitas Produk Terkoneksi:
                      </span>
                      <div className="text-xs text-slate-800 dark:text-slate-200 space-y-1">
                        <div>
                          <strong className="text-slate-600 dark:text-slate-400">Nama Produk:</strong>{" "}
                          <span>{namaItem.trim() || "(Belum diisi - akan gunakan nama default)"}</span>
                        </div>
                        {tagline && (
                          <div>
                            <strong className="text-slate-600 dark:text-slate-400">Tagline:</strong>{" "}
                            <span>{tagline.trim()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 6. Prompt Dinamis (Editable) */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        6. Catatan Prompt Dinamis & Permintaan Khusus:
                      </label>
                      <textarea
                        rows={2}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        style={{ borderRadius: "14px" }}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                      />
                    </div>

                    {/* 5. Tombol Generate */}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleGenerateAiPhotos(false)}
                        disabled={aiLoading}
                        style={{ borderRadius: "9999px" }}
                        className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-amber-500 via-[#C5A059] to-[#0F4C81] hover:brightness-105 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : ""}`} />
                        <span>{aiLoading ? "Memproses 4 Foto Marketplace..." : "Hasilkan 4 Foto Marketplace (100% Produk Asli Presisi)"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGenerateAiPhotos(true)}
                        disabled={aiLoading}
                        style={{ borderRadius: "9999px" }}
                        title="Hasilkan variasi visual alternatif menggunakan Google Gemini 2.5 Flash"
                        className="py-3 px-4 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sintesis AI (Gemini)</span>
                      </button>
                    </div>

                    {/* 6. Hasil 4 Foto Produk */}
                    {aiPhotos.length > 0 && (
                      <div className="pt-2 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            4 Foto Marketplace Siap Digunakan (Klik untuk Memilih Mockup Utama):
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Format Marketplace Portrait (3:4)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {aiPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              style={{ borderRadius: "20px" }}
                              className={`p-3 border transition-all duration-200 flex flex-col justify-between shadow-xs ${
                                thumbnailUrl === photo.url
                                  ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/40 shadow-sm"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-amber-400"
                              }`}
                            >
                              <div>
                                <div className="relative w-full aspect-[3/4] min-h-[190px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950/80 mb-2.5 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60">
                                  <img
                                    src={photo.url}
                                    alt={photo.title}
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      const currentSrc = target.src;
                                      if (!currentSrc.includes("retry=2")) {
                                        const retryCount = currentSrc.includes("retry=1") ? "retry=2" : "retry=1";
                                        setTimeout(() => {
                                          target.src = photo.url + (photo.url.includes("?") ? "&" : "?") + retryCount;
                                        }, 1200);
                                      }
                                    }}
                                  />
                                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-xs text-[9.5px] font-bold text-white shadow-xs z-10">
                                    {photo.angle || photo.badge}
                                  </span>
                                </div>
                                <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate mb-1">
                                  {photo.title}
                                </h5>
                                {photo.desc && (
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 mb-2.5">
                                    {photo.desc}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 mt-auto">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setThumbnailUrl(photo.url);
                                    toast.success("Foto Dipilih", `Foto "${photo.title}" dijadikan sebagai mockup produk.`);
                                  }}
                                  style={{ borderRadius: "9999px" }}
                                  className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                                    thumbnailUrl === photo.url
                                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                      : "bg-[#0F4C81] text-white hover:bg-[#135996]"
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{thumbnailUrl === photo.url ? "Terpilih" : "Gunakan"}</span>
                                </button>
                                <a
                                  href={photo.url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  download
                                  style={{ borderRadius: "9999px" }}
                                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                                  title="Buka / Unduh HD Portrait 3:4 (960x1280)"
                                >
                                  <Download className="w-3.5 h-3.5" />
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
