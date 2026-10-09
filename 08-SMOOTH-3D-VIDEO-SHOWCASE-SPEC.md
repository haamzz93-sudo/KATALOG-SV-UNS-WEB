# 08. SMOOTH 3D VIDEO SHOWCASE & SYNCHRONIZED COPYWRITING SPECIFICATION

Dokumen ini menjelaskan implementasi fitur **Smooth 3D Video Showcase** dengan transparansi video dan teks judul yang otomatis berganti dinamis mengikuti video yang sedang diputar (maksimal 3 video, durasi maksimal 30 detik per video).

---

## 1. Alasan Mengganti Frame Statis dengan Video 3D
* **Masalah Frame Statis (3 Frame):** Perpindahan gambar per scroll terasa kaku (*jerky/step-wise*) karena jumlah frame terbatas.
* **Solusi Video 3D (60 FPS):** Menggunakan video MP4/WebM berputar halus yang di-*blend* secara transparan ke latar web, memberikan ilusi objek 3D hidup tanpa membebani GPU browser pengguna.

---

## 2. Struktur 3 Video Proyek & Sinkronisasi Teks

Komponen `CanvasScrollyRobot.tsx` secara otomatis mengatur rotasi **3 Proyek Unggulan**:

| No | Proyek | File Video di `public/videos/` | Teks Judul & Subtitle | Callout Kiri | Callout Kanan |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **01** | **Robot Patroli Otonom "Arvin v2"** *(Produk IoT)* | `robot-arvin-3d.mp4` | **Robot Patroli Otonom Arvin v2**<br>*D3 Teknik Informatika & Lab Embedded* | **Otak Komputasi**<br>NVIDIA Jetson Orin Nano (Edge AI 40 TOPS) | **Sensor & Navigasi**<br>LiDAR 360° + Depth Camera SLAM 1.5 cm |
| **02** | **SaaS "Rintisku"** *(Teknologi)* | `rintisku-saas-demo.mp4` | **SaaS Rintisku Inkubasi Bisnis**<br>*Platform Portofolio Startup Mahasiswa Vokasi* | **Arsitektur Sistem**<br>Next.js 14 & Laravel 11 API Headless | **Fitur Interaktif**<br>Interactive Sandbox & Live Testing Browser |
| **03** | **Vokasi Software House** *(Jasa)* | `software-house-demo.mp4` | **Vokasi Software House Web & Mobile**<br>*Layanan Rancang Bangun Sistem Terapan* | **Metodologi Kerja**<br>Agile Sprint 14 Hari Terukur | **Jaminan Mutu**<br>Garansi 3 Bulan, Pentest & Bug-fixing |

---

## 3. Fitur Teknis Video Player & Transparansi

### A. Trik Transparansi Video di Web (`mix-blend-screen`)
Video tidak perlu memakai format ProRes yang sangat berat (>100MB). Cukup gunakan video MP4 standar dengan latar belakang hitam pekat (`#000000`).
Di kode CSS/Tailwind:
```tsx
<video
  src={currentProject.videoSrc}
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-full object-contain mix-blend-screen"
/>
```
Properti `mix-blend-screen` secara otomatis menghilangkan piksel hitam menjadi **100% transparan**, sehingga objek robot/aplikasi menyatu sempurna dengan latar belakang web tanpa kotak hitam kaku!

### B. Kontrol Durasi Maksimal 30 Detik & Auto-Advance
* Setiap video memiliki batas waktu maksimal **30 detik**.
* Terdapat **Timeline Bar** di bagian bawah yang menunjukkan detik berjalan (`00:xx / 00:30s`).
* Setelah mencapai 30 detik, sistem secara otomatis beralih (*cross-fade*) ke video berikutnya.
* Pengunjung juga dapat mengklik tab nomor di atas (`[ 01. Robot ] [ 02. SaaS ] [ 03. Software House ]`) untuk berpindah langsung.

### C. Fallback Cerdas (Anti-Blank)
Jika Anda belum meletakkan file `.mp4` ke dalam folder `public/videos/`, sistem tidak akan menampilkan error atau kotak kosong. Sistem otomatis beralih ke **Mode Animasi Melayang (*Smooth Floating Motion*)** menggunakan foto mockup beresolusi tinggi yang sudah dibuat sebelumnya.

---

## 4. Cara Menambahkan Video 3D Anda Sendiri

Cukup simpan video rekaman 3D atau demo aplikasi Anda ke folder berikut:
1. `D:\Landing Page\KATALOG UNS\frontend\public\videos\robot-arvin-3d.mp4`
2. `D:\Landing Page\KATALOG UNS\frontend\public\videos\rintisku-saas-demo.mp4`
3. `D:\Landing Page\KATALOG UNS\frontend\public\videos\software-house-demo.mp4`

Rekomendasi spesifikasi video:
* **Resolusi:** 1080 x 1080 (persegi 1:1) atau 1920 x 1080 (16:9).
* **Format:** MP4 (H.264 codec).
* **Latar Belakang:** Hitam pekat solid (`#000000`) agar efek transparansi sempurna.
* **Ukuran File:** Usahakan di bawah 6 MB per video (bisa dikompres via Handbrake atau skrip ffmpeg).
