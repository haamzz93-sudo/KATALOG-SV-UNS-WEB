"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Plus, Trash2, CheckCircle2, 
  Laptop, Cpu, Wrench, Save, GraduationCap,
  Camera, SlidersHorizontal, RefreshCw, Eye, Download, Check, UploadCloud, ChevronDown,
  Maximize2, X, ChevronLeft, ChevronRight, Info, Images
} from "lucide-react";
import { api } from "../../../../lib/api";
import { useToast } from "../../../../context/ToastContext";
import { useApp } from "../../../../context/AppContext";
import { useSiteSettings } from "../../../../context/SiteSettingsContext";
import { MediaUploader } from "../../../../components/ui/MediaUploader";
import { SearchableProdiDropdown } from "../../../../components/ui/CustomCatalogSelect";
import { Prodi } from "../../../../types/catalog";
import {
  loadImage,
  isolateProductForeground,
  generateHeroPhoto,
  generateDetailPhoto,
  generateBenefitPhoto,
  generateLifestylePhoto,
  generateBackViewPhoto,
} from "../../../../lib/studioMarketplaceGenerator";

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

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
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
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

  const AI_ANGLE_OPTIONS = [
    {
      id: "front",
      label: "Sisi Depan / Hero (Front View)",
      badge: "Utama",
      desc: "Menampilkan muka produk, logo, dan identitas brand secara presisi & simetris.",
    },
    {
      id: "right_side",
      label: "Sisi Samping Kanan (3/4 Perspective)",
      badge: "Rekomendasi 3D",
      desc: "Menonjolkan kedalaman fisik 3D, ketebalan kemasan/alat, dan detail estetika samping.",
    },
    {
      id: "back",
      label: "Sisi Belakang Produk (Back View)",
      badge: "Info Lengkap",
      desc: "Menampilkan informasi legalitas/komposisi, nutrisi faktual, izin edar, barcode, atau port belakang.",
    },
    {
      id: "left_side",
      label: "Sisi Samping Kiri (Left Profile)",
      badge: "Alternatif",
      desc: "Menampilkan sudut profil samping kiri untuk produk berkarakter asimetris.",
    },
  ];

  const AI_BENEFIT_HEADLINES = [
    {
      id: "KENAPA PRODUK INI LAYAK DIPILIH?",
      title: "KENAPA PRODUK INI LAYAK DIPILIH?",
      lang: "Bahasa Indonesia",
      badge: "Pasar Domestik & B2B / Kemitraan DUDI",
      desc: "Format formal & persuasif untuk inovasi teknologi terapan, riset kampus, alat mesin, dan produk herbal. Menekankan legalitas, efisiensi kerja, dan keunggulan teknis faktual.",
    },
    {
      id: "WHY YOU'LL LOVE IT",
      title: "WHY YOU'LL LOVE IT",
      lang: "Bahasa Inggris",
      badge: "Modern Lifestyle, F&B & Ekspor",
      desc: "Format modern & ramah konsumen (consumer-centric) untuk produk ritel, F&B, fashion, skincare, dan suvenir. Menekankan kenikmatan rasa, estetika desain, dan kepuasan harian.",
    },
  ];

  const DEFAULT_AI_PROMPT = "Pencahayaan studio komersial lembut, resolusi Ultra HD 8K super tajam (razor-sharp focus), format portrait 3:4 (960x1280), sudut 3/4 komersial memperlihatkan sisi depan dan sisi samping kanan produk, clean minimalis, bebas blur, pertahankan keaslian warna, logo, dan identitas visual konsisten di seluruh foto.";

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
  const [aiSelectedAngles, setAiSelectedAngles] = useState<string[]>([
    "Sisi Depan / Hero (Front View)",
    "Sisi Samping Kanan (3/4 Perspective)",
  ]);
  const [aiBenefitHeadline, setAiBenefitHeadline] = useState<string>("KENAPA PRODUK INI LAYAK DIPILIH?");
  const [aiPrompt, setAiPrompt] = useState<string>(
    getCleanPrompt(settings.ai_default_prompt)
  );
  const [aiRawPhoto, setAiRawPhoto] = useState<string>("");
  const [aiRawPhotoBase64, setAiRawPhotoBase64] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [stepMessage, setStepMessage] = useState<string>("");
  const [aiPhotos, setAiPhotos] = useState<any[]>([]);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<any | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(0);

  // Kunci scroll halaman saat modal lightbox aktif agar tidak tembus
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (fullscreenPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [fullscreenPhoto]);

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

  const handleToggleAngle = (angleLabel: string) => {
    if (aiSelectedAngles.includes(angleLabel)) {
      if (aiSelectedAngles.length > 1) {
        setAiSelectedAngles(aiSelectedAngles.filter((a) => a !== angleLabel));
      } else {
        toast.error("Minimal 1 Sudut", "Pilih minimal satu sudut pemotretan produk.");
      }
    } else {
      setAiSelectedAngles([...aiSelectedAngles, angleLabel]);
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
        if (d.thumbnailUrl !== undefined) setThumbnailUrl(d.thumbnailUrl);
        if (d.galleryImages && Array.isArray(d.galleryImages)) setGalleryImages(d.galleryImages);
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
      (galleryImages && galleryImages.length > 0) ||
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
          galleryImages,
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
    galleryImages,
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
      setGalleryImages([]);
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

  const handleGenerateAiPhotos = async () => {
    const rawImg = aiRawPhotoBase64 || aiRawPhoto || (thumbnailUrl && !thumbnailUrl.startsWith("blob:") ? thumbnailUrl : undefined);

    if (!rawImg) {
      toast.info(
        "Unggah Foto Produk Terlebih Dahulu",
        "Silakan unggah foto produk mentah pada bagian 1 di atas agar 4 foto marketplace presisi dapat dihasilkan."
      );
      return;
    }

    setAiLoading(true);
    setAiPhotos([]);
    setGenerationStep(1);
    setStepMessage("Menganalisis objek produk dan mengisolasi latar belakang studio...");

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Coba terlebih dahulu backend jika OpenAI atau Photoroom aktif
    const hasPaidKey = !!(settings.openai_api_key && settings.openai_api_key.trim());
    if (hasPaidKey) {
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
          selectedAngles: aiSelectedAngles,
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
            const rawPhotos = data.data?.photos || data.photos;
            // Animasi satu persatu memunculkan foto dari backend
            const accumulated: any[] = [];
            for (let i = 0; i < rawPhotos.length; i++) {
              setGenerationStep(i + 1);
              setStepMessage(`Langkah ${i + 1}/4: Merender ${rawPhotos[i].title}...`);
              accumulated.push(rawPhotos[i]);
              setAiPhotos([...accumulated]);
              await delay(600);
            }
            setGenerationStep(5);
            setStepMessage("Selesai! 4 Foto Marketplace Komersial Berhasil Dihasilkan.");
            toast.success("4 Foto Marketplace Siap!", "4 foto katalog berhasil dihasilkan sesuai setting prompt paten.");
            setAiLoading(false);
            return;
          }
        }
      } catch (backendErr) {
        console.warn("Backend AI call, proceeding to sequential studio engine:", backendErr);
      }
    }

    // Engine Studio Visual Presisi Sekuensial (Foto 1 -> 2 -> 3 -> 4)
    try {
      // 1. Muat & Isolasi Background
      const img = await loadImage(rawImg);
      const isolatedImg = isolateProductForeground(img);
      await delay(450);

      const sequentialPhotos: any[] = [];

      // Step 1: Foto Utama (Hero Marketplace)
      setGenerationStep(1);
      setStepMessage("Langkah 1/4: Merender Foto Utama (Hero Product Photography)...");
      const heroUrl = generateHeroPhoto(isolatedImg, namaItem.trim() || "Produk Inovasi Vokasi UNS", aiKategori);
      const heroPhoto = {
        id: "hero",
        title: "1. Foto Utama (Hero Marketplace)",
        angle: "Foto Utama",
        badge: "Hero Product",
        desc: "Fokus utama produk asli di atas podium studio putih ivory bersih, pencahayaan lembut, proporsi portrait 3:4 rapi.",
        url: heroUrl,
        directUrl: heroUrl,
      };
      sequentialPhotos.push(heroPhoto);
      setAiPhotos([...sequentialPhotos]);
      await delay(700);

      // Step 2: Sisi Samping Produk (3/4 Perspective) & Detail Kualitas
      setGenerationStep(2);
      setStepMessage("Langkah 2/4: Memproses Sisi Samping Produk (3/4 Perspective) & Detail Finishing...");
      const detailUrl = generateDetailPhoto(isolatedImg, aiDetailLabels);
      const detailPhoto = {
        id: "detail",
        title: "2. Sisi Samping & Detail Kualitas (3/4 Perspective)",
        angle: "Sisi Samping 3/4",
        badge: "3/4 Side Angle",
        desc: "Sudut 3/4 komersial memperlihatkan sisi samping, ketebalan fisik 3D, dan kerapian finishing kemasan asli.",
        url: detailUrl,
        directUrl: detailUrl,
      };
      sequentialPhotos.push(detailPhoto);
      setAiPhotos([...sequentialPhotos]);
      await delay(700);

      // Step 3: Sisi Belakang Produk (Back View) ATAU Infografis Keunggulan
      setGenerationStep(3);
      const isBackSelected = aiSelectedAngles.some((a) => a.toLowerCase().includes("belakang") || a.toLowerCase().includes("back"));
      
      let benefitUrl: string;
      let benefitPhoto: any;

      if (isBackSelected) {
        setStepMessage("Langkah 3/4: Membangun Foto Sisi Belakang (Back View & Inspeksi Legalitas)...");
        benefitUrl = generateBackViewPhoto(isolatedImg, namaItem.trim() || "Produk Inovasi Vokasi UNS", aiKategori);
        benefitPhoto = {
          id: "back_view",
          title: "3. Sisi Belakang Produk (Back View Inspection)",
          angle: "Sisi Belakang",
          badge: "Back View",
          desc: "Inspeksi sisi belakang produk: label legalitas kemasan, jaminan mutu laboratorium, komposisi asli, dan barcode hilirisasi.",
          url: benefitUrl,
          directUrl: benefitUrl,
        };
      } else {
        setStepMessage("Langkah 3/4: Menyusun Infografis Fitur & Alasan Membeli...");
        benefitUrl = generateBenefitPhoto(isolatedImg, aiBenefitHeadline, namaItem.trim() || "Produk Inovasi Vokasi UNS", aiKategori);
        benefitPhoto = {
          id: "benefit",
          title: "3. Keunggulan & Fitur (Infografis)",
          angle: "Alasan Membeli",
          badge: "Infografis Komersial",
          desc: "Tata letak infografis portrait menyajikan headline dan 3 poin keunggulan utama produk inovasi.",
          url: benefitUrl,
          directUrl: benefitUrl,
        };
      }
      sequentialPhotos.push(benefitPhoto);
      setAiPhotos([...sequentialPhotos]);
      await delay(700);

      // Step 4: Konteks Penggunaan Nyata (Lifestyle)
      setGenerationStep(4);
      setStepMessage("Langkah 4/4: Membangun Konteks Penggunaan Nyata (Lifestyle Context)...");
      const lifestyleUrl = generateLifestylePhoto(isolatedImg, aiKategori);
      const lifestylePhoto = {
        id: "lifestyle",
        title: "4. Konteks Penggunaan (Lifestyle)",
        angle: "Konteks Real Use",
        badge: "Lifestyle Tabletop",
        desc: "Fotografi kontekstual produk asli di atas meja kayu hangat dengan pencahayaan pagi estetik.",
        url: lifestyleUrl,
        directUrl: lifestyleUrl,
      };
      sequentialPhotos.push(lifestylePhoto);
      setAiPhotos([...sequentialPhotos]);
      await delay(500);

      // Selesai
      setGenerationStep(5);
      setStepMessage("Selesai! 4 Foto Marketplace Komersial Berhasil Dihasilkan.");
      toast.success(
        "4 Foto Marketplace Siap!",
        "4 foto marketplace (Hero, Macro Detail, Infografis, Lifestyle) berhasil dihasilkan berurutan secara presisi 100%!"
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
        harga_nominal: hargaTipe === "contact_us" ? (hargaNominal || 0) : (hargaNominal || 0),
        pic_nama: picNama,
        pic_kontak: picKontak,
        pic_laboratorium: picLaboratorium,
        specs: specs.filter((s) => s.spec_key.trim() !== ""),
        media: [
          ...(thumbnailUrl && !thumbnailUrl.startsWith("blob:") ? [{
            file_url: thumbnailUrl,
            media_type: "image",
            is_primary: true,
            caption: namaItem || "Foto Mockup Utama",
          }] : []),
          ...galleryImages.filter(g => g.url && !g.url.startsWith("blob:")).map((g, idx) => ({
            file_url: g.url,
            media_type: "image",
            is_primary: false,
            caption: g.caption || `Foto Tambahan #${idx + 2}`,
          })),
        ],
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

        {/* Auto-Save Draft Status & Hapus Semua Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {draftSavedAt && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Draft tersimpan ({draftSavedAt})</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleClearDraft}
            title="Kosongkan seluruh isian formulir, foto mockup, dan draft akun ini"
            style={{ borderRadius: "9999px" }}
            className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua Isian (Reset Draft)</span>
          </button>
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
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                1. Klasifikasi 3 Lini Layanan & Identitas Produk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {settings.services_subtitle || "Produk unggulan hasil riset terapan dan implementasi project based learning"}
              </p>
            </div>
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
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                categoryId === 1
                  ? "border-[#0F4C81] bg-blue-50/50 dark:bg-blue-950/40 text-[#0F4C81] dark:text-sky-300 ring-2 ring-[#0F4C81]/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Laptop className="w-5 h-5 text-[#0F4C81] dark:text-sky-400" />
                  {settings.service_1_badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0F4C81] dark:text-sky-300 border border-blue-200/50 dark:border-blue-700/50">
                      {settings.service_1_badge}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm sm:text-base leading-snug">
                  {settings.service_1_title || "1. Teknologi & Digital"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {settings.service_1_desc || "Aplikasi, AI, SaaS & Web"}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategoryId(2)}
              style={{ borderRadius: "20px" }}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                categoryId === 2
                  ? "border-[#C5A059] bg-amber-50/50 dark:bg-amber-950/40 text-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-5 h-5 text-[#C5A059]" />
                  {settings.service_2_badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-[#C5A059] border border-amber-200/50 dark:border-amber-700/50">
                      {settings.service_2_badge}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm sm:text-base leading-snug">
                  {settings.service_2_title || "2. Produk Inovasi & Riset"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {settings.service_2_desc || "Pangan, Herbal, Mesin & Fisik"}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategoryId(3)}
              style={{ borderRadius: "20px" }}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                categoryId === 3
                  ? "border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-2 ring-slate-400/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Wrench className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  {settings.service_3_badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">
                      {settings.service_3_badge}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm sm:text-base leading-snug">
                  {settings.service_3_title || "3. Jasa & Layanan Keahlian"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {settings.service_3_desc || "Konsultasi, Uji Lab & Pelatihan"}
                </p>
              </div>
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

          {/* Galeri Foto Produk Tambahan (Multi-Image / Screenshots / Angles) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Images className="w-4 h-4 text-[#0F4C81] dark:text-[#C5A059]" />
                  <span>Galeri Foto Produk Tambahan (Opsional / Multi-Image)</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Unggah screenshot aplikasi, tampak samping, belakang, kemasan, atau detail lainnya untuk melengkapi galeri produk.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {galleryImages.length} Foto Tambahan
              </span>
            </div>

            {/* Grid Preview Foto Galeri */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {galleryImages.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2.5 flex flex-col justify-between space-y-2 shadow-xs"
                  >
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <img
                        src={img.url}
                        alt={img.caption || `Foto #${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-[9px] font-bold text-white">
                        #{idx + 2}
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="Caption foto (opsional)..."
                      value={img.caption || ""}
                      onChange={(e) => {
                        const updated = [...galleryImages];
                        updated[idx].caption = e.target.value;
                        setGalleryImages(updated);
                      }}
                      className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const oldThumb = thumbnailUrl;
                          setThumbnailUrl(img.url);
                          const updated = [...galleryImages];
                          if (oldThumb) {
                            updated[idx] = { ...img, url: oldThumb };
                          } else {
                            updated.splice(idx, 1);
                          }
                          setGalleryImages(updated);
                          toast.success("Foto Utama Ditukar", "Foto galeri dijadikan sebagai foto mockup utama.");
                        }}
                        className="flex-1 py-1 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-[#0F4C81] dark:text-sky-300 text-[10px] font-bold transition text-center cursor-pointer"
                        title="Tukar menjadi Mockup Utama"
                      >
                        Jadikan Utama
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryImages(galleryImages.filter((_, i) => i !== idx));
                          toast.info("Foto Dihapus", "Foto dihapus dari galeri.");
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Uploader Foto Galeri Tambahan */}
            <div className="pt-2">
              <MediaUploader
                label="+ Tambah Foto ke Galeri Produk (Bisa Banyak)"
                description="Upload foto screenshot atau variasi angle tambahan (PNG, JPG, WEBP maks 5MB)"
                acceptedType="image"
                maxSizeMb={5}
                onUploadSuccess={(url) => {
                  if (url) {
                    setGalleryImages((prev) => [
                      ...prev,
                      { id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, url, caption: "" }
                    ]);
                    toast.success("Foto Ditambahkan!", "Foto baru berhasil dimasukkan ke galeri produk.");
                  }
                }}
              />
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

                    {/* 4. Sudut Pemotretan & Orientasi Produk (Sisi Depan, Samping & Belakang) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          4. Sudut Pemotretan & Perspektif Produk:
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Pilih sudut untuk foto studio
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {AI_ANGLE_OPTIONS.map((ang) => {
                          const isSelected = aiSelectedAngles.includes(ang.label);
                          return (
                            <button
                              key={ang.id}
                              type="button"
                              onClick={() => handleToggleAngle(ang.label)}
                              style={{ borderRadius: "16px" }}
                              className={`p-3 text-xs transition border flex items-start gap-2.5 cursor-pointer text-left ${
                                isSelected
                                  ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#0F4C81] dark:border-sky-500/60 shadow-xs ring-2 ring-[#0F4C81]/20"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80"
                              }`}
                            >
                              <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-[#0F4C81] dark:border-sky-400 bg-[#0F4C81] dark:bg-sky-500 text-white" : "border-slate-400"
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900 dark:text-white text-xs">{ang.label}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300">
                                    {ang.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                  {ang.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. Headline Infografis Keunggulan (Foto 3 Infografis) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          5. Headline Infografis Keunggulan (Foto 3 Infografis):
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Pilih gaya komunikasi infografis
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {AI_BENEFIT_HEADLINES.map((hl) => {
                          const isSelected = aiBenefitHeadline === hl.id;
                          return (
                            <button
                              key={hl.id}
                              type="button"
                              onClick={() => setAiBenefitHeadline(hl.id)}
                              style={{ borderRadius: "18px" }}
                              className={`p-3.5 text-xs transition border flex flex-col justify-between gap-2.5 cursor-pointer text-left ${
                                isSelected
                                  ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 dark:border-amber-500 shadow-xs ring-2 ring-amber-500/30"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className={`text-[11px] font-black tracking-wide ${isSelected ? "text-amber-800 dark:text-amber-300" : "text-slate-900 dark:text-white"}`}>
                                  {hl.title}
                                </span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? "border-amber-600 bg-amber-500 text-white" : "border-slate-400"
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                  hl.lang === "Bahasa Indonesia"
                                    ? "bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-300"
                                    : "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                                }`}>
                                  {hl.badge}
                                </span>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {hl.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 6. Detail Identitas Produk */}
                    <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        6. Identitas Produk Terkoneksi:
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

                    {/* 7. Prompt Dinamis (Editable) */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        7. Catatan Prompt Dinamis & Permintaan Khusus:
                      </label>
                      <textarea
                        rows={2}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        style={{ borderRadius: "14px" }}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                      />
                    </div>

                    {/* 5. Tombol Tunggal Generate Studio */}
                    <div>
                      <button
                        type="button"
                        onClick={handleGenerateAiPhotos}
                        disabled={aiLoading}
                        style={{ borderRadius: "9999px" }}
                        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-500 via-[#C5A059] to-[#0F4C81] hover:brightness-105 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${aiLoading ? "animate-spin" : ""}`} />
                        <span>
                          {aiLoading
                            ? `Memproses Studio Foto (${generationStep}/4)...`
                            : "Hasilkan 4 Foto Marketplace Komersial"}
                        </span>
                      </button>
                    </div>

                    {/* Animasi Proses Bertahap Satu Persatu (Step-by-Step Live Progress) */}
                    {aiLoading && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-blue-500/10 border border-amber-500/30 shadow-xs space-y-3 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                            <span>Proses Studio Visual Sedang Berjalan</span>
                          </span>
                          <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                            {generationStep === 1 && "25%"}
                            {generationStep === 2 && "50%"}
                            {generationStep === 3 && "75%"}
                            {generationStep === 4 && "95%"}
                            {generationStep >= 5 && "100%"}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 via-[#C5A059] to-[#0F4C81] transition-all duration-500 ease-out"
                            style={{
                              width:
                                generationStep === 1
                                  ? "25%"
                                  : generationStep === 2
                                  ? "50%"
                                  : generationStep === 3
                                  ? "75%"
                                  : generationStep === 4
                                  ? "95%"
                                  : generationStep >= 5
                                  ? "100%"
                                  : "10%",
                            }}
                          />
                        </div>

                        {/* 4 Tahap Visual */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                          <div
                            className={`p-2 rounded-xl border flex items-center gap-1.5 transition ${
                              generationStep > 1
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold"
                                : generationStep === 1
                                ? "bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200 font-black ring-2 ring-amber-400/30"
                                : "bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-900/10 dark:bg-white/10 flex items-center justify-center font-black text-[9px] shrink-0">
                              {generationStep > 1 ? "✓" : "1"}
                            </span>
                            <span className="truncate">1. Hero Product</span>
                          </div>

                          <div
                            className={`p-2 rounded-xl border flex items-center gap-1.5 transition ${
                              generationStep > 2
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold"
                                : generationStep === 2
                                ? "bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200 font-black ring-2 ring-amber-400/30"
                                : "bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-900/10 dark:bg-white/10 flex items-center justify-center font-black text-[9px] shrink-0">
                              {generationStep > 2 ? "✓" : "2"}
                            </span>
                            <span className="truncate">2. Detail Macro</span>
                          </div>

                          <div
                            className={`p-2 rounded-xl border flex items-center gap-1.5 transition ${
                              generationStep > 3
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold"
                                : generationStep === 3
                                ? "bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200 font-black ring-2 ring-amber-400/30"
                                : "bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-900/10 dark:bg-white/10 flex items-center justify-center font-black text-[9px] shrink-0">
                              {generationStep > 3 ? "✓" : "3"}
                            </span>
                            <span className="truncate">3. Infografis Fitur</span>
                          </div>

                          <div
                            className={`p-2 rounded-xl border flex items-center gap-1.5 transition ${
                              generationStep > 4
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold"
                                : generationStep === 4
                                ? "bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200 font-black ring-2 ring-amber-400/30"
                                : "bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-900/10 dark:bg-white/10 flex items-center justify-center font-black text-[9px] shrink-0">
                              {generationStep > 4 ? "✓" : "4"}
                            </span>
                            <span className="truncate">4. Lifestyle</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium italic pt-0.5">
                          {stepMessage}
                        </p>
                      </div>
                    )}

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
                          {aiPhotos.map((photo, idx) => (
                            <div
                              key={photo.id}
                              style={{ borderRadius: "20px" }}
                              className={`p-3.5 border transition-all duration-300 flex flex-col justify-between shadow-xs animate-in fade-in zoom-in-95 duration-500 ${
                                thumbnailUrl === photo.url
                                  ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/40 shadow-sm"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-amber-400"
                              }`}
                            >
                              <div>
                                <div
                                  onClick={() => {
                                    setFullscreenPhoto(photo);
                                    setFullscreenIndex(idx);
                                  }}
                                  className="group relative w-full aspect-[3/4] min-h-[190px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950/80 mb-3 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
                                  title="Klik untuk melihat gambar ukuran penuh (Fullscreen HD)"
                                >
                                  <img
                                    src={photo.url}
                                    alt={photo.title}
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-xs text-[10px] font-bold text-white shadow-xs z-10">
                                    {photo.angle || photo.badge}
                                  </span>
                                  {/* Hover overlay with zoom button */}
                                  <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 z-10 backdrop-blur-[2px]">
                                    <span className="px-3 py-1.5 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-lg flex items-center gap-1.5">
                                      <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                                      Cek Fullscreen
                                    </span>
                                  </div>
                                </div>

                                <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug mb-1.5 min-h-[36px] flex items-center">
                                  {photo.title}
                                </h5>
                                {photo.desc && (
                                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                                    {photo.desc}
                                  </p>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setFullscreenPhoto(photo);
                                    setFullscreenIndex(idx);
                                  }}
                                  className="w-full mb-3 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-700/60 dark:hover:bg-amber-950/40 text-slate-700 hover:text-amber-700 dark:text-slate-200 dark:hover:text-amber-300 text-[11px] font-bold transition flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-600 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Baca Detail & Cek Gambar</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 mt-auto">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setThumbnailUrl(photo.url);
                                    toast.success("Foto Dipilih", `Foto "${photo.title}" dijadikan sebagai mockup produk.`);
                                  }}
                                  style={{ borderRadius: "9999px" }}
                                  className={`flex-1 py-1.5 px-2.5 rounded-full text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs ${
                                    thumbnailUrl === photo.url
                                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                      : "bg-[#0F4C81] text-white hover:bg-[#135996]"
                                  }`}
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{thumbnailUrl === photo.url ? "Terpilih" : "Gunakan"}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const isAlreadyInGallery = galleryImages.some((g) => g.url === photo.url);
                                    if (isAlreadyInGallery) {
                                      toast.info("Sudah di Galeri", "Foto ini sudah ada di galeri tambahan.");
                                    } else {
                                      setGalleryImages((prev) => [
                                        ...prev,
                                        { id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, url: photo.url, caption: photo.title }
                                      ]);
                                      toast.success("Masuk Galeri!", `Foto "${photo.title}" ditambahkan ke galeri produk.`);
                                    }
                                  }}
                                  style={{ borderRadius: "9999px" }}
                                  className="py-1.5 px-2.5 rounded-full text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-xs"
                                  title="Tambahkan ke Galeri Produk Tambahan"
                                >
                                  <Plus className="w-3 h-3 text-amber-500" />
                                  <span>+ Galeri</span>
                                </button>
                                <a
                                  href={photo.url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  download
                                  style={{ borderRadius: "9999px" }}
                                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                                  title="Unduh HD Portrait 3:4 (960x1280)"
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

        {/* Fullscreen Lightbox Modal untuk Review Foto Marketplace */}
        {fullscreenPhoto && (
          <div
            className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200 select-none"
            onClick={() => setFullscreenPhoto(null)}
          >
            <div
              className="relative w-full max-w-4xl max-h-[88vh] bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-left my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column: Big Image Display */}
              <div className="relative w-full md:w-1/2 bg-slate-950 flex items-center justify-center p-4 min-h-[300px] md:min-h-[480px]">
                <img
                  src={fullscreenPhoto.url}
                  alt={fullscreenPhoto.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                  {fullscreenPhoto.angle || fullscreenPhoto.badge}
                </span>

                {/* Prev / Next Navigation buttons */}
                {aiPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const newIdx = (fullscreenIndex - 1 + aiPhotos.length) % aiPhotos.length;
                        setFullscreenIndex(newIdx);
                        setFullscreenPhoto(aiPhotos[newIdx]);
                      }}
                      style={{ borderRadius: "9999px" }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition cursor-pointer"
                      title="Foto Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newIdx = (fullscreenIndex + 1) % aiPhotos.length;
                        setFullscreenIndex(newIdx);
                        setFullscreenPhoto(aiPhotos[newIdx]);
                      }}
                      style={{ borderRadius: "9999px" }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition cursor-pointer"
                      title="Foto Berikutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Right Column: Full Details & Actions */}
              <div className="w-full md:w-1/2 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[88vh] space-y-4">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-black border border-amber-300 dark:border-amber-800">
                        Format Portrait 3:4 (960x1280)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Foto {fullscreenIndex + 1} dari {aiPhotos.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFullscreenPhoto(null)}
                      style={{ borderRadius: "9999px" }}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-xs"
                      title="Tutup (Esc)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {fullscreenPhoto.title}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-500" />
                      <span>Detail & Karakter Visual:</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {fullscreenPhoto.desc}
                    </p>
                  </div>

                  {fullscreenPhoto.prompt && (
                    <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                        Spesifikasi Prompt Paten:
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-mono leading-relaxed break-words">
                        {fullscreenPhoto.prompt}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailUrl(fullscreenPhoto.url);
                      toast.success("Foto Terpilih!", `"${fullscreenPhoto.title}" dijadikan sebagai mockup produk utama.`);
                      setFullscreenPhoto(null);
                    }}
                    style={{ borderRadius: "9999px" }}
                    className={`w-full py-3 px-5 rounded-full font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      thumbnailUrl === fullscreenPhoto.url
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-[#0F4C81] text-white hover:bg-[#135996]"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{thumbnailUrl === fullscreenPhoto.url ? "Sudah Terpilih Sebagai Mockup" : "Gunakan Sebagai Mockup Produk Utama"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const isAlreadyInGallery = galleryImages.some((g) => g.url === fullscreenPhoto.url);
                      if (isAlreadyInGallery) {
                        toast.info("Sudah di Galeri", "Foto ini sudah ada di galeri tambahan.");
                      } else {
                        setGalleryImages((prev) => [
                          ...prev,
                          { id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, url: fullscreenPhoto.url, caption: fullscreenPhoto.title }
                        ]);
                        toast.success("Masuk Galeri!", `Foto "${fullscreenPhoto.title}" berhasil dimasukkan ke galeri produk.`);
                      }
                    }}
                    style={{ borderRadius: "9999px" }}
                    className="w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    <Plus className="w-4 h-4 text-amber-500" />
                    <span>Tambahkan Foto Ini ke Galeri Produk</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={fullscreenPhoto.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      download
                      style={{ borderRadius: "9999px" }}
                      className="flex-1 py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-500" />
                      <span>Unduh Gambar Full HD (960x1280)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
              >
                <option value="starting_at">Mulai Dari (Starting At)</option>
                <option value="fixed">Harga Tetap (Fixed Unit)</option>
                <option value="contact_us">Penawaran Kustom / Hubungi PIC (RFQ)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {hargaTipe === "contact_us" ? "Nominal Harga (Opsional / Hubungi PIC)" : "Nominal Harga (Rupiah) *"}
              </label>
              <input
                type="number"
                required={hargaTipe !== "contact_us"}
                min={0}
                value={hargaNominal === 0 && hargaTipe === "contact_us" ? "" : (hargaNominal || "")}
                onChange={(e) => setHargaNominal(e.target.value === "" ? 0 : Number(e.target.value))}
                placeholder={hargaTipe === "contact_us" ? "0 (Bisa Negosiasi / Konsultasi)" : "Contoh: 50000"}
                style={{ borderRadius: "9999px" }}
                className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              {hargaTipe === "contact_us" && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                  * Produk ini akan tampil dengan label &quot;Hubungi PIC / Penawaran Kustom&quot; di katalog.
                </p>
              )}
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
