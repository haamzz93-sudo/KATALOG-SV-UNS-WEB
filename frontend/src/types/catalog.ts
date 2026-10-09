export interface Role {
  id: number;
  name: "super_admin" | "pimpinan_sv" | "prodi";
  label: string;
}

export interface Prodi {
  id: number;
  kode_prodi: string;
  nama_prodi: string;
  jenjang: string;
  fakultas_sekolah: string;
  kontak_email: string | null;
  kontak_wa: string | null;
  logo_url: string | null;
  catalog_items_count?: number;
}

export interface Category {
  id: number;
  slug: "teknologi" | "produk" | "jasa";
  nama: string;
  deskripsi: string | null;
  icon_name: string;
  catalog_items_count?: number;
}

export interface CatalogSpec {
  id: number;
  catalog_item_id: number;
  group_name: string;
  spec_key: string;
  spec_value: string;
  order_index: number;
}

export interface CatalogMedia {
  id: number;
  catalog_item_id: number;
  file_url: string;
  media_type: "image" | "video" | "glb";
  is_primary: boolean;
  caption: string | null;
}

export interface CatalogItem {
  id: number;
  prodi_id: number;
  category_id: number;
  nama_item: string;
  slug: string;
  tagline: string | null;
  deskripsi_singkat: string;
  deskripsi_lengkap: string;
  live_demo_url: string | null;
  model_3d_url: string | null;
  thumbnail_url: string;
  status_publikasi: "draft" | "published" | "archived";
  harga_tipe: "fixed" | "starting_at" | "contact_us";
  harga_nominal: number;
  pic_nama: string;
  pic_kontak: string;
  pic_laboratorium: string | null;
  view_count: number;
  demo_click_count: number;
  inquiry_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  prodi?: Prodi;
  specs?: CatalogSpec[];
  media?: CatalogMedia[];
}

export interface Inquiry {
  id: number;
  catalog_item_id: number;
  nama_pengunjung: string;
  instansi: string;
  email: string;
  no_wa: string;
  pesan: string;
  status: "unread" | "responded" | "deal";
  created_at: string;
  catalog_item?: CatalogItem;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "pimpinan_sv" | "prodi" | string;
  role_label?: string;
  prodi_id?: number;
  prodi?: {
    id: number;
    kode: string;
    nama: string;
  } | null;
  is_active?: boolean;
}
