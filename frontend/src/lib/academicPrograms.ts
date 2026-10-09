// Direktori Resmi 39 Program Studi Sekolah Vokasi Universitas Sebelas Maret (UNS Pusat)
export interface AcademicProgram {
  name: string;
  code: string;
  degree: "S2" | "D4" | "D3";
}

export const OFFICIAL_ACADEMIC_PROGRAMS = {
  magister: [
    { name: "S2 Terapan Keselamatan dan Kesehatan Kerja (K3)", code: "S2-K3", degree: "S2" as const }
  ],
  sarjanaTerapan: [
    { name: "Bisnis Kreatif", code: "D4-BK", degree: "D4" as const },
    { name: "Keselamatan dan Kesehatan Kerja", code: "D4-K3", degree: "D4" as const },
    { name: "Manajemen Logistik", code: "D4-ML", degree: "D4" as const },
    { name: "Pengelolaan Konvensi dan Acara (MICE)", code: "D4-MICE", degree: "D4" as const },
    { name: "Kebidanan", code: "D4-KEB", degree: "D4" as const },
    { name: "Usaha Perjalanan Wisata", code: "D4-UPW", degree: "D4" as const },
    { name: "Produksi Ternak", code: "D4-PT", degree: "D4" as const },
    { name: "Rekayasa Perangkat Lunak", code: "D4-RPL", degree: "D4" as const },
    { name: "Sains Data", code: "D4-SD", degree: "D4" as const },
    { name: "Sumber Daya Air", code: "D4-SDA", degree: "D4" as const },
    { name: "Tata Boga", code: "D4-TB", degree: "D4" as const },
    { name: "Teknologi Komputer", code: "D4-TK", degree: "D4" as const },
    { name: "Teknologi Pangan", code: "D4-TP", degree: "D4" as const },
    { name: "Teknologi Rekayasa Kendaraan Listrik", code: "D4-TRKL", degree: "D4" as const },
    { name: "Teknologi Rekayasa Otomasi", code: "D4-TRO", degree: "D4" as const },
    { name: "Teknologi Rekayasa Informasi dan Komunikasi Terapan (TIKA)", code: "D4-TIKA", degree: "D4" as const },
    { name: "Teknologi Rekayasa Pangan (TRP)", code: "D4-TRP", degree: "D4" as const },
  ],
  diplomaTiga: [
    { name: "Akuntansi", code: "D3-AKT", degree: "D3" as const },
    { name: "Bahasa Inggris", code: "D3-BING", degree: "D3" as const },
    { name: "Bahasa Mandarin", code: "D3-BMAND", degree: "D3" as const },
    { name: "Budidaya Ternak", code: "D3-BDT", degree: "D3" as const },
    { name: "Desain Komunikasi Visual", code: "D3-DKV", degree: "D3" as const },
    { name: "Farmasi", code: "D3-FAR", degree: "D3" as const },
    { name: "Kebidanan", code: "D3-KEB", degree: "D3" as const },
    { name: "Keuangan Perbankan", code: "D3-KP", degree: "D3" as const },
    { name: "Manajemen Bisnis", code: "D3-MB", degree: "D3" as const },
    { name: "Manajemen Pemasaran", code: "D3-MPEM", degree: "D3" as const },
    { name: "Manajemen Perdagangan", code: "D3-MPER", degree: "D3" as const },
    { name: "Manajemen Administrasi", code: "D3-MA", degree: "D3" as const },
    { name: "Perpajakan", code: "D3-PJK", degree: "D3" as const },
    { name: "Teknik Mesin", code: "D3-TM", degree: "D3" as const },
    { name: "Teknik Sipil", code: "D3-TS", degree: "D3" as const },
    { name: "Teknik Informatika", code: "D3-TIF", degree: "D3" as const },
    { name: "Teknologi Hasil Pertanian", code: "D3-THP", degree: "D3" as const },
    { name: "Komunikasi Terapan", code: "D3-KT", degree: "D3" as const },
  ]
};

export const ALL_OFFICIAL_PROGRAMS: AcademicProgram[] = [
  ...OFFICIAL_ACADEMIC_PROGRAMS.magister,
  ...OFFICIAL_ACADEMIC_PROGRAMS.sarjanaTerapan,
  ...OFFICIAL_ACADEMIC_PROGRAMS.diplomaTiga,
];
