"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Users, UserPlus, Shield, ShieldCheck, ShieldAlert, 
  CheckCircle2, XCircle, Layers, Check, RefreshCw,
  Film, Clock, Save, RotateCcw, Play, Video,
  HelpCircle, Plus, Trash2, Edit3, Eye, EyeOff, MessageSquare,
  Globe, Palette, Settings2, UploadCloud, Key, Search, Lock, Award, Laptop,
  Briefcase, Handshake, ExternalLink, ExternalLink as ExtLink, TrendingUp, Box, Cpu, Wrench, Building2,
  GraduationCap, Navigation, X, LayoutGrid, SlidersHorizontal, AlignLeft, AlignRight,
  Star, Quote, Camera, Image as ImageIcon
} from "lucide-react";
import { api } from "../../../lib/api";
import { CatalogItem } from "../../../types/catalog";
import { DEFAULT_SHOWCASE_PROJECTS, ShowcaseProject } from "../../../components/3d/CanvasScrollyRobot";
import { 
  FAQItem, DEFAULT_FAQS, getStoredFAQs, saveStoredFAQs, addFAQ, updateFAQ, 
  deleteFAQ, toggleFAQStatus, resetStoredFAQs 
} from "../../../lib/faq";
import { useToast } from "../../../context/ToastContext";
import { 
  useSiteSettings, 
  DEFAULT_SITE_SETTINGS,
  PortfolioCaseItem,
  IndustryTestimonialItem,
  DEFAULT_PORTFOLIO_CASES,
  DEFAULT_INDUSTRY_TESTIMONIALS
} from "../../../context/SiteSettingsContext";
import { MediaUploader } from "../../../components/ui/MediaUploader";
import { autoTranslateIndonesianToEnglish } from "../../../lib/i18n";

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get("tab") : null;
  const toast = useToast();
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<"users" | "moderation" | "showcase" | "faqs" | "site_cms" | "partners" | "prodis">("users");

  useEffect(() => {
    if (tabParam && ["users", "moderation", "showcase", "faqs", "site_cms", "partners", "prodis"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: "users" | "moderation" | "showcase" | "faqs" | "site_cms" | "partners" | "prodis") => {
    setActiveTab(newTab);
    router.replace(`/dashboard/admin?tab=${newTab}`, { scroll: false });
  };
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [prodis, setProdis] = useState<any[]>([]);

  // Prodi Management CRUD State
  const [isNewProdiModal, setIsNewProdiModal] = useState(false);
  const [isEditProdiModal, setIsEditProdiModal] = useState(false);
  const [editingProdi, setEditingProdi] = useState<any | null>(null);
  const [prodiKode, setProdiKode] = useState("");
  const [prodiNama, setProdiNama] = useState("");
  const [prodiJenjang, setProdiJenjang] = useState("D4");
  const [prodiFakultas, setProdiFakultas] = useState("Sekolah Vokasi UNS");
  const [prodiEmail, setProdiEmail] = useState("");
  const [prodiWa, setProdiWa] = useState("6281234567890");
  const [prodiSearchQuery, setProdiSearchQuery] = useState("");
  const [prodiDegreeFilter, setProdiDegreeFilter] = useState("all");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Landing Page CMS State
  const [cmsForm, setCmsForm] = useState(settings);
  const [cmsSavedSuccess, setCmsSavedSuccess] = useState(false);
  const [isCmsSaving, setIsCmsSaving] = useState(false);

  useEffect(() => {
    if (!isCmsSaving) {
      setCmsForm(settings);
    }
  }, [settings, isCmsSaving]);

  // Showcase Video Management State (Fleksibel: Video, Detik Maksimal, Kata-kata Kiri & Kanan)
  const [showcaseProjects, setShowcaseProjects] = useState<ShowcaseProject[]>(DEFAULT_SHOWCASE_PROJECTS);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [showcaseSavedSuccess, setShowcaseSavedSuccess] = useState(false);
  const [showcaseSaveNotice, setShowcaseSaveNotice] = useState<string | null>(null);

  // FAQ Management State
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState("Kemitraan & Lisensi");
  const [faqNotice, setFaqNotice] = useState<string | null>(null);

  // Catalog Item CRUD State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemForm, setItemForm] = useState({
    nama_item: "",
    category_id: 1,
    prodi_id: 1,
    tagline: "",
    deskripsi_singkat: "",
    deskripsi_lengkap: "",
    live_demo_url: "",
    model_3d_url: "",
    thumbnail_url: "/images/brand/slogan-poster-vokasi.jpg",
    status_publikasi: "published" as "published" | "draft" | "archived",
    harga_tipe: "starting_at" as "fixed" | "starting_at" | "contact_us",
    harga_nominal: 5000000,
    pic_nama: "",
    pic_kontak: "6281234567890",
    pic_laboratorium: "Laboratorium Riset Terapan SV",
    specs: [
      { group_name: "Tech Stack", spec_key: "Frontend", spec_value: "Next.js 14, Tailwind CSS" },
      { group_name: "Tech Stack", spec_key: "Backend API", spec_value: "Laravel 11 REST API" },
    ],
  });
  const [isItemSubmitting, setIsItemSubmitting] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [itemCategoryFilter, setItemCategoryFilter] = useState("all");
  const [itemStatusFilter, setItemStatusFilter] = useState("all");

  // User Management State (CRUD)
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState(3); // Default prodi
  const [newProdiId, setNewProdiId] = useState<number | "">("");

  // Edit & Ganti Password State
  const [isEditUserModal, setIsEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editRoleId, setEditRoleId] = useState(3);
  const [editProdiId, setEditProdiId] = useState<number | "">("");

  // Search & Role Filter
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");

  // Industry Partners CRUD State
  const [partnerList, setPartnerList] = useState<Array<{ name: string; src: string; alt: string; link?: string }>>([]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartnerIndex, setEditingPartnerIndex] = useState<number | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [partnerSrc, setPartnerSrc] = useState("");
  const [partnerAlt, setPartnerAlt] = useState("");
  const [partnerLink, setPartnerLink] = useState("");
  const [partnerTitleId, setPartnerTitleId] = useState("");
  const [partnerTitleEn, setPartnerTitleEn] = useState("");
  const [partnerDescId, setPartnerDescId] = useState("");
  const [partnerDescEn, setPartnerDescEn] = useState("");
  const [partnersSavedSuccess, setPartnersSavedSuccess] = useState(false);

  // Portfolio Cases State (Portofolio Inovasi yang Digunakan Mitra)
  const [portfolioCasesList, setPortfolioCasesList] = useState<PortfolioCaseItem[]>([]);
  const [portfolioSectionTagline, setPortfolioSectionTagline] = useState("");
  const [portfolioSectionTitle, setPortfolioSectionTitle] = useState("");
  const [portfolioSectionDesc, setPortfolioSectionDesc] = useState("");
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolioIndex, setEditingPortfolioIndex] = useState<number | null>(null);

  const [portfolioFormTitle, setPortfolioFormTitle] = useState("");
  const [portfolioFormCategory, setPortfolioFormCategory] = useState("Hardware & IoT Robotika");
  const [portfolioFormPartner, setPortfolioFormPartner] = useState("");
  const [portfolioFormStatus, setPortfolioFormStatus] = useState("Telah Diimplementasikan & Aktif Beroperasi");
  const [portfolioFormRating, setPortfolioFormRating] = useState(5.0);
  const [portfolioFormReviewCount, setPortfolioFormReviewCount] = useState(18);
  const [portfolioFormMetricValue, setPortfolioFormMetricValue] = useState("65%");
  const [portfolioFormMetricLabel, setPortfolioFormMetricLabel] = useState("Efisiensi Biaya Patroli Keamanan");
  const [portfolioFormDesc, setPortfolioFormDesc] = useState("");
  const [portfolioFormTestimonial, setPortfolioFormTestimonial] = useState("");
  const [portfolioFormReviewer, setPortfolioFormReviewer] = useState("");
  const [portfolioFormSlug, setPortfolioFormSlug] = useState("");
  const [portfolioFormImage, setPortfolioFormImage] = useState("");

  // Testimonials State (Testimoni Kolaborasi & Sinergi Mitra)
  const [testimonialsList, setTestimonialsList] = useState<IndustryTestimonialItem[]>([]);
  const [testimonialsSectionTagline, setTestimonialsSectionTagline] = useState("");
  const [testimonialsSectionTitle, setTestimonialsSectionTitle] = useState("");
  const [testimonialsSectionDesc, setTestimonialsSectionDesc] = useState("");
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);

  const [testimonialFormName, setTestimonialFormName] = useState("");
  const [testimonialFormRole, setTestimonialFormRole] = useState("");
  const [testimonialFormCompany, setTestimonialFormCompany] = useState("");
  const [testimonialFormAvatar, setTestimonialFormAvatar] = useState("");
  const [testimonialFormRating, setTestimonialFormRating] = useState(5);
  const [testimonialFormText, setTestimonialFormText] = useState("");

  useEffect(() => {
    if (settings.industry_partners && Array.isArray(settings.industry_partners)) {
      setPartnerList(settings.industry_partners);
    } else {
      setPartnerList([
        { name: "Slot 1: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-color.png", alt: "Slot 1 UNS" },
        { name: "Slot 2: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-color.png", alt: "Slot 2 UNS" },
        { name: "Slot 3: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-color.png", alt: "Slot 3 UNS" },
        { name: "Slot 4: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-color.png", alt: "Slot 4 UNS" },
        { name: "Slot 5: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-color.png", alt: "Slot 5 UNS" },
        { name: "Slot 6: Kolaborasi UNS", src: "/images/brand/logo-sv-uns-official-color.png", alt: "Slot 6 UNS" },
      ]);
    }
    setPartnerTitleId(settings.partners_network_title_id || "Jaringan Mitra Industri Terpercaya");
    setPartnerTitleEn(settings.partners_network_title_en || "Trusted Industry Partners Network");
    setPartnerDescId(settings.partners_network_desc_id || "Sinergi erat dengan BUMN, korporasi terkemuka, dan pemerintah kota mewujudkan ekosistem hilirisasi riset terapan.");
    setPartnerDescEn(settings.partners_network_desc_en || "Close synergy with state-owned enterprises (BUMN), leading corporations, and city governments drives applied research commercialization.");

    // Portfolio cases
    if (settings.portfolio_cases && Array.isArray(settings.portfolio_cases) && settings.portfolio_cases.length > 0) {
      setPortfolioCasesList(settings.portfolio_cases);
    } else {
      setPortfolioCasesList(DEFAULT_PORTFOLIO_CASES);
    }
    setPortfolioSectionTagline(settings.portfolio_section_tagline || "Impactful Applied Implementations");
    setPortfolioSectionTitle(settings.portfolio_section_title || "Portofolio Inovasi yang Telah Digunakan Mitra");
    setPortfolioSectionDesc(settings.portfolio_section_desc || "Bukti nyata karya riset terapan dan produk teknologi Sekolah Vokasi UNS yang telah resmi diadopsi, diintegrasikan, dan beroperasi di BUMN, korporasi swasta, dan instansi pemerintah.");

    // Industry testimonials
    if (settings.industry_testimonials && Array.isArray(settings.industry_testimonials) && settings.industry_testimonials.length > 0) {
      setTestimonialsList(settings.industry_testimonials);
    } else {
      setTestimonialsList(DEFAULT_INDUSTRY_TESTIMONIALS);
    }
    setTestimonialsSectionTagline(settings.testimonials_section_tagline || "Industry Trust & DUDI Synergy");
    setTestimonialsSectionTitle(settings.testimonials_section_title || "Testimoni Kolaborasi & Sinergi");
    setTestimonialsSectionDesc(settings.testimonials_section_desc || "Pengalaman nyata mitra industri bekerja sama dengan Sekolah Vokasi UNS dalam hilirisasi teknologi.");
  }, [settings]);

  const handleOpenAddPartner = () => {
    setEditingPartnerIndex(null);
    setPartnerName("");
    setPartnerSrc("/images/brand/logo-sv-uns-official-color.png");
    setPartnerAlt("");
    setPartnerLink("");
    setIsPartnerModalOpen(true);
  };

  const handleOpenEditPartner = (index: number) => {
    const item = partnerList[index];
    setEditingPartnerIndex(index);
    setPartnerName(item.name);
    setPartnerSrc(item.src);
    setPartnerAlt(item.alt || item.name);
    setPartnerLink(item.link || "");
    setIsPartnerModalOpen(true);
  };

  const handleDeletePartner = (index: number) => {
    if (confirm(`Hapus mitra "${partnerList[index].name}" dari daftar running logo?`)) {
      const updated = partnerList.filter((_, i) => i !== index);
      setPartnerList(updated);
      toast.info("Mitra dihapus dari antrean. Klik 'Simpan Seluruh Perubahan' untuk menyimpan permanen.");
    }
  };

  const handleSavePartnerModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) {
      toast.error("Nama mitra wajib diisi.");
      return;
    }
    const newPartner = {
      name: partnerName.trim(),
      src: partnerSrc.trim() || "/images/brand/logo-sv-uns-official-color.png",
      alt: partnerAlt.trim() || partnerName.trim(),
      link: partnerLink.trim() || undefined,
    };

    let updated: Array<{ name: string; src: string; alt: string; link?: string }>;
    if (editingPartnerIndex !== null) {
      updated = [...partnerList];
      updated[editingPartnerIndex] = newPartner;
      toast.success(`Mitra "${newPartner.name}" berhasil diperbarui.`);
    } else {
      updated = [...partnerList, newPartner];
      toast.success(`Mitra "${newPartner.name}" berhasil ditambahkan.`);
    }
    setPartnerList(updated);
    setIsPartnerModalOpen(false);
  };

  // Portfolio Handlers
  const handleOpenAddPortfolio = () => {
    setEditingPortfolioIndex(null);
    setPortfolioFormTitle("");
    setPortfolioFormCategory("Hardware & IoT Robotika");
    setPortfolioFormPartner("");
    setPortfolioFormStatus("Telah Diimplementasikan & Aktif Beroperasi");
    setPortfolioFormRating(5.0);
    setPortfolioFormReviewCount(18);
    setPortfolioFormMetricValue("65%");
    setPortfolioFormMetricLabel("Efisiensi Biaya Operasional");
    setPortfolioFormDesc("");
    setPortfolioFormTestimonial("");
    setPortfolioFormReviewer("");
    setPortfolioFormSlug("");
    setPortfolioFormImage("");
    setIsPortfolioModalOpen(true);
  };

  const handleOpenEditPortfolio = (index: number) => {
    const item = portfolioCasesList[index];
    setEditingPortfolioIndex(index);
    setPortfolioFormTitle(item.title);
    setPortfolioFormCategory(item.category);
    setPortfolioFormPartner(item.partner);
    setPortfolioFormStatus(item.status);
    setPortfolioFormRating(item.rating);
    setPortfolioFormReviewCount(item.reviewCount);
    setPortfolioFormMetricValue(item.metricValue);
    setPortfolioFormMetricLabel(item.metricLabel);
    setPortfolioFormDesc(item.description);
    setPortfolioFormTestimonial(item.testimonial);
    setPortfolioFormReviewer(item.reviewer);
    setPortfolioFormSlug(item.slug);
    setPortfolioFormImage(item.image || "");
    setIsPortfolioModalOpen(true);
  };

  const handleDeletePortfolio = (index: number) => {
    if (confirm(`Hapus kasus portofolio "${portfolioCasesList[index].title}"?`)) {
      const updated = portfolioCasesList.filter((_, i) => i !== index);
      setPortfolioCasesList(updated);
      toast.info("Kasus portofolio dihapus. Klik 'Simpan Seluruh Perubahan' untuk menyimpan permanen.");
    }
  };

  const handleSavePortfolioModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioFormTitle.trim() || !portfolioFormPartner.trim()) {
      toast.error("Judul inovasi dan nama mitra wajib diisi.");
      return;
    }

    const newItem: PortfolioCaseItem = {
      id: editingPortfolioIndex !== null ? portfolioCasesList[editingPortfolioIndex].id : `case-${Date.now()}`,
      title: portfolioFormTitle.trim(),
      category: portfolioFormCategory.trim(),
      partner: portfolioFormPartner.trim(),
      status: portfolioFormStatus.trim(),
      rating: Number(portfolioFormRating) || 5.0,
      reviewCount: Number(portfolioFormReviewCount) || 1,
      metricValue: portfolioFormMetricValue.trim(),
      metricLabel: portfolioFormMetricLabel.trim(),
      description: portfolioFormDesc.trim(),
      testimonial: portfolioFormTestimonial.trim(),
      reviewer: portfolioFormReviewer.trim(),
      slug: portfolioFormSlug.trim() || "katalog",
      image: portfolioFormImage.trim() || undefined,
      isActive: true,
    };

    let updated: PortfolioCaseItem[];
    if (editingPortfolioIndex !== null) {
      updated = [...portfolioCasesList];
      updated[editingPortfolioIndex] = newItem;
      toast.success(`Portofolio "${newItem.title}" berhasil diperbarui.`);
    } else {
      updated = [...portfolioCasesList, newItem];
      toast.success(`Portofolio "${newItem.title}" berhasil ditambahkan.`);
    }
    setPortfolioCasesList(updated);
    setIsPortfolioModalOpen(false);
  };

  // Testimonials Handlers
  const handleOpenAddTestimonial = () => {
    setEditingTestimonialIndex(null);
    setTestimonialFormName("");
    setTestimonialFormRole("Kepala Divisi K3 & Aset Industri");
    setTestimonialFormCompany("PT Petrokimia Gresik");
    setTestimonialFormAvatar("/images/brand/logo-sv-uns-official-color.png");
    setTestimonialFormRating(5);
    setTestimonialFormText("");
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (index: number) => {
    const item = testimonialsList[index];
    setEditingTestimonialIndex(index);
    setTestimonialFormName(item.name);
    setTestimonialFormRole(item.role);
    setTestimonialFormCompany(item.company);
    setTestimonialFormAvatar(item.avatar || "/images/brand/logo-sv-uns-official-color.png");
    setTestimonialFormRating(item.rating);
    setTestimonialFormText(item.text);
    setIsTestimonialModalOpen(true);
  };

  const handleDeleteTestimonial = (index: number) => {
    if (confirm(`Hapus testimoni dari "${testimonialsList[index].name}"?`)) {
      const updated = testimonialsList.filter((_, i) => i !== index);
      setTestimonialsList(updated);
      toast.info("Testimoni dihapus. Klik 'Simpan Seluruh Perubahan' untuk menyimpan permanen.");
    }
  };

  const handleSaveTestimonialModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialFormName.trim() || !testimonialFormText.trim()) {
      toast.error("Nama tokoh dan teks testimoni wajib diisi.");
      return;
    }

    const newItem: IndustryTestimonialItem = {
      id: editingTestimonialIndex !== null ? (testimonialsList[editingTestimonialIndex].id || `testi-${Date.now()}`) : `testi-${Date.now()}`,
      name: testimonialFormName.trim(),
      role: testimonialFormRole.trim(),
      company: testimonialFormCompany.trim(),
      avatar: testimonialFormAvatar.trim() || "/images/brand/logo-sv-uns-official-color.png",
      rating: Number(testimonialFormRating) || 5,
      text: testimonialFormText.trim(),
      isActive: true,
    };

    let updated: IndustryTestimonialItem[];
    if (editingTestimonialIndex !== null) {
      updated = [...testimonialsList];
      updated[editingTestimonialIndex] = newItem;
      toast.success(`Testimoni dari "${newItem.name}" berhasil diperbarui.`);
    } else {
      updated = [...testimonialsList, newItem];
      toast.success(`Testimoni dari "${newItem.name}" berhasil ditambahkan.`);
    }
    setTestimonialsList(updated);
    setIsTestimonialModalOpen(false);
  };

  const handleSaveAllPartnersToDatabase = async () => {
    setIsSubmitting(true);
    try {
      const ok = await updateSettings({
        industry_partners: partnerList,
        partners_network_title_id: partnerTitleId,
        partners_network_title_en: partnerTitleEn,
        partners_network_desc_id: partnerDescId,
        partners_network_desc_en: partnerDescEn,
        portfolio_section_tagline: portfolioSectionTagline,
        portfolio_section_title: portfolioSectionTitle,
        portfolio_section_desc: portfolioSectionDesc,
        portfolio_cases: portfolioCasesList,
        testimonials_section_tagline: testimonialsSectionTagline,
        testimonials_section_title: testimonialsSectionTitle,
        testimonials_section_desc: testimonialsSectionDesc,
        industry_testimonials: testimonialsList,
      });
      if (ok) {
        setPartnersSavedSuccess(true);
        toast.success("Mitra, portofolio inovasi, dan testimoni industri berhasil disimpan permanen ke database!");
        setTimeout(() => setPartnersSavedSuccess(false), 4000);
      } else {
        toast.error("Gagal menyimpan ke database.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem saat menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prodi Management Handlers
  const handleOpenAddProdi = () => {
    setEditingProdi(null);
    setProdiKode("");
    setProdiNama("");
    setProdiJenjang("D4");
    setProdiFakultas("Sekolah Vokasi UNS");
    setProdiEmail("");
    setProdiWa("6281234567890");
    setIsNewProdiModal(true);
  };

  const handleOpenEditProdi = (p: any) => {
    setEditingProdi(p);
    setProdiKode(p.kode_prodi || "");
    setProdiNama(p.nama_prodi || "");
    setProdiJenjang(p.jenjang || "D4");
    setProdiFakultas(p.fakultas_sekolah || "Sekolah Vokasi UNS");
    setProdiEmail(p.kontak_email || "");
    setProdiWa(p.kontak_wa || "6281234567890");
    setIsEditProdiModal(true);
  };

  const handleSaveProdi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodiKode.trim() || !prodiNama.trim()) {
      toast.error("Kode dan Nama Program Studi wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingProdi) {
        const res = await api.updateProdi(editingProdi.id, {
          kode_prodi: prodiKode.trim().toUpperCase(),
          nama_prodi: prodiNama.trim(),
          jenjang: prodiJenjang,
          fakultas_sekolah: prodiFakultas,
          kontak_email: prodiEmail.trim(),
          kontak_wa: prodiWa.trim(),
        });
        if (res.success) {
          toast.success("Program Studi Berhasil Diperbarui!");
          setIsEditProdiModal(false);
          await loadData();
        } else {
          toast.error("Gagal memperbarui program studi.");
        }
      } else {
        const res = await api.createProdi({
          kode_prodi: prodiKode.trim().toUpperCase(),
          nama_prodi: prodiNama.trim(),
          jenjang: prodiJenjang,
          fakultas_sekolah: prodiFakultas,
          kontak_email: prodiEmail.trim(),
          kontak_wa: prodiWa.trim(),
        });
        if (res.success) {
          toast.success("Program Studi Berhasil Ditambahkan!");
          setIsNewProdiModal(false);
          await loadData();
        } else {
          toast.error("Gagal menambahkan program studi.");
        }
      }
    } catch {
      toast.error("Terjadi kegagalan komunikasi dengan server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProdi = async (p: any) => {
    if (!confirm(`Hapus program studi "${p.kode_prodi} - ${p.nama_prodi}"?`)) return;
    setIsSubmitting(true);
    try {
      await api.deleteProdi(p.id);
      toast.success(`Program studi "${p.kode_prodi}" berhasil dihapus.`);
      await loadData();
    } catch {
      toast.error("Gagal menghapus program studi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDefaultProdis = async () => {
    if (!confirm("Kembalikan direktori ke 39 Program Studi resmi standar Sekolah Vokasi UNS?")) return;
    setIsSubmitting(true);
    try {
      await api.resetDefaultProdis();
      toast.success("Direktori berhasil direset ke 39 Program Studi resmi!");
      await loadData();
    } catch {
      toast.error("Gagal mereset program studi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // System Services & Information Portal Management State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceIsActive, setServiceIsActive] = useState(true);

  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [editingPortalIndex, setEditingPortalIndex] = useState<number | null>(null);
  const [portalName, setPortalName] = useState("");
  const [portalUrl, setPortalUrl] = useState("");
  const [portalDesc, setPortalDesc] = useState("");
  const [portalIsActive, setPortalIsActive] = useState(true);

  // System Services Handlers
  const currentSystemServices = (cmsForm?.system_services_list && Array.isArray(cmsForm.system_services_list))
    ? cmsForm.system_services_list
    : DEFAULT_SITE_SETTINGS.system_services_list || [];

  const handleOpenAddService = () => {
    setEditingServiceIndex(null);
    setServiceName("");
    setServiceUrl("https://");
    setServiceDesc("");
    setServiceIsActive(true);
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (idx: number) => {
    const item = currentSystemServices[idx];
    if (!item) return;
    setEditingServiceIndex(idx);
    setServiceName(item.name || "");
    setServiceUrl(item.url || "");
    setServiceDesc(item.desc || "");
    setServiceIsActive(item.isActive !== false);
    setIsServiceModalOpen(true);
  };

  const handleSaveServiceModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !serviceUrl.trim()) {
      toast.error("Nama & URL Layanan Wajib Diisi", "Harap isi nama dan tautan sistem.");
      return;
    }
    const itemObj = {
      id: editingServiceIndex !== null ? (currentSystemServices[editingServiceIndex]?.id || Date.now().toString()) : Date.now().toString(),
      name: serviceName.trim(),
      url: serviceUrl.trim(),
      desc: serviceDesc.trim(),
      isActive: serviceIsActive,
    };

    let updatedList = [...currentSystemServices];
    if (editingServiceIndex !== null) {
      updatedList[editingServiceIndex] = itemObj;
    } else {
      updatedList.push(itemObj);
    }
    setCmsForm((prev: any) => ({ ...prev, system_services_list: updatedList }));
    await updateSettings({ system_services_list: updatedList });
    setIsServiceModalOpen(false);
    toast.success("Layanan Sistem Disimpan", `Data layanan "${itemObj.name}" berhasil disimpan ke database MySQL.`);
  };

  const handleToggleService = async (idx: number) => {
    const updatedList = currentSystemServices.map((s: any, i: number) => 
      i === idx ? { ...s, isActive: !s.isActive } : s
    );
    setCmsForm((prev: any) => ({ ...prev, system_services_list: updatedList }));
    await updateSettings({ system_services_list: updatedList });
    toast.info("Status Layanan Diubah", "Visibilitas layanan sistem telah diperbarui di database.");
  };

  const handleDeleteService = async (idx: number) => {
    const item = currentSystemServices[idx];
    if (!item) return;
    if (confirm(`Apakah Anda yakin ingin menghapus layanan sistem "${item.name}"?`)) {
      const updatedList = currentSystemServices.filter((_: any, i: number) => i !== idx);
      setCmsForm((prev: any) => ({ ...prev, system_services_list: updatedList }));
      await updateSettings({ system_services_list: updatedList });
      toast.info("Layanan Dihapus", `Layanan "${item.name}" berhasil dihapus dari sistem.`);
    }
  };

  const handleResetServices = async () => {
    if (confirm("Reset daftar Layanan Sistem ke daftar standar Sekolah Vokasi UNS?")) {
      const defaultList = DEFAULT_SITE_SETTINGS.system_services_list || [];
      setCmsForm((prev: any) => ({ ...prev, system_services_list: defaultList }));
      await updateSettings({ system_services_list: defaultList });
      toast.info("Layanan Sistem Direset", "Daftar layanan sistem dikembalikan ke pengaturan awal.");
    }
  };

  // Portal Info Handlers
  const currentPortalInfo = (cmsForm?.portal_info_list && Array.isArray(cmsForm.portal_info_list))
    ? cmsForm.portal_info_list
    : DEFAULT_SITE_SETTINGS.portal_info_list || [];

  const handleOpenAddPortal = () => {
    setEditingPortalIndex(null);
    setPortalName("");
    setPortalUrl("https://");
    setPortalDesc("");
    setPortalIsActive(true);
    setIsPortalModalOpen(true);
  };

  const handleOpenEditPortal = (idx: number) => {
    const item = currentPortalInfo[idx];
    if (!item) return;
    setEditingPortalIndex(idx);
    setPortalName(item.name || "");
    setPortalUrl(item.url || "");
    setPortalDesc(item.desc || "");
    setPortalIsActive(item.isActive !== false);
    setIsPortalModalOpen(true);
  };

  const handleSavePortalModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalName.trim() || !portalUrl.trim()) {
      toast.error("Nama & URL Portal Wajib Diisi", "Harap isi nama dan tautan portal informasi.");
      return;
    }
    const itemObj = {
      id: editingPortalIndex !== null ? (currentPortalInfo[editingPortalIndex]?.id || Date.now().toString()) : Date.now().toString(),
      name: portalName.trim(),
      url: portalUrl.trim(),
      desc: portalDesc.trim(),
      isActive: portalIsActive,
    };

    let updatedList = [...currentPortalInfo];
    if (editingPortalIndex !== null) {
      updatedList[editingPortalIndex] = itemObj;
    } else {
      updatedList.push(itemObj);
    }
    setCmsForm((prev: any) => ({ ...prev, portal_info_list: updatedList }));
    await updateSettings({ portal_info_list: updatedList });
    setIsPortalModalOpen(false);
    toast.success("Portal Informasi Disimpan", `Data portal "${itemObj.name}" berhasil disimpan ke database MySQL.`);
  };

  const handleTogglePortal = async (idx: number) => {
    const updatedList = currentPortalInfo.map((p: any, i: number) => 
      i === idx ? { ...p, isActive: !p.isActive } : p
    );
    setCmsForm((prev: any) => ({ ...prev, portal_info_list: updatedList }));
    await updateSettings({ portal_info_list: updatedList });
    toast.info("Status Portal Diubah", "Visibilitas portal informasi telah diperbarui di database.");
  };

  const handleDeletePortal = async (idx: number) => {
    const item = currentPortalInfo[idx];
    if (!item) return;
    if (confirm(`Apakah Anda yakin ingin menghapus portal informasi "${item.name}"?`)) {
      const updatedList = currentPortalInfo.filter((_: any, i: number) => i !== idx);
      setCmsForm((prev: any) => ({ ...prev, portal_info_list: updatedList }));
      await updateSettings({ portal_info_list: updatedList });
      toast.info("Portal Dihapus", `Portal "${item.name}" berhasil dihapus dari sistem.`);
    }
  };

  const handleResetPortals = async () => {
    if (confirm("Reset daftar Portal Informasi ke daftar standar Sekolah Vokasi UNS?")) {
      const defaultList = DEFAULT_SITE_SETTINGS.portal_info_list || [];
      setCmsForm((prev: any) => ({ ...prev, portal_info_list: defaultList }));
      await updateSettings({ portal_info_list: defaultList });
      toast.info("Portal Informasi Direset", "Daftar portal informasi dikembalikan ke pengaturan awal.");
    }
  };

  // Header Navigation & Sidebar Quick Links State & Handlers
  const [isHeaderNavModalOpen, setIsHeaderNavModalOpen] = useState(false);
  const [editingHeaderNavIndex, setEditingHeaderNavIndex] = useState<number | null>(null);
  const [headerNavId, setHeaderNavId] = useState("");
  const [headerNavLabelId, setHeaderNavLabelId] = useState("");
  const [headerNavLabelEn, setHeaderNavLabelEn] = useState("");
  const [headerNavHref, setHeaderNavHref] = useState("");
  const [headerNavIsActive, setHeaderNavIsActive] = useState(true);

  const [isSidebarLinkModalOpen, setIsSidebarLinkModalOpen] = useState(false);
  const [editingSidebarLinkIndex, setEditingSidebarLinkIndex] = useState<number | null>(null);
  const [sidebarLinkLabel, setSidebarLinkLabel] = useState("");
  const [sidebarLinkHref, setSidebarLinkHref] = useState("");
  const [sidebarLinkIsActive, setSidebarLinkIsActive] = useState(true);

  const currentHeaderNavLinks = (cmsForm?.header_nav_links && Array.isArray(cmsForm.header_nav_links))
    ? cmsForm.header_nav_links
    : DEFAULT_SITE_SETTINGS.header_nav_links || [];

  const currentSidebarLinks = (cmsForm?.sidebar_custom_links && Array.isArray(cmsForm.sidebar_custom_links))
    ? cmsForm.sidebar_custom_links
    : DEFAULT_SITE_SETTINGS.sidebar_custom_links || [];

  const handleOpenAddHeaderNav = () => {
    setEditingHeaderNavIndex(null);
    setHeaderNavId("");
    setHeaderNavLabelId("");
    setHeaderNavLabelEn("");
    setHeaderNavHref("/#");
    setHeaderNavIsActive(true);
    setIsHeaderNavModalOpen(true);
  };

  const handleOpenEditHeaderNav = (idx: number) => {
    const item = currentHeaderNavLinks[idx];
    if (!item) return;
    setEditingHeaderNavIndex(idx);
    setHeaderNavId(item.id || "");
    setHeaderNavLabelId(item.labelId || "");
    setHeaderNavLabelEn(item.labelEn || "");
    setHeaderNavHref(item.href || "");
    setHeaderNavIsActive(item.isActive !== false);
    setIsHeaderNavModalOpen(true);
  };

  const handleSaveHeaderNavModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerNavLabelId.trim() || !headerNavHref.trim()) {
      toast.error("Label ID dan URL Anchor Wajib Diisi", "Harap isi nama menu dan tujuan URL/Anchor.");
      return;
    }
    const itemObj = {
      id: headerNavId.trim() || headerNavLabelId.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      labelId: headerNavLabelId.trim(),
      labelEn: headerNavLabelEn.trim() || headerNavLabelId.trim(),
      href: headerNavHref.trim(),
      isActive: headerNavIsActive,
    };

    let updatedList = [...currentHeaderNavLinks];
    if (editingHeaderNavIndex !== null) {
      updatedList[editingHeaderNavIndex] = itemObj;
    } else {
      updatedList.push(itemObj);
    }
    setCmsForm((prev: any) => ({ ...prev, header_nav_links: updatedList }));
    await updateSettings({ header_nav_links: updatedList });
    setIsHeaderNavModalOpen(false);
    toast.success("Menu Header Disimpan", `Menu "${itemObj.labelId}" berhasil disimpan.`);
  };

  const handleToggleHeaderNav = async (idx: number) => {
    const updatedList = currentHeaderNavLinks.map((item: any, i: number) => 
      i === idx ? { ...item, isActive: !item.isActive } : item
    );
    setCmsForm((prev: any) => ({ ...prev, header_nav_links: updatedList }));
    await updateSettings({ header_nav_links: updatedList });
    toast.info("Status Menu Diubah", "Visibilitas menu header telah diperbarui.");
  };

  const handleDeleteHeaderNav = async (idx: number) => {
    const item = currentHeaderNavLinks[idx];
    if (!item) return;
    if (confirm(`Apakah Anda yakin ingin menghapus menu "${item.labelId}" dari header?`)) {
      const updatedList = currentHeaderNavLinks.filter((_: any, i: number) => i !== idx);
      setCmsForm((prev: any) => ({ ...prev, header_nav_links: updatedList }));
      await updateSettings({ header_nav_links: updatedList });
      toast.info("Menu Dihapus", `Menu "${item.labelId}" dihapus dari header.`);
    }
  };

  const handleResetHeaderNav = async () => {
    if (confirm("Reset menu header ke 6 menu bawaan resmi Sekolah Vokasi UNS?")) {
      const defaultList = DEFAULT_SITE_SETTINGS.header_nav_links || [];
      setCmsForm((prev: any) => ({ ...prev, header_nav_links: defaultList }));
      await updateSettings({ header_nav_links: defaultList });
      toast.info("Menu Header Direset", "Menu navigasi header dikembalikan ke pengaturan awal.");
    }
  };

  const handleOpenAddSidebarLink = () => {
    setEditingSidebarLinkIndex(null);
    setSidebarLinkLabel("");
    setSidebarLinkHref("https://");
    setSidebarLinkIsActive(true);
    setIsSidebarLinkModalOpen(true);
  };

  const handleOpenEditSidebarLink = (idx: number) => {
    const item = currentSidebarLinks[idx];
    if (!item) return;
    setEditingSidebarLinkIndex(idx);
    setSidebarLinkLabel(item.label || "");
    setSidebarLinkHref(item.href || "");
    setSidebarLinkIsActive(item.isActive !== false);
    setIsSidebarLinkModalOpen(true);
  };

  const handleSaveSidebarLinkModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarLinkLabel.trim() || !sidebarLinkHref.trim()) {
      toast.error("Label dan URL Tautan Wajib Diisi", "Harap isi nama dan URL tautan sidebar.");
      return;
    }
    const itemObj = {
      id: editingSidebarLinkIndex !== null ? (currentSidebarLinks[editingSidebarLinkIndex]?.id || Date.now().toString()) : Date.now().toString(),
      label: sidebarLinkLabel.trim(),
      href: sidebarLinkHref.trim(),
      isActive: sidebarLinkIsActive,
    };

    let updatedList = [...currentSidebarLinks];
    if (editingSidebarLinkIndex !== null) {
      updatedList[editingSidebarLinkIndex] = itemObj;
    } else {
      updatedList.push(itemObj);
    }
    setCmsForm((prev: any) => ({ ...prev, sidebar_custom_links: updatedList }));
    await updateSettings({ sidebar_custom_links: updatedList });
    setIsSidebarLinkModalOpen(false);
    toast.success("Tautan Sidebar Disimpan", `Tautan "${itemObj.label}" berhasil disimpan.`);
  };

  const handleToggleSidebarLink = async (idx: number) => {
    const updatedList = currentSidebarLinks.map((item: any, i: number) => 
      i === idx ? { ...item, isActive: !item.isActive } : item
    );
    setCmsForm((prev: any) => ({ ...prev, sidebar_custom_links: updatedList }));
    await updateSettings({ sidebar_custom_links: updatedList });
    toast.info("Status Tautan Diubah", "Visibilitas tautan sidebar telah diperbarui.");
  };

  const handleDeleteSidebarLink = async (idx: number) => {
    const item = currentSidebarLinks[idx];
    if (!item) return;
    if (confirm(`Apakah Anda yakin ingin menghapus tautan "${item.label}" dari sidebar?`)) {
      const updatedList = currentSidebarLinks.filter((_: any, i: number) => i !== idx);
      setCmsForm((prev: any) => ({ ...prev, sidebar_custom_links: updatedList }));
      await updateSettings({ sidebar_custom_links: updatedList });
      toast.info("Tautan Dihapus", `Tautan "${item.label}" dihapus dari sidebar.`);
    }
  };

  const handleResetSidebarLinks = async () => {
    if (confirm("Reset tautan eksternal sidebar ke pengaturan awal?")) {
      const defaultList = DEFAULT_SITE_SETTINGS.sidebar_custom_links || [];
      setCmsForm((prev: any) => ({ ...prev, sidebar_custom_links: defaultList }));
      await updateSettings({ sidebar_custom_links: defaultList });
      toast.info("Tautan Sidebar Direset", "Daftar tautan eksternal dikembalikan ke default.");
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, catalogData, prodisData] = await Promise.all([
        api.getAdminUsers(),
        api.getMyItems().catch(() => api.getCatalog()),
        api.getProdis(),
      ]);
      setUsers(userData.users || []);
      setRoles(userData.roles || []);
      setItems(catalogData || []);
      setProdis(prodisData || []);
      if (prodisData && prodisData.length > 0 && !newProdiId) {
        setNewProdiId(prodisData[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load saved showcase configuration from database settings first, then persistent localStorage
  useEffect(() => {
    if (settings?.showcase_projects && Array.isArray(settings.showcase_projects) && settings.showcase_projects.length === 3) {
      setShowcaseProjects(settings.showcase_projects);
      return;
    }
    try {
      const saved = localStorage.getItem("VOKASI_SHOWCASE_PROJECTS");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) {
          setShowcaseProjects(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [settings?.showcase_projects]);

  const handleSaveShowcase = async () => {
    try {
      const synchronizedProjects = showcaseProjects.map((p) => ({
        ...p,
        title_en: autoTranslateIndonesianToEnglish(p.title) || p.title_en,
        titleHighlight_en: autoTranslateIndonesianToEnglish(p.titleHighlight) || p.titleHighlight_en,
        subtitle_en: autoTranslateIndonesianToEnglish(p.subtitle) || p.subtitle_en,
        ctaText_en: autoTranslateIndonesianToEnglish(p.ctaText) || p.ctaText_en,
        priceBadge_en: autoTranslateIndonesianToEnglish(p.priceBadge) || p.priceBadge_en,
        leftCallout: {
          ...p.leftCallout,
          category_en: autoTranslateIndonesianToEnglish(p.leftCallout.category) || p.leftCallout.category_en,
          title_en: autoTranslateIndonesianToEnglish(p.leftCallout.title) || p.leftCallout.title_en,
          description_en: autoTranslateIndonesianToEnglish(p.leftCallout.description) || p.leftCallout.description_en,
        },
        rightCallout: {
          ...p.rightCallout,
          category_en: autoTranslateIndonesianToEnglish(p.rightCallout.category) || p.rightCallout.category_en,
          title_en: autoTranslateIndonesianToEnglish(p.rightCallout.title) || p.rightCallout.title_en,
          description_en: autoTranslateIndonesianToEnglish(p.rightCallout.description) || p.rightCallout.description_en,
        },
      }));

      setShowcaseProjects(synchronizedProjects);
      localStorage.setItem("VOKASI_SHOWCASE_PROJECTS", JSON.stringify(synchronizedProjects));
      window.dispatchEvent(new Event("showcase_updated"));
      await updateSettings({ showcase_projects: synchronizedProjects });
      setShowcaseSavedSuccess(true);
      toast.success("Showcase Berhasil Disimpan", "3 video preview dan teks beranda telah tersimpan ke database MySQL.");
      setShowcaseSaveNotice("Berhasil! Pengaturan 3 video showcase & kata-kata beranda telah diperbarui secara real-time!");
      setTimeout(() => {
        setShowcaseSaveNotice(null);
        setShowcaseSavedSuccess(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      toast.error("Gagal Menyimpan", "Terjadi kesalahan saat menyimpan konfigurasi showcase.");
    }
  };

  const handleResetShowcase = () => {
    localStorage.removeItem("VOKASI_SHOWCASE_PROJECTS");
    setShowcaseProjects(DEFAULT_SHOWCASE_PROJECTS);
    window.dispatchEvent(new Event("showcase_updated"));
    updateSettings({ showcase_projects: DEFAULT_SHOWCASE_PROJECTS });
    toast.info("Reset Pengaturan Default", "Showcase video dan teks telah dikembalikan ke pengaturan awal Vokasi UNS.");
    setShowcaseSaveNotice("Berhasil direset ke pengaturan awal resmi Vokasi UNS!");
    setTimeout(() => setShowcaseSaveNotice(null), 4000);
  };

  const handleSaveCms = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setIsCmsSaving(true);
    try {
      // Auto-synchronize English translations for text fields
      const enrichedForm = { ...cmsForm };

      const textFields = [
        "hero_badge",
        "hero_title_p1",
        "hero_title_p2",
        "hero_subtitle",
        "hero_cta_catalog_text",
        "hero_cta_demo_text",
        "hero_stat_1_lbl",
        "hero_stat_2_lbl",
        "services_tagline",
        "services_title",
        "services_subtitle",
        "service_1_badge",
        "service_1_title",
        "service_1_desc",
        "service_1_btn",
        "service_2_badge",
        "service_2_title",
        "service_2_desc",
        "service_2_btn",
        "service_3_badge",
        "service_3_title",
        "service_3_desc",
        "service_3_btn",
        "hardware_section_tagline",
        "hardware_section_title",
        "hardware_section_desc",
        "hardware_left_label",
        "hardware_right_label",
        "softhouse_section_tagline",
        "softhouse_section_title",
        "softhouse_section_desc",
        "dudi_section_tagline",
        "dudi_section_title",
        "dudi_section_desc",
        "dudi_whatsapp_text",
      ];

      for (const field of textFields) {
        const val = enrichedForm[field];
        if (typeof val === "string" && val.trim().length > 0) {
          enrichedForm[`${field}_en`] = autoTranslateIndonesianToEnglish(val.trim());
        }
      }

      enrichedForm.header_nav_links = currentHeaderNavLinks;
      enrichedForm.sidebar_custom_links = currentSidebarLinks;

      const ok = await updateSettings(enrichedForm);
      if (ok) {
        setCmsForm(enrichedForm);
        setCmsSavedSuccess(true);
        toast.success("Pengaturan Berhasil Disimpan", "Tampilan logo, video hero, teks, dan translasi otomatis telah tersimpan ke database.");
        setTimeout(() => setCmsSavedSuccess(false), 3000);
      } else {
        toast.error("Gagal Menyimpan", "Gagal memperbarui pengaturan ke server database.");
      }
    } catch {
      toast.error("Gangguan Server", "Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsSubmitting(false);
      setIsCmsSaving(false);
    }
  };

  // Load and listen to FAQs in real-time from database settings
  useEffect(() => {
    if (settings?.site_faqs && Array.isArray(settings.site_faqs) && settings.site_faqs.length > 0) {
      setFaqs(settings.site_faqs);
    } else {
      setFaqs(getStoredFAQs());
    }
  }, [settings?.site_faqs]);

  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqCategory("Kemitraan & Lisensi");
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (item: FAQItem) => {
    setEditingFaq(item);
    setFaqQuestion(item.question);
    setFaqAnswer(item.answer);
    setFaqCategory(item.category || "Kemitraan & Lisensi");
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    let updated: FAQItem[];
    if (editingFaq) {
      updated = faqs.map((f) =>
        f.id === editingFaq.id
          ? { ...f, question: faqQuestion, answer: faqAnswer, category: faqCategory }
          : f
      );
      toast.success("FAQ Berhasil Diperbarui", "Pertanyaan dan jawaban FAQ tersimpan ke database MySQL.");
      setFaqNotice("Pertanyaan FAQ berhasil diperbarui di database!");
    } else {
      const newFaq: FAQItem = {
        id: Date.now(),
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory,
        isActive: true,
        orderIndex: faqs.length + 1,
      };
      updated = [...faqs, newFaq];
      toast.success("FAQ Baru Ditambahkan", "Pertanyaan baru langsung tersimpan di database MySQL & aktif di beranda.");
      setFaqNotice("Pertanyaan FAQ baru berhasil ditambahkan ke database!");
    }
    setFaqs(updated);
    saveStoredFAQs(updated);
    await updateSettings({ site_faqs: updated });
    setIsFaqModalOpen(false);
    setTimeout(() => setFaqNotice(null), 4000);
  };

  const handleToggleFaq = async (id: string | number) => {
    const updated = faqs.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f));
    setFaqs(updated);
    saveStoredFAQs(updated);
    await updateSettings({ site_faqs: updated });
    toast.info("Visibilitas FAQ", "Status aktif FAQ berhasil diperbarui di database.");
    setFaqNotice("Status visibilitas FAQ berhasil diperbarui di database!");
    setTimeout(() => setFaqNotice(null), 3000);
  };

  const handleDeleteFaq = async (id: string | number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pertanyaan FAQ ini dari sistem?")) {
      const updated = faqs.filter((f) => f.id !== id);
      setFaqs(updated);
      saveStoredFAQs(updated);
      await updateSettings({ site_faqs: updated });
      toast.info("FAQ Dihapus", "Pertanyaan telah dihapus permanen dari database.");
      setFaqNotice("Pertanyaan FAQ berhasil dihapus dari database!");
      setTimeout(() => setFaqNotice(null), 3000);
    }
  };

  const handleResetFaqs = async () => {
    if (confirm("Reset seluruh FAQ ke pertanyaan resmi awal Sekolah Vokasi UNS?")) {
      setFaqs(DEFAULT_FAQS);
      resetStoredFAQs();
      await updateSettings({ site_faqs: DEFAULT_FAQS });
      toast.info("FAQ Direset", "Daftar FAQ dikembalikan ke standar awal institusi di database.");
      setFaqNotice("FAQ berhasil direset ke pertanyaan default institusi di database!");
      setTimeout(() => setFaqNotice(null), 4000);
    }
  };

  const handleToggleUser = async (id: number) => {
    try {
      await api.toggleUser(id);
      toast.info("Status Akun Diperbarui", "Status aktif akun pengguna berhasil diubah.");
      loadData();
    } catch (e) {
      toast.error("Gagal Mengubah", "Tidak dapat mengubah status pengguna.");
    }
  };

  const handleUpdateItemStatus = async (id: number, status: string) => {
    try {
      await api.updateItemStatus(id, status);
      toast.success("Status Moderasi Diperbarui", `Inovasi telah diset menjadi status ${status.toUpperCase()}.`);
      loadData();
    } catch (e) {
      toast.error("Gagal Memperbarui", "Tidak dapat memperbarui status moderasi.");
    }
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemForm({
      nama_item: "",
      category_id: 1,
      prodi_id: prodis[0]?.id || 1,
      tagline: "",
      deskripsi_singkat: "",
      deskripsi_lengkap: "",
      live_demo_url: "",
      model_3d_url: "",
      thumbnail_url: "/images/brand/slogan-poster-vokasi.jpg",
      status_publikasi: "published",
      harga_tipe: "starting_at",
      harga_nominal: 5000000,
      pic_nama: "",
      pic_kontak: "6281234567890",
      pic_laboratorium: "Laboratorium Riset Terapan SV",
      specs: [
        { group_name: "Tech Stack", spec_key: "Frontend", spec_value: "Next.js 14, Tailwind CSS" },
        { group_name: "Tech Stack", spec_key: "Backend API", spec_value: "Laravel 11 REST API" },
      ],
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: any) => {
    setEditingItem(item);
    setItemForm({
      nama_item: item.nama_item || "",
      category_id: item.category_id || item.category?.id || 1,
      prodi_id: item.prodi_id || item.prodi?.id || (prodis[0]?.id ?? 1),
      tagline: item.tagline || "",
      deskripsi_singkat: item.deskripsi_singkat || "",
      deskripsi_lengkap: item.deskripsi_lengkap || "",
      live_demo_url: item.live_demo_url || "",
      model_3d_url: item.model_3d_url || "",
      thumbnail_url: item.thumbnail_url || "/images/brand/slogan-poster-vokasi.jpg",
      status_publikasi: item.status_publikasi || "published",
      harga_tipe: item.harga_tipe || "starting_at",
      harga_nominal: Number(item.harga_nominal) || 0,
      pic_nama: item.pic_nama || "",
      pic_kontak: item.pic_kontak || "",
      pic_laboratorium: item.pic_laboratorium || "",
      specs: item.specs && item.specs.length > 0
        ? item.specs.map((s: any) => ({
            group_name: s.group_name || "Umum",
            spec_key: s.spec_key || "",
            spec_value: s.spec_value || "",
          }))
        : [
            { group_name: "Tech Stack", spec_key: "Platform", spec_value: "Web Application" },
          ],
    });
    setIsItemModalOpen(true);
  };

  const handleAddSpec = () => {
    setItemForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { group_name: "Umum", spec_key: "", spec_value: "" }],
    }));
  };

  const handleRemoveSpec = (idx: number) => {
    setItemForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx),
    }));
  };

  const handleSpecChange = (idx: number, field: string, val: string) => {
    setItemForm((prev) => {
      const updated = [...prev.specs];
      (updated[idx] as any)[field] = val;
      return { ...prev, specs: updated };
    });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.nama_item.trim()) {
      toast.error("Nama Produk Wajib Diisi", "Harap masukkan nama produk inovasi.");
      return;
    }
    if (!itemForm.deskripsi_singkat.trim()) {
      toast.error("Deskripsi Singkat Wajib Diisi", "Harap masukkan ringkasan deskripsi produk.");
      return;
    }
    setIsItemSubmitting(true);
    try {
      const payload = {
        ...itemForm,
        harga_nominal: Number(itemForm.harga_nominal),
        live_demo_url: itemForm.live_demo_url?.trim() || null,
        model_3d_url: itemForm.model_3d_url?.trim() || null,
        specs: itemForm.specs.filter((s) => s.spec_key.trim() !== ""),
      };

      if (editingItem) {
        const res = await api.updateItem(editingItem.id, payload);
        if (res.success) {
          toast.success("Inovasi Berhasil Diperbarui", `Perubahan data "${itemForm.nama_item}" telah disimpan.`);
          setIsItemModalOpen(false);
          setEditingItem(null);
          loadData();
        } else {
          toast.error("Gagal Memperbarui", res.message || "Periksa kembali kelengkapan data.");
        }
      } else {
        const res = await api.createItem(payload);
        if (res.success) {
          toast.success("Inovasi Berhasil Ditambahkan", `Produk "${itemForm.nama_item}" telah didaftarkan ke katalog.`);
          setIsItemModalOpen(false);
          loadData();
        } else {
          toast.error("Gagal Menambahkan", res.message || "Periksa kembali kelengkapan data.");
        }
      }
    } catch {
      toast.error("Koneksi Bermasalah", "Gagal menghubungi server backend.");
    } finally {
      setIsItemSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk inovasi "${name}" secara permanen? Data yang dihapus tidak dapat dipulihkan.`)) {
      return;
    }
    try {
      const res = await api.deleteItem(id);
      if (res) {
        toast.info("Inovasi Dihapus", `Item "${name}" telah berhasil dihapus dari sistem.`);
        loadData();
      } else {
        toast.error("Gagal Menghapus", "Terjadi kesalahan saat menghapus inovasi.");
      }
    } catch {
      toast.error("Koneksi Bermasalah", "Gagal menghapus produk inovasi.");
    }
  };

  const handleOpenEditUser = (user: any) => {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPassword("");
    setShowEditPassword(false);
    setEditRoleId(user.role_id || user.role?.id || 3);
    setEditProdiId(user.prodi_id || user.prodi?.id || (prodis[0]?.id ?? 1));
    setIsEditUserModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: editName,
        email: editEmail,
        role_id: editRoleId,
        prodi_id: editRoleId === 3 ? (editProdiId || (prodis[0]?.id ?? 1)) : null,
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }
      const res = await api.updateUser(editingUser.id, payload);
      if (res.success) {
        toast.success("Akun Berhasil Diperbarui", `Data ${editName} ${editPassword ? "dan kata sandi baru " : ""}telah disimpan.`);
        setIsEditUserModal(false);
        setEditingUser(null);
        loadData();
      } else {
        toast.error("Gagal Memperbarui", res.message || "Periksa kembali isian formulir.");
      }
    } catch {
      toast.error("Koneksi Bermasalah", "Gagal menghubungi server backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (id === 1 || id === 4) {
      toast.error("Akun Dilindungi", "Akun Super Administrator Utama dilindungi dan tidak dapat dihapus.");
      return;
    }
    if (!confirm(`Apakah Anda yakin ingin menghapus akun "${name}" secara permanen dari sistem?`)) {
      return;
    }
    try {
      const res = await api.deleteUser(id);
      if (res.success) {
        toast.success("Akun Dihapus", `Akun ${name} telah berhasil dihapus dari sistem.`);
        loadData();
      } else {
        toast.error("Gagal Menghapus", res.message || "Tidak dapat menghapus akun ini.");
      }
    } catch {
      toast.error("Koneksi Bermasalah", "Gagal menghapus pengguna.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role_id: newRoleId,
        prodi_id: newRoleId === 3 ? (newProdiId || (prodis[0]?.id ?? 1)) : null,
      });
      if (res.success) {
        toast.success("Akun Berhasil Didaftarkan", `Pengguna ${newName} siap mengakses sistem sesuai hak akses.`);
        setIsNewUserModal(false);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        loadData();
      } else {
        toast.error("Pendaftaran Gagal", res.message || "Periksa kembali kelengkapan formulir atau email telah terdaftar.");
      }
    } catch {
      toast.error("Koneksi Bermasalah", "Gagal menghubungi server backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const superAdminCount = users.filter((u) => u.role?.name === "super_admin" || u.role_id === 1).length;
  const pimpinanCount = users.filter((u) => u.role?.name === "pimpinan_sv" || u.role_id === 2).length;
  const prodiCount = users.filter((u) => u.role?.name === "prodi" || u.role_id === 3).length;

  const filteredUsers = users.filter((u) => {
    const rMatch =
      userRoleFilter === "all" ||
      (userRoleFilter === "super_admin" && (u.role?.name === "super_admin" || u.role_id === 1)) ||
      (userRoleFilter === "pimpinan_sv" && (u.role?.name === "pimpinan_sv" || u.role_id === 2)) ||
      (userRoleFilter === "prodi" && (u.role?.name === "prodi" || u.role_id === 3));
    const qMatch =
      !userSearchQuery.trim() ||
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.prodi?.nama_prodi && u.prodi.nama_prodi.toLowerCase().includes(userSearchQuery.toLowerCase()));
    return rMatch && qMatch;
  });

  const filteredCatalogItems = items.filter((item: any) => {
    const catMatch =
      itemCategoryFilter === "all" ||
      item.category_id?.toString() === itemCategoryFilter ||
      item.category?.id?.toString() === itemCategoryFilter ||
      item.category?.slug === itemCategoryFilter;

    const statusMatch =
      itemStatusFilter === "all" ||
      item.status_publikasi?.toLowerCase() === itemStatusFilter.toLowerCase();

    const searchLower = itemSearchQuery.toLowerCase();
    const searchMatch =
      !itemSearchQuery.trim() ||
      item.nama_item?.toLowerCase().includes(searchLower) ||
      (item.tagline && item.tagline.toLowerCase().includes(searchLower)) ||
      (item.prodi?.nama_prodi && item.prodi.nama_prodi.toLowerCase().includes(searchLower)) ||
      (item.pic_nama && item.pic_nama.toLowerCase().includes(searchLower));

    return catMatch && statusMatch && searchMatch;
  });

  const formatRupiah = (val: number) => {
    if (!val || val === 0) return "Hubungi Kami";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span 
            style={{ borderRadius: "9999px" }}
            className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0F4C81] dark:text-sky-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wider inline-block"
          >
            Portal Otoritas Super Admin
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            Manajemen Pengguna & Moderasi Inovasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Pengelolaan akun civitas akademika (Admin Prodi & Pimpinan) serta moderasi status rilis katalog.
          </p>
        </div>

        {activeTab === "users" && (
          <button
            type="button"
            onClick={() => setIsNewUserModal(true)}
            style={{ borderRadius: "9999px" }}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftarkan Akun Baru</span>
          </button>
        )}
      </div>

      {/* Admin Nav Tabs with Horizontal Scroll on Mobile */}
      <div 
        className="flex items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-slate-200/80 dark:bg-[#0A2540] border border-slate-300/80 dark:border-[#C5A059]/30 overflow-x-auto scrollbar-none w-full sm:w-max max-w-full shadow-xs"
      >
        <button
          type="button"
          onClick={() => handleTabChange("users")}
          style={{ borderRadius: "9999px" }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "users"
              ? "bg-[#0F4C81] text-white shadow-md font-black"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Pengguna Sistem ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("moderation")}
          style={{ borderRadius: "9999px" }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "moderation"
              ? "bg-[#0F4C81] text-white shadow-md font-black"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
          }`}
        >
          <Shield className="w-4 h-4 shrink-0" />
          <span>Kelola Katalog ({items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("prodis")}
          style={{ borderRadius: "9999px" }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "prodis"
              ? "bg-[#0F4C81] text-white shadow-md font-black ring-2 ring-[#FFD800]/50"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#FFD800] shrink-0" />
          <span>Kelola Program Studi ({prodis.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("showcase")}
          style={{ borderRadius: "9999px" }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "showcase"
              ? "bg-gradient-to-r from-[#C5A059] to-[#dfba6a] text-[#0A2540] shadow-md font-black"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
          }`}
        >
          <Film className="w-4 h-4 shrink-0" />
          <span>Showcase Video Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("faqs")}
          style={{ borderRadius: "9999px" }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "faqs"
              ? "bg-[#0F4C81] dark:bg-[#C5A059] text-white dark:text-[#0A2540] shadow-md font-black"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Kelola FAQ ({faqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("site_cms")}
          style={{ borderRadius: "9999px" }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "site_cms"
              ? "bg-gradient-to-r from-[#0F4C81] to-[#0A2540] text-white shadow-md font-black ring-2 ring-sky-400/40"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>CMS Landing Page & Footer</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("partners")}
          style={{ borderRadius: "9999px" }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "partners"
              ? "bg-gradient-to-r from-[#0F4C81] to-[#C5A059] text-white shadow-md font-black ring-2 ring-amber-400/40"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
          }`}
        >
          <Handshake className="w-4 h-4 shrink-0" />
          <span>Mitra Industri & Running Logo ({partnerList.length})</span>
        </button>
      </div>

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* 1. Sleek Compact 3-Role Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {/* Card 1: Super Admin */}
            <div
              onClick={() => setUserRoleFilter(userRoleFilter === "super_admin" ? "all" : "super_admin")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                userRoleFilter === "super_admin"
                  ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#0F4C81] ring-2 ring-[#0F4C81] shadow-sm"
                  : "bg-white dark:bg-[#07192C] border-slate-200/90 dark:border-slate-800 hover:border-blue-400 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      ★ Super Admin
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0F4C81] dark:text-sky-300 font-bold">
                      Penuh
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block truncate mt-0.5">
                    admin / admin
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                {superAdminCount} Akun
              </span>
            </div>

            {/* Card 2: Pimpinan SV */}
            <div
              onClick={() => setUserRoleFilter(userRoleFilter === "pimpinan_sv" ? "all" : "pimpinan_sv")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                userRoleFilter === "pimpinan_sv"
                  ? "bg-amber-50/80 dark:bg-amber-950/40 border-[#C5A059] ring-2 ring-[#C5A059] shadow-sm"
                  : "bg-white dark:bg-[#07192C] border-slate-200/90 dark:border-slate-800 hover:border-[#C5A059] shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-[#C5A059] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      Pimpinan SV
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-[#C5A059] font-bold">
                      Eksekutif
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block truncate mt-0.5">
                    pimpinan@vokasi
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                {pimpinanCount} Akun
              </span>
            </div>

            {/* Card 3: Admin Prodi */}
            <div
              onClick={() => setUserRoleFilter(userRoleFilter === "prodi" ? "all" : "prodi")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                userRoleFilter === "prodi"
                  ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500 shadow-sm"
                  : "bg-white dark:bg-[#07192C] border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      Admin Prodi TIF
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold">
                      Kelola
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block truncate mt-0.5">
                    admin.tif@vokasi
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                {prodiCount} Akun
              </span>
            </div>
          </div>

          {/* 2. Unified Card: Toolbar, Filters & Table */}
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden text-left">
            {/* Top Toolbar */}
            <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                  Daftar Akun Pengguna Terdaftar (RBAC 3 Peran)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Menampilkan {filteredUsers.length} dari total {users.length} akun aktif di database MySQL.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto">
                {/* Search Box */}
                <div className="relative flex-1 md:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Cari nama, email, prodi..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] transition font-medium"
                  />
                </div>

                {/* + Akun Baru Button */}
                <button
                  type="button"
                  onClick={() => setIsNewUserModal(true)}
                  style={{ borderRadius: "9999px" }}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Akun Baru</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs Sub-bar (Smooth Horizontal Scroll on Mobile) */}
            <div className="px-3 sm:px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                Filter:
              </span>
              <button
                type="button"
                onClick={() => setUserRoleFilter("all")}
                style={{ borderRadius: "9999px" }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
                  userRoleFilter === "all"
                    ? "bg-[#0F4C81] text-white shadow-2xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Semua ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setUserRoleFilter("super_admin")}
                style={{ borderRadius: "9999px" }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
                  userRoleFilter === "super_admin"
                    ? "bg-[#0F4C81] text-white shadow-2xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Super Admin ({superAdminCount})
              </button>
              <button
                type="button"
                onClick={() => setUserRoleFilter("pimpinan_sv")}
                style={{ borderRadius: "9999px" }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
                  userRoleFilter === "pimpinan_sv"
                    ? "bg-[#C5A059] text-[#0A2540] shadow-2xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Pimpinan SV ({pimpinanCount})
              </button>
              <button
                type="button"
                onClick={() => setUserRoleFilter("prodi")}
                style={{ borderRadius: "9999px" }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${
                  userRoleFilter === "prodi"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Admin Prodi ({prodiCount})
              </button>
            </div>

            {/* Desktop Table Area (Hidden on Mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10.5px] uppercase tracking-wider bg-slate-50/40 dark:bg-slate-900/20">
                    <th className="py-3 px-5 font-extrabold w-[30%]">Nama Pengguna</th>
                    <th className="py-3 px-4 font-extrabold w-[25%]">Email UNS</th>
                    <th className="py-3 px-4 font-extrabold w-[20%]">Peran Akses</th>
                    <th className="py-3 px-4 font-extrabold text-center w-[11%]">Status</th>
                    <th className="py-3 px-5 font-extrabold text-right w-[14%]">Aksi Pengelolaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                        Tidak ada akun pengguna yang cocok dengan pencarian & filter saat ini.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u: any) => {
                      const isSuper = u.role?.name === "super_admin" || u.role_id === 1;
                      const isPimpinan = u.role?.name === "pimpinan_sv" || u.role_id === 2;
                      const isProtected = u.id === 1 || u.id === 4;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          {/* Nama Pengguna */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                                isSuper
                                  ? "bg-blue-100 text-[#0F4C81] dark:bg-blue-950 dark:text-sky-300 ring-2 ring-blue-400/30"
                                  : isPimpinan
                                  ? "bg-amber-100 text-[#C5A059] dark:bg-amber-950 dark:text-[#C5A059] ring-2 ring-amber-400/30"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 ring-2 ring-emerald-400/30"
                              }`}>
                                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 dark:text-white block truncate leading-tight">
                                  {u.name}
                                </span>
                                {isProtected && (
                                  <span className="text-[9.5px] font-black text-[#C5A059] uppercase tracking-wider block mt-0.5">
                                    ★ Akun Utama
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email UNS */}
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-medium block truncate">
                              {u.email}
                            </span>
                          </td>

                          {/* Peran Akses */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className={`text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full inline-block w-fit ${
                                isSuper
                                  ? "bg-blue-100 dark:bg-blue-950/80 text-[#0F4C81] dark:text-sky-300 border border-blue-200 dark:border-blue-900"
                                  : isPimpinan
                                  ? "bg-amber-100 dark:bg-amber-950/80 text-[#C5A059] border border-amber-200 dark:border-amber-900"
                                  : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                              }`}>
                                {u.role?.label || u.role?.name || "User"}
                              </span>
                              {u.prodi?.nama_prodi && (
                                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium truncate block">
                                  {u.prodi.nama_prodi}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                              u.is_active
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}>
                              {u.is_active ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>

                          {/* Opsi Pengelolaan (CRUD) */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit & Ganti Password */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(u)}
                                style={{ borderRadius: "9999px" }}
                                className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-[#0F4C81] hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1 shadow-2xs border border-slate-200/80 dark:border-slate-700"
                                title="Edit akun atau ganti kata sandi"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit / Ganti PW</span>
                              </button>

                              {/* Toggle Status */}
                              <button
                                type="button"
                                onClick={() => handleToggleUser(u.id)}
                                style={{ borderRadius: "9999px" }}
                                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                                  u.is_active
                                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100"
                                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100"
                                }`}
                                title={u.is_active ? "Nonaktifkan akun" : "Aktifkan akun"}
                              >
                                {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                              </button>

                              {/* Delete */}
                              {!isProtected && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  style={{ borderRadius: "9999px" }}
                                  className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                                  title="Hapus akun permanen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card-Based View (Optimized for Phones) */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  Tidak ada akun pengguna yang cocok dengan pencarian & filter saat ini.
                </div>
              ) : (
                filteredUsers.map((u: any) => {
                  const isSuper = u.role?.name === "super_admin" || u.role_id === 1;
                  const isPimpinan = u.role?.name === "pimpinan_sv" || u.role_id === 2;
                  const isProtected = u.id === 1 || u.id === 4;

                  return (
                    <div key={u.id} className="p-3.5 space-y-3 bg-white dark:bg-[#07192C]">
                      {/* User Info Bar */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div 
                            style={{ borderRadius: "9999px" }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                              isSuper
                                ? "bg-blue-600 text-white"
                                : isPimpinan
                                ? "bg-[#C5A059] text-[#0A2540]"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                {u.name}
                              </span>
                              {isProtected && (
                                <span 
                                  style={{ borderRadius: "9999px" }}
                                  className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                                >
                                  Utama
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate font-mono mt-0.5">
                              {u.email}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          u.is_active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}>
                          {u.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>

                      {/* Role & Prodi Tag */}
                      <div className="flex items-center gap-1.5 text-xs flex-wrap">
                        <span 
                          style={{ borderRadius: "9999px" }}
                          className={`inline-flex items-center gap-1 text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            isSuper
                              ? "bg-blue-50 dark:bg-blue-950/70 text-[#0F4C81] dark:text-sky-300 border border-blue-200 dark:border-blue-800"
                              : isPimpinan
                              ? "bg-amber-50 dark:bg-amber-950/70 text-[#C5A059] border border-amber-200 dark:border-amber-800"
                              : "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          {isSuper ? <Shield className="w-3 h-3" /> : isPimpinan ? <Award className="w-3 h-3" /> : <Laptop className="w-3 h-3" />}
                          <span>{u.role?.label || u.role?.name || "User"}</span>
                        </span>
                        {u.prodi?.nama_prodi && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                            • {u.prodi.nama_prodi}
                          </span>
                        )}
                      </div>

                      {/* Touch-Friendly Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          style={{ borderRadius: "9999px" }}
                          className="flex-1 py-1.5 px-3 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-[#0F4C81] hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center justify-center gap-1 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit / Ganti PW</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleUser(u.id)}
                          style={{ borderRadius: "9999px" }}
                          className={`py-1.5 px-3 rounded-full text-xs font-bold transition cursor-pointer border ${
                            u.is_active
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900/60"
                              : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60"
                          }`}
                        >
                          {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </button>

                        {!isProtected && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            style={{ borderRadius: "9999px" }}
                            className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer border border-transparent"
                            title="Hapus akun permanen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Moderation & Full Catalog CRUD Section */}
      {activeTab === "moderation" && (
        <div className="space-y-6">
          {/* Top Card Header & Actions */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-[#0F4C81] dark:text-sky-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    Tata Kelola & Moderasi Katalog Inovasi ({items.length})
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Pusat kendali CRUD penuh produk inovasi: Daftarkan produk baru, ubah data teknis & harga, serta moderasi status publikasi.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddItem}
                style={{ borderRadius: "9999px" }}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Inovasi Baru</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  placeholder="Cari inovasi berdasarkan nama, tagline, PIC, atau prodi..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0F4C81]/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={itemCategoryFilter}
                  onChange={(e) => setItemCategoryFilter(e.target.value)}
                  style={{ borderRadius: "9999px" }}
                  aria-label="Filter Berdasarkan Kategori"
                  className="px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="1">1. Teknologi & SaaS</option>
                  <option value="2">2. Produk Fisik & IoT</option>
                  <option value="3">3. Jasa & Konsultasi</option>
                </select>

                <select
                  value={itemStatusFilter}
                  onChange={(e) => setItemStatusFilter(e.target.value)}
                  style={{ borderRadius: "9999px" }}
                  aria-label="Filter Berdasarkan Status"
                  className="px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table / Cards Container */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm">
            {filteredCatalogItems.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Tidak ditemukan item inovasi yang sesuai dengan filter pencarian.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddItem}
                  style={{ borderRadius: "9999px" }}
                  className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0F4C81] text-white text-xs sm:text-sm font-bold hover:bg-[#0A2540] transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Sekarang</span>
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-extrabold">
                        <th className="pb-3.5 font-bold">Produk Inovasi</th>
                        <th className="pb-3.5 font-bold">Prodi Pelaksana</th>
                        <th className="pb-3.5 font-bold">Kategori</th>
                        <th className="pb-3.5 font-bold">Tarif / Nilai</th>
                        <th className="pb-3.5 font-bold text-center">Status</th>
                        <th className="pb-3.5 font-bold text-right">Aksi Pengelolaan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {filteredCatalogItems.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.thumbnail_url || "/images/brand/slogan-poster-vokasi.jpg"}
                                alt={item.nama_item}
                                className="w-12 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
                              />
                              <div className="max-w-xs">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                                  {item.nama_item}
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1 font-medium mt-0.5">
                                  {item.tagline || `PIC: ${item.pic_nama || "-"}`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-slate-600 dark:text-slate-300 font-medium text-xs">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                              {item.prodi?.nama_prodi || "Vokasi UNS"}
                            </span>
                          </td>
                          <td className="py-4 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                            {item.category?.nama || "Inovasi"}
                          </td>
                          <td className="py-4">
                            <span className="font-extrabold text-xs text-[#0A2540] dark:text-[#C5A059] block">
                              {formatRupiah(item.harga_nominal)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">
                              {item.harga_tipe}
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            <span 
                              style={{ borderRadius: "9999px" }}
                              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                item.status_publikasi === "published"
                                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                  : item.status_publikasi === "draft"
                                  ? "bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400"
                                  : "bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {item.status_publikasi}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Quick View Button */}
                              {item.slug && (
                                <a
                                  href={`/katalog/${item.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ borderRadius: "9999px" }}
                                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                                  title="Lihat Halaman Publik"
                                >
                                  <ExtLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Status Quick Toggle */}
                              {item.status_publikasi !== "published" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemStatus(item.id, "published")}
                                  style={{ borderRadius: "9999px" }}
                                  className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-500/25 transition cursor-pointer"
                                  title="Terbitkan"
                                >
                                  Publish
                                </button>
                              )}
                              {item.status_publikasi !== "draft" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemStatus(item.id, "draft")}
                                  style={{ borderRadius: "9999px" }}
                                  className="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                                  title="Jadikan Draft"
                                >
                                  Draft
                                </button>
                              )}

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditItem(item)}
                                style={{ borderRadius: "9999px" }}
                                className="px-3 py-1 rounded-full bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20 hover:bg-[#0F4C81]/25 text-[#0F4C81] dark:text-sky-300 border border-[#0F4C81]/30 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                                title="Edit Detail Inovasi"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id, item.nama_item)}
                                style={{ borderRadius: "9999px" }}
                                className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition cursor-pointer"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile & Tablet Card-Based Moderation View */}
                <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCatalogItems.map((item: any) => (
                    <div key={item.id} className="py-4 space-y-3">
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
                            <span 
                              style={{ borderRadius: "9999px" }}
                              className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                                item.status_publikasi === "published"
                                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                  : item.status_publikasi === "draft"
                                  ? "bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400"
                                  : "bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {item.status_publikasi}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block truncate font-medium mt-0.5">
                            {item.prodi?.nama_prodi} • {item.category?.nama}
                          </span>
                          <span className="font-extrabold text-xs text-[#0A2540] dark:text-[#C5A059] block mt-1">
                            {formatRupiah(item.harga_nominal)} ({item.harga_tipe})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          {item.status_publikasi !== "published" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateItemStatus(item.id, "published")}
                              style={{ borderRadius: "9999px" }}
                              className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-xs"
                            >
                              Publish
                            </button>
                          )}
                          {item.status_publikasi !== "draft" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateItemStatus(item.id, "draft")}
                              style={{ borderRadius: "9999px" }}
                              className="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold text-xs"
                            >
                              Draft
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.slug && (
                            <a
                              href={`/katalog/${item.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ borderRadius: "9999px" }}
                              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              title="Lihat"
                            >
                              <ExtLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditItem(item)}
                            style={{ borderRadius: "9999px" }}
                            className="px-3 py-1 rounded-full bg-[#0F4C81] text-white font-bold text-xs flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.nama_item)}
                            style={{ borderRadius: "9999px" }}
                            className="p-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400"
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
      )}

      {/* 🎬 Showcase Video & Callouts Manager */}
      {activeTab === "showcase" && (
        <div className="space-y-6">
          {showcaseSaveNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{showcaseSaveNotice}</span>
              </div>
              <button 
                type="button"
                onClick={() => setShowcaseSaveNotice(null)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Slot Selector: 01 Robot, 02 SaaS, 03 Software House */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  Konfigurasi Showcase Beranda
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white mt-0.5">
                  Pilih Slot Video & Kata-Kata yang Ingin Diedit
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Atur video preview tengah, batas durasi detik per video (maksimal 30s), serta teks spesifikasi kiri & kanan secara fleksibel.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleResetShowcase}
                  className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer text-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveShowcase}
                  className={`w-full sm:w-auto justify-center px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer text-center ${
                    showcaseSavedSuccess
                      ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/30"
                      : "bg-[#0F4C81] text-white hover:bg-[#0A2540]"
                  }`}
                >
                  {showcaseSavedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                      <span>Tersimpan!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Slot Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {showcaseProjects.map((p: ShowcaseProject, idx: number) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedSlot(idx)}
                  style={{ borderRadius: "20px" }}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedSlot === idx
                      ? "border-[#0F4C81] dark:border-[#C5A059] bg-blue-50/50 dark:bg-white/5 ring-2 ring-[#0F4C81]/30 dark:ring-[#C5A059]/30"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#C5A059]">SLOT 0{idx + 1}</span>
                    <span className="text-slate-400 font-mono text-xs">{p.maxDurationSeconds} Detik</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                    {p.title} {p.titleHighlight}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-mono">
                    {p.videoSrc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Editor for Selected Slot */}
          {showcaseProjects[selectedSlot] && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-left">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#0F4C81] dark:text-[#C5A059] uppercase tracking-wider">
                    Mengedit Slot 0{selectedSlot + 1}:
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {showcaseProjects[selectedSlot].title} {showcaseProjects[selectedSlot].titleHighlight}
                  </h3>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 w-fit">
                  {showcaseProjects[selectedSlot].tag}
                </span>
              </div>

              {/* Video & Duration Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <MediaUploader
                    label="Upload Video Showcase Beranda (Drag & Drop)"
                    description="Upload video MP4/WEBM (Maks 50MB, durasi maksimal 30 detik)"
                    acceptedType="video"
                    maxSizeMb={50}
                    maxDurationSeconds={30}
                    currentUrl={showcaseProjects[selectedSlot].videoSrc}
                    onUploadSuccess={(url, info) => {
                      if (url) {
                        const updated = [...showcaseProjects];
                        updated[selectedSlot].videoSrc = url;
                        if (info?.duration) {
                          updated[selectedSlot].maxDurationSeconds = Math.min(30, Math.max(5, Math.round(info.duration)));
                        }
                        setShowcaseProjects(updated);
                      }
                    }}
                  />

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Atau Tuliskan Path Manual / URL Video Web:
                    </label>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={showcaseProjects[selectedSlot].videoSrc}
                        onChange={(e) => {
                          const updated = [...showcaseProjects];
                          updated[selectedSlot].videoSrc = e.target.value;
                          setShowcaseProjects(updated);
                        }}
                        placeholder="/videos/nama-video.mp4"
                        className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Batas Detik Durasi Video (Maksimal per Video)
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={showcaseProjects[selectedSlot].maxDurationSeconds}
                      onChange={(e) => {
                        const updated = [...showcaseProjects];
                        updated[selectedSlot].maxDurationSeconds = Number(e.target.value) || 30;
                        setShowcaseProjects(updated);
                      }}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Setelah durasi detik ini, showcase otomatis beralih halus ke video berikutnya.
                  </p>
                </div>
              </div>

              {/* Titles & Copywriting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Judul Proyek
                  </label>
                  <input
                    type="text"
                    value={showcaseProjects[selectedSlot].title}
                    onChange={(e) => {
                      const updated = [...showcaseProjects];
                      updated[selectedSlot].title = e.target.value;
                      setShowcaseProjects(updated);
                    }}
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Judul Highlight (Teks Berwarna Emas)
                  </label>
                  <input
                    type="text"
                    value={showcaseProjects[selectedSlot].titleHighlight}
                    onChange={(e) => {
                      const updated = [...showcaseProjects];
                      updated[selectedSlot].titleHighlight = e.target.value;
                      setShowcaseProjects(updated);
                    }}
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#C5A059] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Subtitle / Keterangan Penjelasan Proyek
                </label>
                <input
                  type="text"
                  value={showcaseProjects[selectedSlot].subtitle}
                  onChange={(e) => {
                    const updated = [...showcaseProjects];
                    updated[selectedSlot].subtitle = e.target.value;
                    setShowcaseProjects(updated);
                  }}
                  className="w-full px-4 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Left & Right Callouts Editor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Left Callout Card */}
                <div style={{ borderRadius: "22px" }} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Bagian Kiri (Spesifikasi Kiri)</span>
                  </span>
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Label Kategori
                    </label>
                    <input
                      type="text"
                      value={showcaseProjects[selectedSlot].leftCallout.category}
                      onChange={(e) => {
                        const updated = [...showcaseProjects];
                        updated[selectedSlot].leftCallout.category = e.target.value;
                        setShowcaseProjects(updated);
                      }}
                      className="w-full px-3.5 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Judul Spesifikasi Kiri
                    </label>
                    <input
                      type="text"
                      value={showcaseProjects[selectedSlot].leftCallout.title}
                      onChange={(e) => {
                        const updated = [...showcaseProjects];
                        updated[selectedSlot].leftCallout.title = e.target.value;
                        setShowcaseProjects(updated);
                      }}
                      className="w-full px-3.5 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Kata-Kata Deskripsi Kiri
                    </label>
                    <textarea
                      rows={3}
                      value={showcaseProjects[selectedSlot].leftCallout.description}
                      onChange={(e) => {
                        const updated = [...showcaseProjects];
                        updated[selectedSlot].leftCallout.description = e.target.value;
                        setShowcaseProjects(updated);
                      }}
                      style={{ borderRadius: "18px" }}
                      className="w-full p-3.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>
                </div>

                {/* Right Callout Card */}
                <div style={{ borderRadius: "22px" }} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                    <AlignRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Bagian Kanan (Spesifikasi Kanan)</span>
                  </span>
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Label Kategori
                    </label>
                    <input
                      type="text"
                      value={showcaseProjects[selectedSlot].rightCallout.category}
                      onChange={(e) => {
                        const updated = [...showcaseProjects];
                        updated[selectedSlot].rightCallout.category = e.target.value;
                        setShowcaseProjects(updated);
                      }}
                      className="w-full px-3.5 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Judul Spesifikasi Kanan
                    </label>
                    <input
                      type="text"
                      value={showcaseProjects[selectedSlot].rightCallout.title}
                      onChange={(e) => {
                        const updated = [...showcaseProjects];
                        updated[selectedSlot].rightCallout.title = e.target.value;
                        setShowcaseProjects(updated);
                      }}
                      className="w-full px-3.5 py-2 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Kata-Kata Deskripsi Kanan
                    </label>
                    <textarea
                      rows={3}
                      value={showcaseProjects[selectedSlot].rightCallout.description}
                      onChange={(e) => {
                        const updated = [...showcaseProjects];
                        updated[selectedSlot].rightCallout.description = e.target.value;
                        setShowcaseProjects(updated);
                      }}
                      style={{ borderRadius: "18px" }}
                      className="w-full p-3.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Price & Action CTA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Label Badge Harga
                  </label>
                  <input
                    type="text"
                    value={showcaseProjects[selectedSlot].priceBadge}
                    onChange={(e) => {
                      const updated = [...showcaseProjects];
                      updated[selectedSlot].priceBadge = e.target.value;
                      setShowcaseProjects(updated);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Nominal Harga / Keterangan
                  </label>
                  <input
                    type="text"
                    value={showcaseProjects[selectedSlot].price}
                    onChange={(e) => {
                      const updated = [...showcaseProjects];
                      updated[selectedSlot].price = e.target.value;
                      setShowcaseProjects(updated);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Teks Tombol Aksi
                  </label>
                  <input
                    type="text"
                    value={showcaseProjects[selectedSlot].ctaText}
                    onChange={(e) => {
                      const updated = [...showcaseProjects];
                      updated[selectedSlot].ctaText = e.target.value;
                      setShowcaseProjects(updated);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Bottom Save Bar */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveShowcase}
                  style={{ borderRadius: "9999px" }} className="px-7 py-3 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] text-white text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan Showcase Beranda</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FAQs Management Tab */}
      {activeTab === "faqs" && (
        <div className="space-y-6 text-left">
          {faqNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{faqNotice}</span>
              </div>
              <button onClick={() => setFaqNotice(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top Bar with Stats & Actions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Daftar Tanya Jawab & Informasi Kemitraan (FAQ)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola pertanyaan umum yang tampil di halaman beranda. Anda dapat menambah pertanyaan baru, menyembunyikan sementara, atau menghapus permanen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={handleResetFaqs}
                className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer text-center"
                title="Kembalikan ke FAQ Default Resmi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddFaq}
                className="w-full sm:w-auto justify-center px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] hover:from-[#135a96] hover:to-[#0c3156] text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-center"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah FAQ Baru</span>
              </button>
            </div>
          </div>

          {/* FAQ Cards / List */}
          <div className="grid grid-cols-1 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`p-5 rounded-2xl border transition-all ${
                  faq.isActive !== false
                    ? "bg-white dark:bg-[#07192C] border-slate-200/80 dark:border-slate-800 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-800 opacity-70"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    {faq.category && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                        {faq.category}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      faq.isActive !== false
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}>
                      {faq.isActive !== false ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Tampil di Beranda</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Disembunyikan</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(faq.id)}
                      style={{ borderRadius: "9999px" }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        faq.isActive !== false
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-700"
                          : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                      }`}
                      title={faq.isActive !== false ? "Sembunyikan dari beranda" : "Tampilkan kembali di beranda"}
                    >
                      {faq.isActive !== false ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Sembunyikan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Tampilkan</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditFaq(faq)}
                      style={{ borderRadius: "9999px" }} className="p-2 rounded-full bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0F4C81] dark:text-sky-300 transition cursor-pointer flex items-center gap-1"
                      title="Edit Pertanyaan & Jawaban"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden md:inline text-xs font-bold">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(faq.id)}
                      style={{ borderRadius: "9999px" }} className="p-2 rounded-full bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition cursor-pointer flex items-center gap-1"
                      title="Hapus FAQ secara permanen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden md:inline text-xs font-bold">Hapus</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SITE CMS: Landing Page, Hero, Login & Footer Management */}
      {activeTab === "site_cms" && (
        <div className="space-y-6 text-left">
          {/* Top CMS Header & Action Buttons */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Pusat Tata Kelola Landing Page & Branding
              </span>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-0.5">
                Konfigurasi Konten, Logo, Login & Footer
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Seluruh perubahan data tersinkronisasi langsung ke database MySQL dan langsung aktif di halaman publik & halaman login.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={async () => {
                  if (confirm("Reset seluruh pengaturan landing page dan footer ke default resmi Vokasi UNS?")) {
                    await resetSettings();
                    setCmsForm(DEFAULT_SITE_SETTINGS);
                    toast.info("Pengaturan Direset", "Data dikembalikan ke konfigurasi standar institusi.");
                  }
                }}
                className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer text-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCms}
                disabled={isSubmitting}
                className={`w-full sm:w-auto justify-center px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer text-center ${
                  cmsSavedSuccess
                    ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/30"
                    : "bg-[#0F4C81] text-white hover:bg-[#0A2540]"
                }`}
              >
                {cmsSavedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                    <span>Tersimpan di Database!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan ke MySQL...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan ke Database</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveCms} className="space-y-6">
            {/* Card 1: Logo & Brand Identity */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-[#C5A059]" />
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  1. Logo & Identitas Institusi
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MediaUploader
                  label="Logo Putih / Transparan (Untuk Header Gelap)"
                  description="Upload file PNG/WEBP transparan (Maks 5MB)"
                  acceptedType="image"
                  maxSizeMb={5}
                  currentUrl={cmsForm.brand_logo_url}
                  onUploadSuccess={(url) => {
                    if (url) setCmsForm((prev: any) => ({ ...prev, brand_logo_url: url }));
                  }}
                />

                <MediaUploader
                  label="Logo Berwarna / Lambang Resmi UNS"
                  description="Upload file PNG/JPG logo resmi (Maks 5MB)"
                  acceptedType="image"
                  maxSizeMb={5}
                  currentUrl={cmsForm.brand_logo_color_url}
                  onUploadSuccess={(url) => {
                    if (url) setCmsForm((prev: any) => ({ ...prev, brand_logo_color_url: url }));
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <span className="text-[11px] font-bold text-slate-500">Pilihan Cepat Logo:</span>
                <button
                  type="button"
                  onClick={() => setCmsForm((prev: any) => ({
                    ...prev,
                    brand_logo_url: "/images/brand/logo-sv-putih-official.png",
                    brand_logo_color_url: "/images/brand/logo-sv-biru-official.png"
                  }))}
                  className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] text-[#0F4C81] dark:text-sky-300 font-bold hover:bg-blue-100 transition cursor-pointer"
                >
                  ✓ Logo SV Baru (Biru & Putih Resmi)
                </button>
                <button
                  type="button"
                  onClick={() => setCmsForm((prev: any) => ({
                    ...prev,
                    brand_logo_url: "/images/brand/logo-sv-uns-horizontal-white.png",
                    brand_logo_color_url: "/images/brand/logo-sv-uns-official-new.png"
                  }))}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Logo SV Horizontal Standar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Judul Utama Brand
                  </label>
                  <input
                    type="text"
                    value={cmsForm.brand_site_title || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, brand_site_title: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subjudul Brand
                  </label>
                  <input
                    type="text"
                    value={cmsForm.brand_site_subtitle || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, brand_site_subtitle: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tagline Brand
                  </label>
                  <input
                    type="text"
                    value={cmsForm.brand_tagline || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, brand_tagline: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Hero Section Landing Page */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-[#38BDF8]" />
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  2. Hero Section (Halaman Depan Beranda)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Badge Teks Atas
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_badge || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_badge: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Judul Baris 1
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_title_p1 || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_title_p1: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Judul Baris 2 (Emas Highlight)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_title_p2 || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_title_p2: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-black text-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi / Paragraf Subtitle Hero
                </label>
                <textarea
                  rows={2}
                  value={cmsForm.hero_subtitle || ""}
                  onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_subtitle: e.target.value }))}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed font-medium"
                />
              </div>
            </div>

            {/* Card 2.5: Hero CTAs & Floating Stats Bar */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  2.5. Tombol Aksi & Bar Statistik Hero
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Teks Tombol Utama (Katalog)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_cta_catalog_text || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_cta_catalog_text: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Teks Tombol Kedua (Live Demo)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_cta_demo_text || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_cta_demo_text: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stat 1: Angka / Nilai
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_stat_1_val || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_stat_1_val: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stat 1: Label Teks
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_stat_1_lbl || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_stat_1_lbl: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stat 2: Angka / Nilai
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_stat_2_val || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_stat_2_val: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stat 2: Label Teks
                  </label>
                  <input
                    type="text"
                    value={cmsForm.hero_stat_2_lbl || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_stat_2_lbl: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Card 2.5B: Background & Gedung Kampus Sekolah Vokasi (CRUD Latar Belakang) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border-2 border-indigo-500/30 dark:border-indigo-400/30 shadow-md space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      2.5B. Foto Latar Belakang & Gedung Baru Sekolah Vokasi UNS (CRUD Background)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kelola foto gedung baru SV UNS (Gedung 8 Lantai), siluet login, dan background landscape beranda secara visual langsung ke database.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-extrabold uppercase tracking-wider">
                  Gedung SV Baru
                </span>
              </div>

              {/* Quick Preset Buttons for Gedung */}
              <div className="flex flex-wrap items-center gap-2 pb-1">
                <span className="text-[11px] font-bold text-slate-500">Pilihan Latar Gedung:</span>
                <button
                  type="button"
                  onClick={() => setCmsForm((prev: any) => ({
                    ...prev,
                    bg_building_left_url: "/images/backgrounds/gedung-vokasi-caruban-left.webp",
                    bg_building_right_url: "/images/backgrounds/gedung-vokasi-caruban-right.webp",
                    bg_campus_landscape_url: "/images/backgrounds/gedung-vokasi-caruban-hero.webp",
                    bg_hero_url: "/images/backgrounds/gedung-vokasi-caruban-hero.webp"
                  }))}
                  className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100 transition cursor-pointer"
                >
                  ✓ Terapkan Gedung Baru Sekolah Vokasi UNS (Resmi Mendiktisaintek)
                </button>
                <button
                  type="button"
                  onClick={() => setCmsForm((prev: any) => ({
                    ...prev,
                    bg_hero_url: "/videos/WEB-RONAL.mp4"
                  }))}
                  className="px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 text-[11px] text-sky-700 dark:text-sky-300 font-bold hover:bg-sky-100 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>▶ Pasang Video Drone Resmi Vokasi (WEB-RONAL.mp4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCmsForm((prev: any) => ({
                    ...prev,
                    bg_building_left_url: "/images/backgrounds/uns-gedung-sv-baru.png",
                    bg_building_right_url: "/images/backgrounds/uns-gedung-sv-real.jpg",
                    bg_campus_landscape_url: "/images/backgrounds/uns-gedung-sv-panoramic.jpg",
                    bg_hero_url: "/images/backgrounds/uns-gedung-sv-aerial.jpg"
                  }))}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Terapkan Gedung SV Surakarta
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <MediaUploader
                    label="Latar Gedung Baru SV Kiri (Foto / Video)"
                    description="Floating backdrop sisi kiri beranda. Foto (maks 10MB) atau Video MP4/WEBM (maks 50MB)"
                    acceptedType="both"
                    maxSizeMb={50}
                    currentUrl={cmsForm.bg_building_left_url || "/images/backgrounds/uns-gedung-sv-baru.png"}
                    onUploadSuccess={(url) => {
                      if (url) setCmsForm((prev: any) => ({ ...prev, bg_building_left_url: url }));
                    }}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Atau masukkan URL / path foto atau video..."
                      value={cmsForm.bg_building_left_url || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, bg_building_left_url: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => setCmsForm((prev: any) => ({ ...prev, bg_building_left_url: "/images/backgrounds/uns-gedung-sv-baru.png" }))}
                      className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold shrink-0 hover:bg-slate-300 transition cursor-pointer"
                    >
                      Default
                    </button>
                  </div>
                </div>

                <div>
                  <MediaUploader
                    label="Latar Gedung Baru SV Kanan (Foto / Video)"
                    description="Floating backdrop sisi kanan beranda. Foto (maks 10MB) atau Video MP4/WEBM (maks 50MB)"
                    acceptedType="both"
                    maxSizeMb={50}
                    currentUrl={cmsForm.bg_building_right_url || "/images/backgrounds/uns-gedung-sv-real.jpg"}
                    onUploadSuccess={(url) => {
                      if (url) setCmsForm((prev: any) => ({ ...prev, bg_building_right_url: url }));
                    }}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Atau masukkan URL / path foto atau video..."
                      value={cmsForm.bg_building_right_url || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, bg_building_right_url: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => setCmsForm((prev: any) => ({ ...prev, bg_building_right_url: "/images/backgrounds/uns-gedung-sv-real.jpg" }))}
                      className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold shrink-0 hover:bg-slate-300 transition cursor-pointer"
                    >
                      Default
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <MediaUploader
                    label="Panorama / Landscape Kampus SV (Foto / Video)"
                    description="Latar panorama halus di FAQ & watermark. Foto (maks 10MB) atau Video MP4/WEBM (maks 50MB)"
                    acceptedType="both"
                    maxSizeMb={50}
                    currentUrl={cmsForm.bg_campus_landscape_url || "/images/backgrounds/uns-gedung-sv-panoramic.jpg"}
                    onUploadSuccess={(url) => {
                      if (url) setCmsForm((prev: any) => ({ ...prev, bg_campus_landscape_url: url }));
                    }}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Atau masukkan URL / path foto atau video..."
                      value={cmsForm.bg_campus_landscape_url || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, bg_campus_landscape_url: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => setCmsForm((prev: any) => ({ ...prev, bg_campus_landscape_url: "/images/backgrounds/uns-gedung-sv-panoramic.jpg" }))}
                      className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold shrink-0 hover:bg-slate-300 transition cursor-pointer"
                    >
                      Default
                    </button>
                  </div>
                </div>

                <div>
                  <MediaUploader
                    label="Latar Belakang Hero Section (Foto / Video)"
                    description="Header paling atas beranda. Foto (maks 10MB) atau Video MP4/WEBM (maks 50MB)"
                    acceptedType="both"
                    maxSizeMb={50}
                    currentUrl={cmsForm.bg_hero_url || "/videos/WEB-RONAL.mp4"}
                    onUploadSuccess={(url) => {
                      if (url) setCmsForm((prev: any) => ({ ...prev, bg_hero_url: url }));
                    }}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Atau masukkan URL / path foto atau video..."
                      value={cmsForm.bg_hero_url || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, bg_hero_url: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => setCmsForm((prev: any) => ({ ...prev, bg_hero_url: "/videos/WEB-RONAL.mp4" }))}
                      className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold shrink-0 hover:bg-slate-300 transition cursor-pointer"
                    >
                      Default
                    </button>
                  </div>

                  {/* Slider Transparansi Video / Foto Hero */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>Transparansi Video / Foto Hero:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#0F4C81] text-white">
                          {cmsForm.hero_bg_opacity ?? 80}%
                        </span>
                      </label>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        {(cmsForm.hero_bg_opacity ?? 80) >= 90 ? "Sangat Jelas / Solid" : (cmsForm.hero_bg_opacity ?? 80) >= 75 ? "Jelas & Seimbang (Direkomendasikan)" : "Transparan Lembut"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">20% (Pudar)</span>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="5"
                        value={cmsForm.hero_bg_opacity ?? 80}
                        onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hero_bg_opacity: Number(e.target.value) }))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0F4C81]"
                      />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">100% (Solid)</span>
                    </div>

                    {/* Presets Cepat */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold mr-1">Pilihan Cepat:</span>
                      {[
                        { label: "65% (Artistik)", val: 65 },
                        { label: "80% (Default Jelas)", val: 80 },
                        { label: "90% (Vivid)", val: 90 },
                        { label: "100% (Maksimal)", val: 100 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setCmsForm((prev: any) => ({ ...prev, hero_bg_opacity: preset.val }))}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            (cmsForm.hero_bg_opacity ?? 80) === preset.val
                              ? "bg-[#0F4C81] text-white shadow-sm"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2.6: Taksonomi 3 Lini Layanan (Teknologi & SaaS, Produk Fisik & IoT, Jasa Software House) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border-2 border-[#0F4C81]/30 dark:border-sky-400/30 shadow-md space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Box className="w-5 h-5 text-[#0F4C81] dark:text-sky-400" />
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      2.6. Taksonomi 3 Lini Layanan (Cards Beranda)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ubah judul, deskripsi, badge, teks tombol, dan link tujuan untuk 3 kartu layanan di halaman utama.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0F4C81] dark:text-sky-300 font-extrabold uppercase tracking-wider">
                  Landing Section #3
                </span>
              </div>

              {/* Section Header Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tagline Atas Section
                  </label>
                  <input
                    type="text"
                    value={cmsForm.services_tagline || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, services_tagline: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Judul Utama Section
                  </label>
                  <input
                    type="text"
                    value={cmsForm.services_title || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, services_title: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subjudul / Deskripsi Section
                  </label>
                  <input
                    type="text"
                    value={cmsForm.services_subtitle || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, services_subtitle: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* 3 Service Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Card Layanan 1: Teknologi */}
                <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-blue-900/40">
                    <span className="font-extrabold text-xs text-[#0F4C81] dark:text-sky-300 flex items-center gap-1.5">
                      <Laptop className="w-4 h-4" /> Kartu Layanan 1
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-[#0F4C81] dark:text-sky-200 font-bold">
                      Teknologi
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={cmsForm.service_1_badge || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_1_badge: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Judul Layanan
                    </label>
                    <input
                      type="text"
                      value={cmsForm.service_1_title || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_1_title: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Deskripsi Layanan
                    </label>
                    <textarea
                      rows={3}
                      value={cmsForm.service_1_desc || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_1_desc: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Teks Tombol
                      </label>
                      <input
                        type="text"
                        value={cmsForm.service_1_btn || ""}
                        onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_1_btn: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        URL Link
                      </label>
                      <input
                        type="text"
                        value={cmsForm.service_1_link || ""}
                        onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_1_link: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Layanan 2: Produk Fisik & IoT */}
                <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-900/40">
                    <span className="font-extrabold text-xs text-[#C5A059] flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" /> Kartu Layanan 2 (Unggulan)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-[#C5A059] font-bold">
                      Produk Fisik
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={cmsForm.service_2_badge || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_2_badge: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Judul Layanan
                    </label>
                    <input
                      type="text"
                      value={cmsForm.service_2_title || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_2_title: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Deskripsi Layanan
                    </label>
                    <textarea
                      rows={3}
                      value={cmsForm.service_2_desc || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_2_desc: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Teks Tombol
                      </label>
                      <input
                        type="text"
                        value={cmsForm.service_2_btn || ""}
                        onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_2_btn: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        URL Link
                      </label>
                      <input
                        type="text"
                        value={cmsForm.service_2_link || ""}
                        onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_2_link: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Layanan 3: Jasa Software House */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700">
                    <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4" /> Kartu Layanan 3
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                      Jasa Industri
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={cmsForm.service_3_badge || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_3_badge: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Judul Layanan
                    </label>
                    <input
                      type="text"
                      value={cmsForm.service_3_title || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_3_title: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Deskripsi Layanan
                    </label>
                    <textarea
                      rows={3}
                      value={cmsForm.service_3_desc || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_3_desc: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Teks Tombol
                      </label>
                      <input
                        type="text"
                        value={cmsForm.service_3_btn || ""}
                        onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_3_btn: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        URL Link
                      </label>
                      <input
                        type="text"
                        value={cmsForm.service_3_link || ""}
                        onChange={(e) => setCmsForm((prev: any) => ({ ...prev, service_3_link: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2.6B: Rename Tab Filter Kategori Katalog (Pil Filter: All, Technology, Hardware, Software House) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border-2 border-[#000080]/30 dark:border-sky-400/30 shadow-md space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-[#000080] dark:text-sky-300 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      2.6B. Rename Tab Filter Kategori Katalog (Pill Filter Bar)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ubah label nama tombol tab filter kategori yang tampil di atas etalase katalog produk beranda. Mendukung dwi-bahasa (ID & EN).
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#000080] dark:text-sky-300 font-extrabold uppercase tracking-wider self-start sm:self-auto">
                  Landing Section #4 (Filter Katalog)
                </span>
              </div>

              {/* Live Preview Pill Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Pratinjau Langsung Tampilan Pill Filter:
                </span>
                <div className="inline-flex items-center p-1 rounded-full bg-slate-200/70 dark:bg-slate-800 border border-slate-300/70 dark:border-white/10 gap-1 flex-wrap">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#000080] text-white shadow-xs">
                    {cmsForm.catalog_tab_all_id || "Semua"} ({cmsForm.catalog_tab_all_en || "All"})
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                    <span>{cmsForm.catalog_tab_teknologi_id || "Teknologi (SaaS)"}</span>
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-500" />
                    <span>{cmsForm.catalog_tab_produk_id || "Produk (IoT/Robot)"}</span>
                  </span>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                    <span>{cmsForm.catalog_tab_jasa_id || "Jasa Software"}</span>
                  </span>
                </div>
              </div>

              {/* Form Grid 4 Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tab 1: All */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block pb-1 border-b border-slate-200 dark:border-slate-800">
                    Tab 1: Semua Kategori (All)
                  </span>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Label Indonesia (ID)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.catalog_tab_all_id || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, catalog_tab_all_id: e.target.value }))}
                      placeholder="Semua"
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Label Inggris (EN)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.catalog_tab_all_en || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, catalog_tab_all_en: e.target.value }))}
                      placeholder="All"
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                {/* Tab 2: Teknologi */}
                <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20 space-y-3">
                  <span className="text-xs font-extrabold text-[#000080] dark:text-sky-300 flex items-center gap-1.5 pb-1 border-b border-blue-200/60 dark:border-blue-900/40">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Tab 2: Teknologi (SaaS)</span>
                  </span>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Label Indonesia (ID)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.catalog_tab_teknologi_id || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, catalog_tab_teknologi_id: e.target.value }))}
                      placeholder="Teknologi (SaaS)"
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Label Inggris (EN)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.catalog_tab_teknologi_en || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, catalog_tab_teknologi_en: e.target.value }))}
                      placeholder="Technology (SaaS)"
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                {/* Tab 3: Produk */}
                <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20 space-y-3">
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 pb-1 border-b border-amber-200/60 dark:border-amber-900/40">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Tab 3: Hardware (IoT)</span>
                  </span>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Label Indonesia (ID)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.catalog_tab_produk_id || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, catalog_tab_produk_id: e.target.value }))}
                      placeholder="Produk (IoT/Robot)"
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Label Inggris (EN)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.catalog_tab_produk_en || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, catalog_tab_produk_en: e.target.value }))}
                      placeholder="Hardware (IoT)"
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                {/* Tab 4: Jasa */}
                <div className="p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/20 space-y-3">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-700">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Tab 4: Software House</span>
                  </span>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Label Indonesia (ID)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.catalog_tab_jasa_id || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, catalog_tab_jasa_id: e.target.value }))}
                      placeholder="Jasa Software"
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Label Inggris (EN)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.catalog_tab_jasa_en || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, catalog_tab_jasa_en: e.target.value }))}
                      placeholder="Software House"
                      className="w-full px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Save Bar inside this card */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Perubahan nama tab otomatis memperbarui pill filter etalase dan nama kategori resmi di database MySQL.
                </span>
                <button
                  type="button"
                  onClick={handleSaveCms}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#000080] hover:bg-[#0A2540] text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Nama Tab Kategori</span>
                </button>
              </div>
            </div>

            {/* Card 2.7: Hardware Lab Slider & Software House Showcase */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  2.7. Slider Hardware Lab & Ekosistem Software House
                </h4>
              </div>

              {/* Hardware Lab Slider Settings */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#0F4C81] dark:text-sky-400 uppercase tracking-wider block">
                  A. Bagian Hardware Lab (Slider Pembanding CAD vs Fisik)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Tagline Atas
                    </label>
                    <input
                      type="text"
                      value={cmsForm.hardware_section_tagline || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hardware_section_tagline: e.target.value }))}
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Judul Section
                    </label>
                    <input
                      type="text"
                      value={cmsForm.hardware_section_title || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hardware_section_title: e.target.value }))}
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Deskripsi / Subjudul
                    </label>
                    <input
                      type="text"
                      value={cmsForm.hardware_section_desc || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hardware_section_desc: e.target.value }))}
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Label Kiri (Sisi CAD)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.hardware_left_label || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hardware_left_label: e.target.value }))}
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Label Kanan (Sisi Prototipe)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.hardware_right_label || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, hardware_right_label: e.target.value }))}
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Software House Section Settings */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-[#0F4C81] dark:text-sky-400 uppercase tracking-wider block">
                  B. Bagian Ekosistem Software House (MacBook Preview)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Tagline Atas
                    </label>
                    <input
                      type="text"
                      value={cmsForm.softhouse_section_tagline || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, softhouse_section_tagline: e.target.value }))}
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Judul Section
                    </label>
                    <input
                      type="text"
                      value={cmsForm.softhouse_section_title || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, softhouse_section_title: e.target.value }))}
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Deskripsi / Subjudul
                    </label>
                    <input
                      type="text"
                      value={cmsForm.softhouse_section_desc || ""}
                      onChange={(e) => setCmsForm((prev: any) => ({ ...prev, softhouse_section_desc: e.target.value }))}
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2.8: Kemitraan DUDI & Sinergi Industri */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-[#C5A059]/40 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    2.8. Bagian Kemitraan DUDI & Sinergi Industri
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-[#C5A059] font-extrabold uppercase tracking-wider">
                  DUDI Banner
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tagline Kemitraan
                  </label>
                  <input
                    type="text"
                    value={cmsForm.dudi_section_tagline || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_section_tagline: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Judul Utama Kemitraan
                  </label>
                  <input
                    type="text"
                    value={cmsForm.dudi_section_title || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_section_title: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi Ajakan Kolaborasi
                </label>
                <textarea
                  rows={2}
                  value={cmsForm.dudi_section_desc || ""}
                  onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_section_desc: e.target.value }))}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Poin Benefit 1
                  </label>
                  <input
                    type="text"
                    value={cmsForm.dudi_benefit_1 || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_benefit_1: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Poin Benefit 2
                  </label>
                  <input
                    type="text"
                    value={cmsForm.dudi_benefit_2 || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_benefit_2: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Poin Benefit 3
                  </label>
                  <input
                    type="text"
                    value={cmsForm.dudi_benefit_3 || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_benefit_3: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor WhatsApp PIC (Format: 628xxx)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.dudi_whatsapp_number || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_whatsapp_number: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Teks Tombol WhatsApp
                  </label>
                  <input
                    type="text"
                    value={cmsForm.dudi_whatsapp_text || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_whatsapp_text: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    URL Unduh Katalog PDF
                  </label>
                  <input
                    type="text"
                    value={cmsForm.dudi_pdf_url || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, dudi_pdf_url: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Halaman Login & Keamanan */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  3. Kustomisasi Halaman Login Pengguna (/login)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Judul Formulir Login
                  </label>
                  <input
                    type="text"
                    value={cmsForm.login_title || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, login_title: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subjudul / Instruksi Login
                  </label>
                  <input
                    type="text"
                    value={cmsForm.login_subtitle || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, login_subtitle: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MediaUploader
                  label="Logo Halaman Login (Drag & Drop)"
                  description="Upload file gambar logo untuk kartu login (Maks 5MB)"
                  acceptedType="image"
                  maxSizeMb={5}
                  currentUrl={cmsForm.login_logo_url}
                  onUploadSuccess={(url) => {
                    if (url) setCmsForm((prev: any) => ({ ...prev, login_logo_url: url }));
                  }}
                />

                <MediaUploader
                  label="Gambar Background Siluet Kampus (Drag & Drop)"
                  description="Upload gambar latar belakang halaman login (Maks 5MB)"
                  acceptedType="image"
                  maxSizeMb={5}
                  currentUrl={cmsForm.login_bg_silhouette_url}
                  onUploadSuccess={(url) => {
                    if (url) setCmsForm((prev: any) => ({ ...prev, login_bg_silhouette_url: url }));
                  }}
                />
              </div>
            </div>

            {/* Card 4: Footer & Informasi Kontak */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Settings2 className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    4. Pengaturan Footer & Informasi Kontak Kampus
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-extrabold uppercase tracking-wider">
                  100% CRUD Sinkron
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi Singkat Footer
                </label>
                <textarea
                  rows={2}
                  value={cmsForm.footer_description || ""}
                  onChange={(e) => setCmsForm((prev: any) => ({ ...prev, footer_description: e.target.value }))}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Alamat Resmi Kampus Utama (Sekolah Vokasi UNS Pusat - Surakarta)
                </label>
                <textarea
                  rows={2}
                  value={cmsForm.footer_address_surakarta || ""}
                  onChange={(e) => setCmsForm((prev: any) => ({ ...prev, footer_address_surakarta: e.target.value }))}
                  placeholder="Kampus Tirtomoyo, Universitas Sebelas Maret&#10;Jalan Kolonel Sutarto 150 K, Jebres, Surakarta – Indonesia"
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Telepon Resmi
                  </label>
                  <input
                    type="text"
                    value={cmsForm.footer_phone || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, footer_phone: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Faksimile
                  </label>
                  <input
                    type="text"
                    value={cmsForm.footer_fax || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, footer_fax: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    WhatsApp Resmi
                  </label>
                  <input
                    type="text"
                    value={cmsForm.footer_whatsapp || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, footer_whatsapp: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Surel / Email Resmi
                  </label>
                  <input
                    type="text"
                    value={cmsForm.footer_email || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, footer_email: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    URL Google Maps Kampus
                  </label>
                  <input
                    type="text"
                    value={cmsForm.footer_map_url || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, footer_map_url: e.target.value }))}
                    placeholder="https://maps.google.com/?q=Sekolah+Vokasi+UNS"
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Teks Hak Cipta (Copyright)
                  </label>
                  <input
                    type="text"
                    value={cmsForm.footer_copyright || ""}
                    onChange={(e) => setCmsForm((prev: any) => ({ ...prev, footer_copyright: e.target.value }))}
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* 5. CMS LAYANAN SISTEM & PORTAL INFORMASI (FULL CRUD) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-left">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    5. Manajemen Layanan Sistem & Portal Informasi (CRUD Footer & Header)
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-extrabold uppercase tracking-wider">
                  Full CRUD Live Sync
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola tautan menu Layanan Sistem (Satu Data, Siakad, SPMB, dll) serta Portal Informasi (Akademik, Kerjasama, dll). Anda dapat menambah, mengedit URL/nama, menyembunyikan (toggle aktif), atau menghapus tautan secara dinamis.
              </p>

              {/* Grid 2 Kolom: Layanan Sistem & Portal Informasi */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SUB-SECTION A: Layanan Sistem (System Services) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Layanan Sistem Terpadu</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-sky-300 font-bold">
                          {currentSystemServices.length} Tautan
                        </span>
                      </h5>
                      <p className="text-[11px] text-slate-500">Tampil di Footer kolom Layanan Sistem & Menu Mobile</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleResetServices}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
                        title="Reset ke pengaturan awal"
                      >
                        <RotateCcw className="w-3 h-3 inline mr-1" />
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddService}
                        style={{ borderRadius: "9999px" }}
                        className="px-3 py-1.5 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold shadow-sm transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </div>

                  {/* List System Services */}
                  <div className="space-y-2">
                    {currentSystemServices.map((srv: any, sIdx: number) => (
                      <div
                        key={srv.id || sIdx}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                          srv.isActive !== false
                            ? "bg-white dark:bg-[#07192C] border-slate-200 dark:border-slate-800"
                            : "bg-slate-100/70 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {srv.name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                srv.isActive !== false
                                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {srv.isActive !== false ? "Aktif" : "Nonaktif"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <a
                              href={srv.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-sky-600 dark:text-sky-400 hover:underline truncate max-w-[200px]"
                            >
                              {srv.url}
                            </a>
                            {srv.desc && (
                              <span className="text-slate-400 truncate hidden sm:inline">
                                • {srv.desc}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleService(sIdx)}
                            className={`p-1.5 rounded-full transition cursor-pointer ${
                              srv.isActive !== false
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                : "text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                            }`}
                            title={srv.isActive !== false ? "Klik untuk sembunyikan" : "Klik untuk tampilkan"}
                          >
                            {srv.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditService(sIdx)}
                            className="p-1.5 rounded-full text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                            title="Edit Layanan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteService(sIdx)}
                            className="p-1.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Hapus Layanan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUB-SECTION B: Portal Informasi (Portal Info) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Portal Informasi Kampus</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold">
                          {currentPortalInfo.length} Tautan
                        </span>
                      </h5>
                      <p className="text-[11px] text-slate-500">Tampil di Footer kolom Portal Informasi & Menu Mobile</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleResetPortals}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
                        title="Reset ke pengaturan awal"
                      >
                        <RotateCcw className="w-3 h-3 inline mr-1" />
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddPortal}
                        style={{ borderRadius: "9999px" }}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#dfba6a] text-[#0A2540] text-xs font-bold shadow-sm transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </div>

                  {/* List Portal Info */}
                  <div className="space-y-2">
                    {currentPortalInfo.map((ptl: any, pIdx: number) => (
                      <div
                        key={ptl.id || pIdx}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                          ptl.isActive !== false
                            ? "bg-white dark:bg-[#07192C] border-slate-200 dark:border-slate-800"
                            : "bg-slate-100/70 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {ptl.name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                ptl.isActive !== false
                                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {ptl.isActive !== false ? "Aktif" : "Nonaktif"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <a
                              href={ptl.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-sky-600 dark:text-sky-400 hover:underline truncate max-w-[200px]"
                            >
                              {ptl.url}
                            </a>
                            {ptl.desc && (
                              <span className="text-slate-400 truncate hidden sm:inline">
                                • {ptl.desc}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleTogglePortal(pIdx)}
                            className={`p-1.5 rounded-full transition cursor-pointer ${
                              ptl.isActive !== false
                                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                : "text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                            }`}
                            title={ptl.isActive !== false ? "Klik untuk sembunyikan" : "Klik untuk tampilkan"}
                          >
                            {ptl.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditPortal(pIdx)}
                            className="p-1.5 rounded-full text-blue-600 dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                            title="Edit Portal"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePortal(pIdx)}
                            className="p-1.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Hapus Portal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6: Kustomisasi Header & Sidebar Navigasi (CRUD Menu, Tautan & CTA) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-[#0F4C81] dark:text-sky-300 flex items-center justify-center font-black text-xs">
                    6
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    6. Kustomisasi Header & Sidebar Navigasi (CRUD Menu, Tautan & CTA)
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-extrabold uppercase tracking-wider self-start sm:self-auto">
                  Full CRUD Live Sync
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola menu navigasi header publik (Beranda, 3 Layanan, Katalog, Portofolio, Mitra, FAQ), tombol aksi CTA, tautan cepat direktori prodi, serta identitas portal dan tautan eksternal pada sidebar dashboard.
              </p>

              {/* Grid 2 Kolom: Header Navigation & Sidebar Navigation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SUB-SECTION A: Navigasi Header Publik */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Menu Navigasi Header Publik</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-sky-300 font-bold">
                          {currentHeaderNavLinks.length} Menu
                        </span>
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Tampil di bilah header floating beranda & laci menu mobile
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={handleResetHeaderNav}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Reset ke 6 Menu Standar"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddHeaderNav}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-[#0F4C81] hover:bg-[#135996] text-white flex items-center gap-1 transition cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </div>

                  {/* List Menu Header Items */}
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {currentHeaderNavLinks.map((item: any, idx: number) => (
                      <div
                        key={item.id || idx}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          item.isActive !== false
                            ? "bg-white dark:bg-[#07192C] border-slate-200 dark:border-slate-800 shadow-2xs"
                            : "bg-slate-100/70 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                              {item.labelId || item.label}
                            </span>
                            {item.labelEn && (
                              <span className="text-[10.5px] text-slate-400 truncate">
                                ({item.labelEn})
                              </span>
                            )}
                            <span
                              className={`text-[9.5px] px-1.5 py-0.2 font-black rounded-full shrink-0 ${
                                item.isActive !== false
                                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {item.isActive !== false ? "Aktif" : "Disembunyikan"}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-[#0F4C81] dark:text-sky-400 block truncate mt-0.5">
                            {item.href}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleHeaderNav(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title={item.isActive !== false ? "Sembunyikan Menu" : "Aktifkan Menu"}
                          >
                            {item.isActive !== false ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditHeaderNav(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition cursor-pointer"
                            title="Edit Menu"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHeaderNav(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer"
                            title="Hapus Menu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Header CTA & Quick Links Sub-settings */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#C5A059] block">
                      Pengaturan Tombol CTA Kanan & Popover Menu
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Teks Tombol CTA Header
                        </label>
                        <input
                          type="text"
                          value={cmsForm.header_cta_text ?? "Dashboard"}
                          onChange={(e) => setCmsForm({ ...cmsForm, header_cta_text: e.target.value })}
                          placeholder="Dashboard / Masuk"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07192C] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          URL Tautan CTA Header
                        </label>
                        <input
                          type="text"
                          value={cmsForm.header_cta_link ?? "/dashboard"}
                          onChange={(e) => setCmsForm({ ...cmsForm, header_cta_link: e.target.value })}
                          placeholder="/dashboard atau /login"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07192C] text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Label Menu Prodi
                        </label>
                        <input
                          type="text"
                          value={cmsForm.header_menu_prodi_label ?? "Direktori 39 Program Studi"}
                          onChange={(e) => setCmsForm({ ...cmsForm, header_menu_prodi_label: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07192C] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Label Menu Katalog
                        </label>
                        <input
                          type="text"
                          value={cmsForm.header_menu_catalog_label ?? "Katalog Produk Lengkap"}
                          onChange={(e) => setCmsForm({ ...cmsForm, header_menu_catalog_label: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07192C] text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Label Menu Kontak WA
                        </label>
                        <input
                          type="text"
                          value={cmsForm.header_menu_contact_label ?? "Hubungi PIC Kemitraan"}
                          onChange={(e) => setCmsForm({ ...cmsForm, header_menu_contact_label: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07192C] text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUB-SECTION B: Identitas Header Sidebar Dashboard */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div>
                    <h5 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Identitas Header Sidebar Dashboard</span>
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Atur judul dan subjudul portal institusi yang tampil pada bar navigasi atas sidebar dashboard
                    </p>
                  </div>

                  {/* Brand Title Sidebar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Judul Brand Sidebar
                      </label>
                      <input
                        type="text"
                        value={cmsForm.sidebar_portal_title ?? "PORTAL VOKASI UNS"}
                        onChange={(e) => setCmsForm({ ...cmsForm, sidebar_portal_title: e.target.value })}
                        placeholder="PORTAL VOKASI UNS"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07192C] text-slate-900 dark:text-white font-bold uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Subjudul Brand Sidebar
                      </label>
                      <input
                        type="text"
                        value={cmsForm.sidebar_portal_subtitle ?? "UNIVERSITAS SEBELAS MARET"}
                        onChange={(e) => setCmsForm({ ...cmsForm, sidebar_portal_subtitle: e.target.value })}
                        placeholder="UNIVERSITAS SEBELAS MARET"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07192C] text-slate-900 dark:text-white font-bold uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Submit Bar */}
            <div className="flex justify-end gap-3 pt-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto justify-center px-6 sm:px-8 py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer text-center ${
                  cmsSavedSuccess
                    ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/30"
                    : "bg-[#0F4C81] text-white hover:bg-[#0A2540]"
                }`}
              >
                {cmsSavedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                    <span>Perubahan Berhasil Disimpan ke MySQL!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan ke Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Seluruh Pengaturan Landing Page</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. PARTNERS MANAGEMENT: Industry Partners & Running Marquee */}
      {activeTab === "partners" && (
        <div className="space-y-6 text-left">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Jaringan Industri & Hilirisasi Riset (DUDI)
              </span>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-0.5">
                Kelola Mitra Industri & Running Marquee
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Kelola logo mitra industri, BUMN, dan korporasi terkemuka yang ditampilkan pada running banner halaman utama.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={handleOpenAddPartner}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl sm:rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Mitra Baru</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAllPartnersToDatabase}
                disabled={isSubmitting}
                className={`w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  partnersSavedSuccess
                    ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/30"
                    : "bg-gradient-to-r from-[#0F4C81] to-[#C5A059] text-white hover:brightness-110 shadow-sky-950/20"
                } disabled:opacity-50`}
              >
                {partnersSavedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                    <span>Tersimpan ke Database!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan ke Database</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section Titles Customization (ID & EN) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#C5A059]" />
              <span>Judul & Subjudul Section Mitra di Halaman Utama</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kicker / Judul Header (Bahasa Indonesia)
                </label>
                <input
                  type="text"
                  value={partnerTitleId}
                  onChange={(e) => setPartnerTitleId(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  placeholder="Jaringan Mitra Industri Terpercaya"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kicker / Judul Header (English)
                </label>
                <input
                  type="text"
                  value={partnerTitleEn}
                  onChange={(e) => setPartnerTitleEn(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  placeholder="Trusted Industry Partners Network"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi Singkat (Bahasa Indonesia)
                </label>
                <textarea
                  rows={2}
                  value={partnerDescId}
                  onChange={(e) => setPartnerDescId(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  placeholder="Sinergi erat dengan BUMN, korporasi terkemuka, dan pemerintah kota..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi Singkat (English)
                </label>
                <textarea
                  rows={2}
                  value={partnerDescEn}
                  onChange={(e) => setPartnerDescEn(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  placeholder="Close synergy with state-owned enterprises (BUMN)..."
                />
              </div>
            </div>
          </div>

          {/* List of Partners Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerList.map((partner, index) => (
              <div
                key={`partner-${index}`}
                className="p-5 rounded-2xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    <img
                      src={partner.src}
                      alt={partner.alt || partner.name}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-sm text-slate-900 dark:text-white truncate">
                      {partner.name}
                    </span>
                    <span className="block text-[11px] text-slate-400 truncate">
                      {partner.alt || "Mitra Industri"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPartner(index)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#0F4C81] dark:hover:text-sky-400 transition cursor-pointer"
                    title="Edit Mitra"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(index)}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition cursor-pointer"
                    title="Hapus Mitra"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar Bawah untuk Simpan Perubahan Mitra */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Handshake className="w-4 h-4 text-[#C5A059]" />
                <span>Total Mitra Terdaftar: {partnerList.length} Logo Mitra</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pastikan menekan tombol simpan setelah menambah, mengubah, atau menghapus slot mitra industri.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleOpenAddPartner}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl sm:rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Slot Mitra</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAllPartnersToDatabase}
                disabled={isSubmitting}
                className={`w-full sm:w-auto justify-center px-7 py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-black shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer text-center ${
                  partnersSavedSuccess
                    ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/30"
                    : "bg-gradient-to-r from-[#0F4C81] to-[#C5A059] text-white hover:brightness-110 shadow-sky-950/20"
                } disabled:opacity-50`}
              >
                {partnersSavedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                    <span>Perubahan Mitra Tersimpan ke Database!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan ke MySQL...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Seluruh Perubahan Mitra ke Database</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: PORTOFOLIO INOVASI YANG TELAH DIGUNAKAN MITRA (CASE STUDIES)   */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <span>Portofolio Kasus Implementasi Mitra</span>
                </span>
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">
                  Inovasi yang Telah Resmi Digunakan Mitra Industri ({portfolioCasesList.length})
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kelola kartu showcase implementasi nyata produk inovasi di BUMN, korporasi swasta, dan instansi mitra.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddPortfolio}
                className="px-4 py-2 rounded-xl sm:rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Portofolio Inovasi</span>
              </button>
            </div>

            {/* Custom Judul & Deskripsi Section Portofolio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tagline Section (Badge Atas)
                </label>
                <input
                  type="text"
                  value={portfolioSectionTagline}
                  onChange={(e) => setPortfolioSectionTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="Impactful Applied Implementations"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Utama Section
                </label>
                <input
                  type="text"
                  value={portfolioSectionTitle}
                  onChange={(e) => setPortfolioSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="Portofolio Inovasi yang Telah Digunakan Mitra"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi / Paragraf Singkat
                </label>
                <input
                  type="text"
                  value={portfolioSectionDesc}
                  onChange={(e) => setPortfolioSectionDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="Bukti nyata karya riset terapan dan produk teknologi Sekolah Vokasi UNS..."
                />
              </div>
            </div>

            {/* Cards List Portfolio Cases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioCasesList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3 hover:border-[#0F4C81] dark:hover:border-sky-400 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-300 border border-blue-200 dark:border-blue-800">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPortfolio(idx)}
                          className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0F4C81] transition cursor-pointer"
                          title="Edit Portofolio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePortfolio(idx)}
                          className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition cursor-pointer"
                          title="Hapus Portofolio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h5 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {item.title}
                    </h5>

                    {/* Thumbnail Foto Bukti Implementasi Mitra */}
                    {item.image ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 my-1">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-xs">
                          <ImageIcon className="w-3 h-3 text-emerald-400" />
                          <span>Foto Bukti Terlampir</span>
                        </span>
                      </div>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between my-1">
                        <span className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-slate-400" />
                          <span>Belum ada foto bukti implementasi</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditPortfolio(idx)}
                          className="text-[10px] font-bold text-[#0F4C81] dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          + Upload Foto
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Mitra: <strong className="text-slate-900 dark:text-white">{item.partner}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-amber-700 dark:text-amber-400 text-[11px]">
                        {Number(item.rating || 5).toFixed(1)} / 5.0 ({item.reviewCount || 10} Verifikasi)
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>

                    {item.testimonial && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-[11px] italic text-slate-600 dark:text-slate-300">
                        <Quote className="w-3 h-3 text-[#C5A059] inline mr-1" />
                        &quot;{item.testimonial}&quot;
                        {item.reviewer && (
                          <span className="block not-italic font-bold text-slate-500 dark:text-slate-400 mt-1">
                            — {item.reviewer}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-[#0F4C81] dark:text-[#C5A059] block">
                        {item.metricValue}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {item.metricLabel}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: TESTIMONI KOLABORASI & SINERGI MITRA (TESTIMONIALS)            */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-[#C5A059]" />
                  <span>Testimoni Kolaborasi & Sinergi Industri</span>
                </span>
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">
                  Testimoni Pimpinan Mitra Industri ({testimonialsList.length})
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kelola kutipan langsung dari pimpinan perusahaan, kepala divisi, dan mitra strategis yang telah bekerja sama dengan SV UNS.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddTestimonial}
                className="px-4 py-2 rounded-xl sm:rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Testimoni Mitra</span>
              </button>
            </div>

            {/* Custom Judul & Deskripsi Section Testimoni */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tagline Section (Badge Atas)
                </label>
                <input
                  type="text"
                  value={testimonialsSectionTagline}
                  onChange={(e) => setTestimonialsSectionTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="Industry Trust & DUDI Synergy"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Utama Section
                </label>
                <input
                  type="text"
                  value={testimonialsSectionTitle}
                  onChange={(e) => setTestimonialsSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="Testimoni Kolaborasi & Sinergi"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi / Paragraf Singkat
                </label>
                <input
                  type="text"
                  value={testimonialsSectionDesc}
                  onChange={(e) => setTestimonialsSectionDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="Pengalaman nyata mitra industri bekerja sama dengan Sekolah Vokasi UNS..."
                />
              </div>
            </div>

            {/* Cards List Testimonials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonialsList.map((tItem, idx) => (
                <div
                  key={tItem.id || idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-400">
                        {[...Array(Math.min(5, Math.max(1, Math.round(tItem.rating || 5))))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditTestimonial(idx)}
                          className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0F4C81] transition cursor-pointer"
                          title="Edit Testimoni"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(idx)}
                          className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition cursor-pointer"
                          title="Hapus Testimoni"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed italic font-medium">
                      &quot;{tItem.text}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={tItem.avatar || "/images/brand/logo-sv-uns-official-color.png"} alt={tItem.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h6 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {tItem.name}
                      </h6>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {tItem.role} • <strong className="text-slate-700 dark:text-slate-300">{tItem.company}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MASTER BOTTOM ACTION BAR UNTUK MENYIMPAN SEMUA PERUBAHAN */}
          <div className="sticky bottom-4 z-20 p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#07192C]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Penyimpanan Terpadu DUDI & Kemitraan</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Menyimpan seluruh {partnerList.length} logo mitra, {portfolioCasesList.length} portofolio inovasi, dan {testimonialsList.length} testimoni pimpinan industri langsung ke MySQL.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAllPartnersToDatabase}
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-black shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                partnersSavedSuccess
                  ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/30"
                  : "bg-gradient-to-r from-[#0F4C81] to-[#C5A059] text-white hover:brightness-110 shadow-sky-950/20"
              } disabled:opacity-50`}
            >
              {partnersSavedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                  <span>Seluruh Data Mitra & Testimoni Berhasil Tersimpan!</span>
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan ke MySQL Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Seluruh Perubahan Mitra, Portofolio & Testimoni</span>
                </>
              )}
            </button>
          </div>

          {partnerList.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#07192C] border border-dashed border-slate-300 dark:border-slate-800">
              <Handshake className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                Belum ada mitra industri terdaftar
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Klik tombol "Tambah Mitra Baru" di atas untuk menambahkan mitra ke running logo.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 7. PRODIS MANAGEMENT: Kelola 39 Program Studi */}
      {activeTab === "prodis" && (
        <div className="space-y-6 text-left">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                <span>Direktori Akademik & Vokasi Terapan</span>
              </span>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-0.5">
                Tata Kelola 39 Program Studi Sekolah Vokasi UNS
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Kelola direktori resmi Magister Terapan (S2), Sarjana Terapan (D4), dan Ahli Madya (D3). Tambah prodi baru, perbarui data, atau reset ke daftar standar institusi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={handleResetDefaultProdis}
                disabled={isSubmitting}
                className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl sm:rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Reset ke 39 Program Studi Standar Resmi SV UNS"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke 39 Prodi Resmi</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddProdi}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl sm:rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Program Studi</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Program Studi</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{prodis.length}</div>
              <span className="text-[11px] text-slate-500">Terdaftar & Aktif</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#07192C] border border-purple-200 dark:border-purple-900/40 shadow-sm text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">Magister (S2)</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {prodis.filter((p: any) => p.kode_prodi?.startsWith("S2") || p.jenjang?.includes("S2")).length}
              </div>
              <span className="text-[11px] text-slate-500">Magister Terapan</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#07192C] border border-blue-200 dark:border-blue-900/40 shadow-sm text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0F4C81] dark:text-sky-300">Sarjana Terapan (D4)</span>
              <div className="text-2xl font-black text-[#0F4C81] dark:text-sky-300 mt-1">
                {prodis.filter((p: any) => p.kode_prodi?.startsWith("D4") || p.jenjang?.includes("D4") || p.jenjang?.includes("Sarjana")).length}
              </div>
              <span className="text-[11px] text-slate-500">Sarjana Terapan Vokasi</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#07192C] border border-emerald-200 dark:border-emerald-900/40 shadow-sm text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Ahli Madya (D3)</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {prodis.filter((p: any) => p.kode_prodi?.startsWith("D3") || p.jenjang?.includes("D3")).length}
              </div>
              <span className="text-[11px] text-slate-500">Diploma Tiga Vokasi</span>
            </div>
          </div>

          {/* Search & Degree Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={prodiSearchQuery}
                onChange={(e) => setProdiSearchQuery(e.target.value)}
                placeholder="Cari nama atau kode prodi..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
              {[
                { key: "all", label: `Semua (${prodis.length})` },
                { key: "S2", label: `S2 Terapan (${prodis.filter((p: any) => p.kode_prodi?.startsWith("S2") || p.jenjang?.includes("S2")).length})` },
                { key: "D4", label: `Sarjana Terapan (${prodis.filter((p: any) => p.kode_prodi?.startsWith("D4") || p.jenjang?.includes("D4") || p.jenjang?.includes("Sarjana")).length})` },
                { key: "D3", label: `Diploma Tiga (${prodis.filter((p: any) => p.kode_prodi?.startsWith("D3") || p.jenjang?.includes("D3")).length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setProdiDegreeFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    prodiDegreeFilter === tab.key
                      ? "bg-[#0F4C81] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prodis Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {prodis
              .filter((p: any) => {
                const matchesDegree =
                  prodiDegreeFilter === "all" ||
                  (prodiDegreeFilter === "S2" && (p.kode_prodi?.startsWith("S2") || p.jenjang?.includes("S2"))) ||
                  (prodiDegreeFilter === "D4" && (p.kode_prodi?.startsWith("D4") || p.jenjang?.includes("D4") || p.jenjang?.includes("Sarjana"))) ||
                  (prodiDegreeFilter === "D3" && (p.kode_prodi?.startsWith("D3") || p.jenjang?.includes("D3")));

                const q = prodiSearchQuery.trim().toLowerCase();
                const matchesSearch =
                  q === "" ||
                  p.nama_prodi?.toLowerCase().includes(q) ||
                  p.kode_prodi?.toLowerCase().includes(q) ||
                  p.kontak_email?.toLowerCase().includes(q);

                return matchesDegree && matchesSearch;
              })
              .map((p: any) => {
                const isS2 = p.kode_prodi?.startsWith("S2") || p.jenjang?.includes("S2");
                const isD4 = p.kode_prodi?.startsWith("D4") || p.jenjang?.includes("D4") || p.jenjang?.includes("Sarjana");
                return (
                  <div
                    key={p.id || p.kode_prodi}
                    className="p-4 rounded-2xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#0F4C81] dark:hover:border-sky-400 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                        <span
                          className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                            isS2
                              ? "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              : isD4
                              ? "bg-blue-100 dark:bg-blue-950/80 text-[#0F4C81] dark:text-sky-300 border border-blue-200 dark:border-blue-800"
                              : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          {p.kode_prodi}
                        </span>

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {isS2 ? "S2 Terapan" : isD4 ? "Sarjana Terapan" : "Ahli Madya D3"}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-[#0F4C81] dark:group-hover:text-sky-300 transition-colors">
                        {p.nama_prodi}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {p.fakultas_sekolah || "Sekolah Vokasi UNS"}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="font-mono truncate max-w-[170px]">{p.kontak_email || "-"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">WhatsApp:</span>
                          <span className="font-mono">{p.kontak_wa || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProdi(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F4C81] dark:text-sky-300 hover:bg-blue-50 dark:hover:bg-white/10 transition cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProdi(p)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer flex items-center gap-1"
                        title="Hapus Program Studi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* New User Modal */}
      {isNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Daftarkan Pengguna Baru
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama Akun"
                  className="w-full px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email UNS
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="akun@vokasi.uns.ac.id"
                  className="w-full px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Peran (Role)
                </label>
                <select
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value={3}>Admin Prodi (Pengelola Katalog)</option>
                  <option value={2}>Pimpinan SV (View-Only Eksekutif)</option>
                  <option value={1}>Super Admin (Otoritas Penuh)</option>
                </select>
              </div>

              {newRoleId === 3 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Program Studi
                  </label>
                  <select
                    value={newProdiId}
                    onChange={(e) => setNewProdiId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {prodis.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.nama_prodi} ({p.kode_prodi})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewUserModal(false)}
                  style={{ borderRadius: "9999px" }} className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ borderRadius: "9999px" }} className="px-6 py-2.5 rounded-full bg-[#0F4C81] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User & Ganti Password Modal */}
      {isEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-300">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Perbarui Akun & Kata Sandi
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: #{editingUser.id} • {editingUser.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditUserModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap Civitas
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Akun UNS
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Ganti Kata Sandi (Password) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Ganti Kata Sandi Baru (Opsional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="text-[10.5px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showEditPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showEditPassword ? "Sembunyikan" : "Tampilkan"}</span>
                  </button>
                </div>
                <input
                  type={showEditPassword ? "text" : "password"}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin ganti kata sandi"
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#C5A059]"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Minimal 6 karakter. Jika diisi, pengguna dapat langsung login menggunakan password baru ini.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Peran Akses (RBAC Role)
                </label>
                <select
                  value={editRoleId}
                  onChange={(e) => setEditRoleId(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium cursor-pointer"
                >
                  <option value={3}>Admin Prodi (Pengelola Katalog)</option>
                  <option value={2}>Pimpinan SV (View-Only Eksekutif)</option>
                  <option value={1}>Super Admin (Otoritas Penuh)</option>
                </select>
              </div>

              {editRoleId === 3 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Program Studi Pengelola
                  </label>
                  <select
                    value={editProdiId}
                    onChange={(e) => setEditProdiId(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium cursor-pointer"
                  >
                    {prodis.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.nama_prodi} ({p.kode_prodi})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditUserModal(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ borderRadius: "9999px" }}
                  className="px-6 py-2.5 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Add/Edit Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingFaq ? "Edit Pertanyaan FAQ" : "Tambah Pertanyaan FAQ Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kategori FAQ
                </label>
                <select
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Kemitraan & Lisensi">Kemitraan & Lisensi</option>
                  <option value="Produk & Demo">Produk & Demo</option>
                  <option value="Jasa Software">Jasa Software</option>
                  <option value="Legal & HAKI">Legal & HAKI</option>
                  <option value="Hardware & IoT">Hardware & IoT</option>
                  <option value="Umum & Layanan">Umum & Layanan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pertanyaan (Question) *
                </label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Contoh: Bagaimana cara memesan layanan jasa software?"
                  className="w-full px-3 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Jawaban Lengkap (Answer) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Tuliskan jawaban yang informatif, transparan, dan jelas untuk pengunjung..."
                  className="w-full px-3 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed font-medium"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  style={{ borderRadius: "9999px" }} className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ borderRadius: "9999px" }} className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingFaq ? "Perbarui FAQ" : "Tambahkan ke Beranda"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Add/Edit Modal */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingPartnerIndex !== null ? "Edit Mitra Industri" : "Tambah Mitra Industri Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartnerModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Perusahaan / Mitra Industri *
                </label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Misal: PT INKA (Persero), Telkom Indonesia, PT Astra International"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Logo Mitra (Upload atau URL Gambar)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={partnerSrc}
                    onChange={(e) => setPartnerSrc(e.target.value)}
                    placeholder="/images/brand/logo-mitra.png atau URL eksternal https://..."
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                  <div className="text-[11px] text-slate-500">
                    Atau unggah file gambar langsung:
                  </div>
                  <MediaUploader
                    label="Unggah Logo Mitra"
                    acceptedType="image"
                    maxSizeMb={5}
                    onUploadSuccess={(url) => setPartnerSrc(url)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Keterangan / Alt Text
                </label>
                <input
                  type="text"
                  value={partnerAlt}
                  onChange={(e) => setPartnerAlt(e.target.value)}
                  placeholder="Misal: Logo Resmi PT Telkom Indonesia"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tautan Website Mitra (Opsional)
                </label>
                <input
                  type="url"
                  value={partnerLink}
                  onChange={(e) => setPartnerLink(e.target.value)}
                  placeholder="https://www.inka.co.id"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ borderRadius: "9999px" }}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingPartnerIndex !== null ? "Perbarui Mitra" : "Tambahkan ke Running Logo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portfolio Case Add/Edit Modal */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-left my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingPortfolioIndex !== null ? "Edit Kasus Portofolio Inovasi" : "Tambah Kasus Portofolio Inovasi"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPortfolioModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolioModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Judul Produk Inovasi / Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    value={portfolioFormTitle}
                    onChange={(e) => setPortfolioFormTitle(e.target.value)}
                    placeholder="Misal: Robot Patroli Otonom SV-01 (LiDAR & Edge AI)"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori Lini Produk
                  </label>
                  <input
                    type="text"
                    value={portfolioFormCategory}
                    onChange={(e) => setPortfolioFormCategory(e.target.value)}
                    placeholder="Misal: Hardware & IoT Robotika / Teknologi & SaaS"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Status Adopsi / Implementasi
                  </label>
                  <input
                    type="text"
                    value={portfolioFormStatus}
                    onChange={(e) => setPortfolioFormStatus(e.target.value)}
                    placeholder="Misal: Telah Diimplementasikan & Aktif Beroperasi"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Mitra Industri Pengguna / DUDI *
                  </label>
                  <input
                    type="text"
                    required
                    value={portfolioFormPartner}
                    onChange={(e) => setPortfolioFormPartner(e.target.value)}
                    placeholder="Misal: PT Petrokimia Gresik & Kawasan Industri Jawa Tengah"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Rating DUDI (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={portfolioFormRating}
                    onChange={(e) => setPortfolioFormRating(parseFloat(e.target.value) || 5.0)}
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jumlah Verifikasi Mitra (Review)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={portfolioFormReviewCount}
                    onChange={(e) => setPortfolioFormReviewCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nilai Metrik Dampak (Highlight)
                  </label>
                  <input
                    type="text"
                    value={portfolioFormMetricValue}
                    onChange={(e) => setPortfolioFormMetricValue(e.target.value)}
                    placeholder="Misal: 65% / 1.200+ / 3x Lebih Cepat"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Label Keterangan Metrik
                  </label>
                  <input
                    type="text"
                    value={portfolioFormMetricLabel}
                    onChange={(e) => setPortfolioFormMetricLabel(e.target.value)}
                    placeholder="Misal: Efisiensi Biaya Patroli Keamanan"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Deskripsi Ringkas Implementasi
                  </label>
                  <textarea
                    rows={2}
                    value={portfolioFormDesc}
                    onChange={(e) => setPortfolioFormDesc(e.target.value)}
                    placeholder="Digunakan untuk pengawasan fasilitas industri 24/7 dengan sensor LiDAR..."
                    className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kutipan Testimoni Mitra
                  </label>
                  <textarea
                    rows={2}
                    value={portfolioFormTestimonial}
                    onChange={(e) => setPortfolioFormTestimonial(e.target.value)}
                    placeholder="Robot patroli karya Vokasi UNS sangat presisi dan andal operasionalnya..."
                    className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama & Jabatan Reviewer
                  </label>
                  <input
                    type="text"
                    value={portfolioFormReviewer}
                    onChange={(e) => setPortfolioFormReviewer(e.target.value)}
                    placeholder="Ir. Bambang Trihatmojo — Kadiv K3"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Slug / Link Detail Katalog
                  </label>
                  <input
                    type="text"
                    value={portfolioFormSlug}
                    onChange={(e) => setPortfolioFormSlug(e.target.value)}
                    placeholder="robot-patroli-otonom atau /katalog/..."
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                {/* Upload Foto Bukti Penggunaan / Dokumentasi Mitra Industri */}
                <div className="sm:col-span-2 space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#0F4C81] dark:text-[#C5A059]" />
                      <span>Foto Bukti Implementasi / Penggunaan Mitra Industri</span>
                    </label>
                    {portfolioFormImage && (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Foto Terlampir
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Upload foto dokumentasi serah terima, foto fisik produk di pabrik mitra, atau screenshot sistem live. Sinkron langsung ke database & landing page.
                  </p>

                  <MediaUploader
                    label="Upload Foto Bukti Mitra (Drag & Drop)"
                    description="PNG, JPG, WEBP (Maksimal 10MB)"
                    acceptedType="image"
                    maxSizeMb={10}
                    currentUrl={portfolioFormImage}
                    onUploadSuccess={(url) => setPortfolioFormImage(url)}
                  />

                  {/* Manual URL input */}
                  <div className="pt-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Atau Masukkan Path / URL Gambar Manual
                    </label>
                    <input
                      type="text"
                      value={portfolioFormImage}
                      onChange={(e) => setPortfolioFormImage(e.target.value)}
                      placeholder="/images/sequence/robot-frame-01.jpg atau https://..."
                      className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  {portfolioFormImage && (
                    <div className="relative mt-2 w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center group/preview">
                      <img
                        src={portfolioFormImage}
                        alt="Preview Bukti"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPortfolioFormImage("")}
                        className="absolute top-2 right-2 px-3 py-1 rounded-full bg-red-600/90 hover:bg-red-700 text-white text-[10px] font-bold backdrop-blur-sm cursor-pointer shadow-md transition"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPortfolioModalOpen(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ borderRadius: "9999px" }}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingPortfolioIndex !== null ? "Perbarui Portofolio" : "Tambahkan ke Portofolio"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials Add/Edit Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingTestimonialIndex !== null ? "Edit Testimoni Mitra Industri" : "Tambah Testimoni Mitra Industri Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonialModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Tokoh / Pimpinan *
                </label>
                <input
                  type="text"
                  required
                  value={testimonialFormName}
                  onChange={(e) => setTestimonialFormName(e.target.value)}
                  placeholder="Misal: Ir. Bambang Trihatmojo"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialFormRole}
                    onChange={(e) => setTestimonialFormRole(e.target.value)}
                    placeholder="Kepala Divisi K3 & Aset"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Perusahaan / Instansi *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialFormCompany}
                    onChange={(e) => setTestimonialFormCompany(e.target.value)}
                    placeholder="PT Petrokimia Gresik"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Rating Bintang (1 - 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialFormRating(star)}
                      className={`p-1.5 rounded-lg border transition ${
                        testimonialFormRating >= star
                          ? "bg-amber-50 dark:bg-amber-950 border-amber-300 text-amber-500"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${testimonialFormRating >= star ? "fill-amber-400" : ""}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
                    {testimonialFormRating} Bintang
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Isi Kutipan Testimoni *
                </label>
                <textarea
                  rows={3}
                  required
                  value={testimonialFormText}
                  onChange={(e) => setTestimonialFormText(e.target.value)}
                  placeholder="Kolaborasi riset terapan dengan Sekolah Vokasi UNS melahirkan solusi robotik yang langsung menjawab kebutuhan pengawasan gudang kami..."
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Foto Tokoh / Logo Mitra (Opsional)
                </label>
                <MediaUploader
                  label="Upload Foto / Avatar Tokoh (Drag & Drop)"
                  description="PNG atau JPG (Maksimal 5MB)"
                  acceptedType="image"
                  maxSizeMb={5}
                  currentUrl={testimonialFormAvatar}
                  onUploadSuccess={(url) => setTestimonialFormAvatar(url)}
                />
                <input
                  type="text"
                  value={testimonialFormAvatar}
                  onChange={(e) => setTestimonialFormAvatar(e.target.value)}
                  placeholder="/images/brand/logo-sv-uns-official-color.png atau URL gambar"
                  className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
                {testimonialFormAvatar && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-white p-1">
                      <img src={testimonialFormAvatar} alt="Preview Avatar" className="w-full h-full object-contain" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setTestimonialFormAvatar("")}
                      className="text-[11px] text-red-500 hover:underline cursor-pointer"
                    >
                      Hapus Foto Tokoh
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ borderRadius: "9999px" }}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingTestimonialIndex !== null ? "Perbarui Testimoni" : "Tambahkan Testimoni"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Service Add/Edit Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingServiceIndex !== null ? "Edit Layanan Sistem" : "Tambah Layanan Sistem Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Layanan Sistem *
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Misal: Satu Data, Siakad, e-Service, SPMB"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tautan / URL Web Resmi *
                </label>
                <input
                  type="url"
                  required
                  value={serviceUrl}
                  onChange={(e) => setServiceUrl(e.target.value)}
                  placeholder="https://satudata.uns.ac.id"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi / Keterangan Singkat (Tooltip)
                </label>
                <input
                  type="text"
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Misal: Integrasi Data Terpadu UNS"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="serviceActiveCheck"
                  checked={serviceIsActive}
                  onChange={(e) => setServiceIsActive(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="serviceActiveCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Tampilkan layanan ini di website (Aktif)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ borderRadius: "9999px" }}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingServiceIndex !== null ? "Perbarui Layanan" : "Simpan Layanan Baru"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Information Portal Add/Edit Modal */}
      {isPortalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingPortalIndex !== null ? "Edit Portal Informasi" : "Tambah Portal Informasi Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPortalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortalModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Portal Informasi *
                </label>
                <input
                  type="text"
                  required
                  value={portalName}
                  onChange={(e) => setPortalName(e.target.value)}
                  placeholder="Misal: Akademik, Kerja Sama, Program Studi, Visi Misi"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tautan / URL Web Resmi *
                </label>
                <input
                  type="url"
                  required
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  placeholder="https://vokasi.uns.ac.id/akademik/"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deskripsi / Keterangan Singkat (Tooltip)
                </label>
                <input
                  type="text"
                  value={portalDesc}
                  onChange={(e) => setPortalDesc(e.target.value)}
                  placeholder="Misal: Informasi Kurikulum & Perkuliahan"
                  className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="portalActiveCheck"
                  checked={portalIsActive}
                  onChange={(e) => setPortalIsActive(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="portalActiveCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Tampilkan portal ini di website (Aktif)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPortalModalOpen(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ borderRadius: "9999px" }}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#dfba6a] text-[#0A2540] text-xs font-bold shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingPortalIndex !== null ? "Perbarui Portal" : "Simpan Portal Baru"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Catalog Item Add/Edit Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-6 bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-left max-h-[92vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-[#0F4C81] dark:text-sky-300">
                  {editingItem ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {editingItem ? "Edit Data Inovasi Produk" : "Tambah Produk Inovasi Baru"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Standar 5 Elemen Wajib Inovasi (Mockup, Demo, Identitas, Spesifikasi, Harga)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-5">
              {/* 1. Klasifikasi 3 Lini Layanan */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  1. Klasifikasi 3 Lini Layanan *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setItemForm({ ...itemForm, category_id: 1 })}
                    style={{ borderRadius: "16px" }}
                    className={`p-3 border text-left transition cursor-pointer flex flex-col justify-between ${
                      itemForm.category_id === 1
                        ? "border-[#0F4C81] bg-blue-50/60 dark:bg-blue-950/40 text-[#0F4C81] dark:text-sky-300 ring-2 ring-[#0F4C81]/30 font-bold"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Laptop className="w-4 h-4 text-[#0F4C81] dark:text-sky-300" />
                      <span className="text-xs font-bold">1. Teknologi & SaaS</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Software & Sandbox</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setItemForm({ ...itemForm, category_id: 2 })}
                    style={{ borderRadius: "16px" }}
                    className={`p-3 border text-left transition cursor-pointer flex flex-col justify-between ${
                      itemForm.category_id === 2
                        ? "border-[#C5A059] bg-amber-50/60 dark:bg-amber-950/30 text-[#0A2540] dark:text-[#C5A059] ring-2 ring-[#C5A059]/30 font-bold"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs font-bold">2. Produk Fisik & IoT</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Robotika, AI & Hardware</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setItemForm({ ...itemForm, category_id: 3 })}
                    style={{ borderRadius: "16px" }}
                    className={`p-3 border text-left transition cursor-pointer flex flex-col justify-between ${
                      itemForm.category_id === 3
                        ? "border-[#0F4C81] bg-blue-50/60 dark:bg-blue-950/40 text-[#0F4C81] dark:text-sky-300 ring-2 ring-[#0F4C81]/30 font-bold"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="w-4 h-4 text-[#0F4C81] dark:text-sky-300" />
                      <span className="text-xs font-bold">3. Jasa & Konsultasi</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Software House & Audit</span>
                  </button>
                </div>
              </div>

              {/* 2. Program Studi Pengelola */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  2. Program Studi Pengembang / Pelaksana *
                </label>
                <select
                  value={itemForm.prodi_id}
                  onChange={(e) => setItemForm({ ...itemForm, prodi_id: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium cursor-pointer"
                >
                  {prodis.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.nama_prodi} ({p.kode_prodi})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Identitas Produk: Nama & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Produk Inovasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.nama_item}
                    onChange={(e) => setItemForm({ ...itemForm, nama_item: e.target.value })}
                    placeholder="Contoh: RintisKu SaaS OS, AI Vision Detector, dll."
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tagline / Slogan Singkat
                  </label>
                  <input
                    type="text"
                    value={itemForm.tagline}
                    onChange={(e) => setItemForm({ ...itemForm, tagline: e.target.value })}
                    placeholder="Contoh: Platform Inkubasi Startup Terpadu Berbasis AI"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* 4. Media Mockup & Thumbnail */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Foto Mockup / Thumbnail Produk *
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={itemForm.thumbnail_url || "/images/brand/slogan-poster-vokasi.jpg"}
                      alt="Preview"
                      className="w-16 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100"
                    />
                    <input
                      type="text"
                      required
                      value={itemForm.thumbnail_url}
                      onChange={(e) => setItemForm({ ...itemForm, thumbnail_url: e.target.value })}
                      placeholder="/images/catalog/... atau URL gambar"
                      className="flex-1 px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <MediaUploader
                    label="Unggah Foto Mockup Baru"
                    acceptedType="image"
                    maxSizeMb={5}
                    onUploadSuccess={(url) => setItemForm({ ...itemForm, thumbnail_url: url })}
                  />
                </div>
              </div>

              {/* 5. Deskripsi Singkat & Lengkap */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Ringkasan Singkat (Muncul di Kartu Depan) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={itemForm.deskripsi_singkat}
                    onChange={(e) => setItemForm({ ...itemForm, deskripsi_singkat: e.target.value })}
                    placeholder="Tuliskan rangkuman 1-2 kalimat fungsi utama produk inovasi ini..."
                    className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Deskripsi Lengkap & Nilai Manfaat Bagi Mitra Industri *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={itemForm.deskripsi_lengkap}
                    onChange={(e) => setItemForm({ ...itemForm, deskripsi_lengkap: e.target.value })}
                    placeholder="Uraikan detail latar belakang inovasi, keunggulan teknis, manfaat efisiensi industri, serta metodologi..."
                    className="w-full px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium leading-relaxed"
                  />
                </div>
              </div>

              {/* 6. Interaktif: Live Demo & Model 3D */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Live Demo Sandbox URL (Opsional)
                  </label>
                  <input
                    type="url"
                    value={itemForm.live_demo_url}
                    onChange={(e) => setItemForm({ ...itemForm, live_demo_url: e.target.value })}
                    placeholder="https://sandbox.uns.ac.id/demo"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Model 3D Canvas (.glb / .gltf) (Opsional)
                  </label>
                  <input
                    type="text"
                    value={itemForm.model_3d_url}
                    onChange={(e) => setItemForm({ ...itemForm, model_3d_url: e.target.value })}
                    placeholder="/models/perangkat-iot.glb"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* 7. Skema Komersialisasi & Harga */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Skema / Tipe Tarif *
                  </label>
                  <select
                    value={itemForm.harga_tipe}
                    onChange={(e) => setItemForm({ ...itemForm, harga_tipe: e.target.value as any })}
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold cursor-pointer"
                  >
                    <option value="starting_at">Mulai Dari (Starting At)</option>
                    <option value="fixed">Tarif Tetap (Fixed Price)</option>
                    <option value="contact_us">Konsultasi / Hubungi Kami</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nominal Tarif (Rp) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500000}
                    value={itemForm.harga_nominal}
                    onChange={(e) => setItemForm({ ...itemForm, harga_nominal: Number(e.target.value) })}
                    placeholder="5000000"
                    className="w-full px-4 py-2.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* 8. PIC & Laboratorium */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama PIC Dosen / Peneliti *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.pic_nama}
                    onChange={(e) => setItemForm({ ...itemForm, pic_nama: e.target.value })}
                    placeholder="Misal: Dosen Pembina & Mahasiswa"
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    No WhatsApp PIC *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.pic_kontak}
                    onChange={(e) => setItemForm({ ...itemForm, pic_kontak: e.target.value })}
                    placeholder="6281234567890"
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Laboratorium Pengembang
                  </label>
                  <input
                    type="text"
                    value={itemForm.pic_laboratorium}
                    onChange={(e) => setItemForm({ ...itemForm, pic_laboratorium: e.target.value })}
                    placeholder="Laboratorium Riset Terapan SV"
                    className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* 9. Status Publikasi */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Status Publikasi Moderasi *
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer">
                    <input
                      type="radio"
                      name="item_status_pub"
                      value="published"
                      checked={itemForm.status_publikasi === "published"}
                      onChange={() => setItemForm({ ...itemForm, status_publikasi: "published" })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Published (Tampil di Beranda)</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer">
                    <input
                      type="radio"
                      name="item_status_pub"
                      value="draft"
                      checked={itemForm.status_publikasi === "draft"}
                      onChange={() => setItemForm({ ...itemForm, status_publikasi: "draft" })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Draft (Tersimpan Privat)</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 cursor-pointer">
                    <input
                      type="radio"
                      name="item_status_pub"
                      value="archived"
                      checked={itemForm.status_publikasi === "archived"}
                      onChange={() => setItemForm({ ...itemForm, status_publikasi: "archived" })}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Archived (Diarsipkan)</span>
                  </label>
                </div>
              </div>

              {/* 10. Spesifikasi Teknis Dinamis */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Spesifikasi Teknis & Deliverables
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs text-[#0F4C81] dark:text-sky-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Spesifikasi</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {itemForm.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.group_name}
                        onChange={(e) => handleSpecChange(sIdx, "group_name", e.target.value)}
                        placeholder="Grup (misal: Hardware)"
                        className="w-1/4 px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={spec.spec_key}
                        onChange={(e) => handleSpecChange(sIdx, "spec_key", e.target.value)}
                        placeholder="Nama Spek (misal: Processor)"
                        className="w-1/3 px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      />
                      <input
                        type="text"
                        value={spec.spec_value}
                        onChange={(e) => handleSpecChange(sIdx, "spec_value", e.target.value)}
                        placeholder="Nilai (misal: ARM Cortex-M4)"
                        className="flex-1 px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(sIdx)}
                        className="p-1.5 rounded-full hover:bg-rose-50 text-rose-500 cursor-pointer"
                        title="Hapus Baris"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isItemSubmitting}
                  style={{ borderRadius: "9999px" }}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#0A2540] hover:brightness-110 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isItemSubmitting ? "Menyimpan Data..." : editingItem ? "Simpan Perubahan Inovasi" : "Daftarkan Produk Inovasi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Navigation CRUD Modal */}
      {isHeaderNavModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-300">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {editingHeaderNavIndex !== null ? "Edit Menu Navigasi Header" : "Tambah Menu Navigasi Header"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Konfigurasi tautan menu navigasi pada floating header landing page.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHeaderNavModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHeaderNavModal} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Label Menu (Bahasa Indonesia) *
                </label>
                <input
                  type="text"
                  required
                  value={headerNavLabelId}
                  onChange={(e) => setHeaderNavLabelId(e.target.value)}
                  placeholder="Contoh: Beranda, Riset Terapan, FAQ"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0F4C81] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Label Menu (English)
                </label>
                <input
                  type="text"
                  value={headerNavLabelEn}
                  onChange={(e) => setHeaderNavLabelEn(e.target.value)}
                  placeholder="Contoh: Home, Applied Research, FAQs"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0F4C81] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target URL / Anchor Link *
                </label>
                <input
                  type="text"
                  required
                  value={headerNavHref}
                  onChange={(e) => setHeaderNavHref(e.target.value)}
                  placeholder="Contoh: /#, /#katalog, /#mitra, https://..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#0F4C81] outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Gunakan format anchor misal <code className="text-[#0F4C81] dark:text-sky-300">/#katalog</code> atau tautan eksternal penuh.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={headerNavIsActive}
                    onChange={(e) => setHeaderNavIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0F4C81] focus:ring-[#0F4C81] dark:bg-slate-900 dark:border-slate-700 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Aktifkan Menu (Tampilkan di Header)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHeaderNavModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Menu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Sidebar Quick Link CRUD Modal */}
      {isSidebarLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {editingSidebarLinkIndex !== null ? "Edit Tautan Sidebar" : "Tambah Tautan Cepat Sidebar"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tambahkan tautan navigasi portal eksternal pada sidebar dashboard.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarLinkModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSidebarLinkModal} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Label Tautan Sidebar *
                </label>
                <input
                  type="text"
                  required
                  value={sidebarLinkLabel}
                  onChange={(e) => setSidebarLinkLabel(e.target.value)}
                  placeholder="Contoh: Portal Dosen, Siakad UNS, LPPM UNS"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#0F4C81] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  URL Tujuan *
                </label>
                <input
                  type="text"
                  required
                  value={sidebarLinkHref}
                  onChange={(e) => setSidebarLinkHref(e.target.value)}
                  placeholder="Contoh: https://vokasi.uns.ac.id"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#0F4C81] outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sidebarLinkIsActive}
                    onChange={(e) => setSidebarLinkIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0F4C81] focus:ring-[#0F4C81] dark:bg-slate-900 dark:border-slate-700 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Aktifkan & Tampilkan di Sidebar
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSidebarLinkModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Tautan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNewProdiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-300">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Tambah Program Studi Baru
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Daftarkan prodi baru ke direktori akademik SV UNS
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProdiModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProdi} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kode Prodi *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodiKode}
                    onChange={(e) => setProdiKode(e.target.value.toUpperCase())}
                    placeholder="Misal: D4-TRKL"
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jenjang Pendidikan *
                  </label>
                  <select
                    value={prodiJenjang}
                    onChange={(e) => setProdiJenjang(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold cursor-pointer"
                  >
                    <option value="S2 Terapan">S2 Terapan (Magister)</option>
                    <option value="Sarjana Terapan">Sarjana Terapan (D4)</option>
                    <option value="D3">Diploma Tiga (D3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Program Studi *
                </label>
                <input
                  type="text"
                  required
                  value={prodiNama}
                  onChange={(e) => setProdiNama(e.target.value)}
                  placeholder="Misal: Sarjana Terapan Teknologi Rekayasa Kendaraan Listrik"
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Fakultas / Sekolah
                </label>
                <input
                  type="text"
                  value={prodiFakultas}
                  onChange={(e) => setProdiFakultas(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Kontak Prodi
                  </label>
                  <input
                    type="email"
                    value={prodiEmail}
                    onChange={(e) => setProdiEmail(e.target.value)}
                    placeholder="prodi@vokasi.uns.ac.id"
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    WhatsApp Kontak
                  </label>
                  <input
                    type="text"
                    value={prodiWa}
                    onChange={(e) => setProdiWa(e.target.value)}
                    placeholder="6281234567890"
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewProdiModal(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ borderRadius: "9999px" }}
                  className="px-6 py-2.5 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Menyimpan..." : "Daftarkan Prodi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Prodi Modal */}
      {isEditProdiModal && editingProdi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#07192C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-sky-300">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Edit Program Studi
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {editingProdi.kode_prodi}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProdiModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProdi} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kode Prodi *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodiKode}
                    onChange={(e) => setProdiKode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jenjang Pendidikan *
                  </label>
                  <select
                    value={prodiJenjang}
                    onChange={(e) => setProdiJenjang(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold cursor-pointer"
                  >
                    <option value="S2 Terapan">S2 Terapan (Magister)</option>
                    <option value="Sarjana Terapan">Sarjana Terapan (D4)</option>
                    <option value="D3">Diploma Tiga (D3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Program Studi *
                </label>
                <input
                  type="text"
                  required
                  value={prodiNama}
                  onChange={(e) => setProdiNama(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Fakultas / Sekolah
                </label>
                <input
                  type="text"
                  value={prodiFakultas}
                  onChange={(e) => setProdiFakultas(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Kontak Prodi
                  </label>
                  <input
                    type="email"
                    value={prodiEmail}
                    onChange={(e) => setProdiEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    WhatsApp Kontak
                  </label>
                  <input
                    type="text"
                    value={prodiWa}
                    onChange={(e) => setProdiWa(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditProdiModal(false)}
                  style={{ borderRadius: "9999px" }}
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ borderRadius: "9999px" }}
                  className="px-6 py-2.5 rounded-full bg-[#0F4C81] hover:bg-[#135996] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500 font-bold flex items-center justify-center min-h-[50vh]">Memuat Dashboard Admin...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
