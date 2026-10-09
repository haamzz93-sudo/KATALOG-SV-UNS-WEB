export interface FAQItem {
  id: string | number;
  question: string;
  answer: string;
  category?: string;
  question_en?: string;
  answer_en?: string;
  category_en?: string;
  isActive: boolean;
  orderIndex: number;
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Bagaimana alur kemitraan atau lisensi produk inovasi Sekolah Vokasi UNS?",
    answer: "Mitra industri atau instansi pemerintah dapat menghubungi PIC Kemitraan melalui tombol kontak atau mengirim formulir 'Ajukan Kemitraan' pada halaman detail produk. Tim Hilirisasi Riset SV UNS akan menyiapkan NDA, demonstrasi teknis, dan draf Perjanjian Kerja Sama (PKS) atau lisensi Hak Kekayaan Intelektual (HAKI).",
    category: "Kemitraan & Lisensi",
    question_en: "What is the procedure for partnership or licensing innovations from UNS Vocational School?",
    answer_en: "Industry partners or government agencies can contact our Partnership Lead or submit the 'Apply for Partnership' inquiry on the product detail page. The SV UNS Research Commercialization Team will prepare an NDA, technical demonstration, and draft Cooperation Agreement (PKS) or Intellectual Property (IP) license.",
    category_en: "Partnership & Licensing",
    isActive: true,
    orderIndex: 1,
  },
  {
    id: 2,
    question: "Apakah mitra dapat mencoba interactive live sandbox / demo produk secara langsung?",
    answer: "Ya. Untuk produk kategori Teknologi & SaaS, pengunjung dapat langsung mengklik tombol 'Coba Live Demo' di katalog untuk menguji aplikasi secara interaktif dalam sandbox iframe (tampilan desktop dan mobile). Untuk produk Robotika IoT dan Jasa Software, disediakan video demo high-definition dan jadwal uji fungsi lapangan.",
    category: "Produk & Demo",
    question_en: "Can enterprise partners test interactive live sandboxes or product demos directly?",
    answer_en: "Yes. For Technology & SaaS products, visitors can click 'Try Live Demo' to interactively test the applications within a secure in-browser sandbox (desktop and mobile viewports). For Robotics/IoT and Custom Software, we provide HD video walk-throughs and on-site testing schedules.",
    category_en: "Products & Demos",
    isActive: true,
    orderIndex: 2,
  },
  {
    id: 3,
    question: "Bagaimana skema biaya dan garansi untuk layanan Jasa Software House Vokasi?",
    answer: "Skema biaya disesuaikan dengan ruang lingkup Product Requirement Document (PRD) dan sprint agile. Setiap proyek software didampingi oleh Dosen Ahli dan talenta developer mahasiswa bersertifikasi, lengkap dengan penyerahan source code, dokumentasi teknis, serta garansi pemeliharaan dan bug fixing selama 3 hingga 6 bulan pasca-deployment.",
    category: "Jasa Software",
    question_en: "What is the pricing model and warranty for Vocational Software House services?",
    answer_en: "Pricing is scoped according to your Product Requirement Document (PRD) and agile sprint milestones. Every software initiative is supervised by Faculty Experts and certified student engineers, including complete Git repository handover, API documentation, and 3 to 6 months of post-deployment maintenance and bug-fixing warranty.",
    category_en: "Software Services",
    isActive: true,
    orderIndex: 3,
  },
  {
    id: 4,
    question: "Siapa yang memiliki hak cipta (HAKI / Paten) dari produk yang dihasilkan?",
    answer: "Kepemilikan hak cipta institusional berada di bawah naungan Sentra HAKI Universitas Sebelas Maret (UNS). Bagi mitra industri komersial, SV UNS menyediakan skema Lisensi Eksklusif atau Non-Eksklusif, maupun transfer teknologi sesuai kesepakatan Tri Dharma Perguruan Tinggi dan industri.",
    category: "Legal & HAKI",
    question_en: "Who owns the intellectual property (IP / Patents) of the resulting innovations?",
    answer_en: "Institutional IP ownership is overseen by the IP Center of Universitas Sebelas Maret (UNS). For commercial enterprise partners, SV UNS offers flexible Exclusive or Non-Exclusive Licensing frameworks, as well as full technology transfers according to mutual university-industry agreements.",
    category_en: "Legal & IP",
    isActive: true,
    orderIndex: 4,
  },
  {
    id: 5,
    question: "Apakah instrumen IoT, Robotika, atau Mekatronika dapat dipesan sesuai kebutuhan khusus instansi?",
    answer: "Tentu. Laboratorium Mekatronika & Embedded System Sekolah Vokasi UNS menerima perancangan purwarupa (prototyping) hingga instrumen siap uji berspesifikasi khusus (seperti robot patroli indoor/outdoor, smart monitoring sensor, dan automasi industri terapan).",
    category: "Hardware & IoT",
    question_en: "Can IoT, Robotics, or Mechatronics instruments be customized for specific institutional needs?",
    answer_en: "Absolutely. The Mechatronics & Embedded Systems Lab at UNS Vocational School accepts bespoke engineering requests from rapid prototyping to field-ready units (such as indoor/outdoor patrol robots, smart environmental telemetry sensors, and applied industrial automation).",
    category_en: "Hardware & IoT",
    isActive: true,
    orderIndex: 5,
  },
];

const STORAGE_KEY = "VOKASI_FAQS";

export const getStoredFAQs = (): FAQItem[] => {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FAQS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FAQS;
  } catch (e) {
    console.error("Failed to load FAQs:", e);
    return DEFAULT_FAQS;
  }
};

export const saveStoredFAQs = (faqs: FAQItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
    window.dispatchEvent(new Event("faqs_updated"));
  } catch (e) {
    console.error("Failed to save FAQs:", e);
  }
};

export const addFAQ = (newFaq: Omit<FAQItem, "id">): FAQItem => {
  const current = getStoredFAQs();
  const created: FAQItem = {
    ...newFaq,
    id: Date.now(),
    orderIndex: current.length + 1,
  };
  const updated = [...current, created];
  saveStoredFAQs(updated);
  return created;
};

export const updateFAQ = (id: string | number, updatedFields: Partial<FAQItem>): void => {
  const current = getStoredFAQs();
  const updated = current.map((faq) => (faq.id === id ? { ...faq, ...updatedFields } : faq));
  saveStoredFAQs(updated);
};

export const deleteFAQ = (id: string | number): void => {
  const current = getStoredFAQs();
  const updated = current.filter((faq) => faq.id !== id);
  saveStoredFAQs(updated);
};

export const toggleFAQStatus = (id: string | number): void => {
  const current = getStoredFAQs();
  const updated = current.map((faq) => (faq.id === id ? { ...faq, isActive: !faq.isActive } : faq));
  saveStoredFAQs(updated);
};

export const resetStoredFAQs = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("faqs_updated"));
  } catch (e) {
    console.error("Failed to reset FAQs:", e);
  }
};
