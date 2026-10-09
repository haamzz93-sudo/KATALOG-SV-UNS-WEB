# 05. WORKFLOW GENERASI ASET VISUAL, MOCKUP & MODEL 3D

Dokumen ini berisi panduan alur kerja (*pipeline*) pembuatan aset gambar mockup produk, visual antarmuka SaaS, foto produk robotika, serta konversi model 3D siap web yang bebas dari kesan murahan (*anti AI slop*).

---

## 1. Standar Estetika & Brand Guidelines Aset

Agar seluruh aset visual selaras dengan identitas **Sekolah Vokasi (UNS)** dan standar Apple/Framework/Stripe:
* **Palet Warna Dominan:**
  * Latar belakang: Studio White (`#F8FAFC` atau `#FFFFFF`) atau Deep Academic Navy (`#0A2540`).
  * Aksen hardware/UI: Metallic Gold (`#C5A059`) dan Royal Blue (`#0F4C81`).
* **Pencahayaan (Lighting):** Soft studio softbox lighting, 45-degree key light, subtle rim light pada tepi objek logam/plastik matte.
* **Komposisi:** Minimalis, simetris, fokus tajam (*shallow depth of field* f/4), tidak ada artefak teks acak atau kabel berantakan.

---

## 2. Koleksi Prompt Generasi Gambar Siap Pakai (Midjourney v6 / Flux / Imagen 3)

### A. Aset 1: Produk Fisik Robotik "Robot Arvin v2" (Exploded Hardware & Studio Shot)

#### Prompt 1: Studio Shot Produk Jadi (Katalog & Detail)
```text
Commercial product photography of an advanced autonomous mobile patrol robot named "Arvin v2", built by university robotics lab. Compact sleek geometric chassis made of matte dark navy blue aluminum and crisp white poly-carbonate casing with subtle metallic gold anodized accents. Equipped with a top-mounted 360-degree cylindrical LiDAR sensor, dual front-facing stereo depth cameras, and rugged omnidirectional mecanum wheels. Shot in a clean minimalist high-tech studio with soft diffuse lighting, neutral slate floor, elegant soft shadows, ultra-sharp focus, photorealistic 8k, Hasselblad medium format look --ar 16:9 --style raw --v 6.0
```

#### Prompt 2: Exploded View / Modular Disassembly (Ala Framework Laptop)
```text
Technical exploded view diagram rendering of a smart IoT autonomous patrol robot, components disassembled and floating symmetrically in clean mid-air. Visible interior modular parts: top lid chassis with gold trim, precision servo motor bracket, NVIDIA Jetson edge computing circuit board with heatsink, lithium battery pack, LiDAR module, wiring harness, and aluminum wheel assembly. Clean white studio background, blueprint-like clarity, high industrial engineering precision, isometric perspective, octane render style --ar 16:9 --v 6.0
```

---

### B. Aset 2: Teknologi SaaS "Rintisku" (Mockup Dashboard Layar Kaca)

#### Prompt 1: Mockup Antarmuka SaaS di Laptop Minimalis
```text
Front-facing angle hero mockup of a cutting-edge web application dashboard called "Rintisku" displayed on a sleek borderless metallic laptop screen. The web UI features a pristine enterprise design system with deep navy blue sidebar (#0A2540), crisp white cards, smooth data analytics charts, progress milestones, and gold highlighted badges (#C5A059). Laptop is resting on a minimal matte stone desk next to modern architectural blueprint sketches and a cup of coffee. Warm soft morning natural light from the side, clean depth of field, premium UI/UX portfolio presentation --ar 16:9 --v 6.0
```

#### Prompt 2: Floating Glass Bento Cards (Untuk Section Fitur Live Demo)
```text
Clean 3D UI floating widget elements hovering over a deep navy blue gradient background. A sleek analytics card showing user traction metrics with golden graph lines, an interactive live toggle button, and a clean code snippet terminal card with syntax highlighting. Glassmorphism acrylic materials with subtle golden glowing borders, ambient occlusion, polished product showcase aesthetic --ar 16:9 --v 6.0
```

---

### C. Aset 3: Kategori Jasa "Vokasi Software House" (Tim Rekayasa Terapan)

#### Prompt 1: Foto Tim Pengembang & Laboratorium Riset
```text
Professional editorial photograph of vocational university software engineering students and senior lecturer collaborating in a modern open-space research laboratory. Two developers examining clean code on dual curved monitors, while a female UI designer points at wireframes on a tablet. Modern campus tech hub environment with glass whiteboards containing architecture diagrams, comfortable ergonomic setup, subtle blue and amber ambient lighting, authentic collaborative atmosphere, confident and capable expression, cinematic documentary lighting --ar 16:9 --v 6.0
```

---

### D. Aset 4: Hero Banner 3D Inovasi Vokasi (Untuk Beranda Utama)

#### Prompt: Abstract Academic Innovation Orb
```text
Futuristic 3D abstract sculpture symbolizing vocational technological innovation and university-industry collaboration. Interlocking geometric rings of brushed midnight navy titanium, ceramic white, and polished brass gold floating gracefully. Delicate glowing data grid lines weaving through the structure. Dark navy deep space background with soft volumetric gold light rays, clean cinematic lighting, 8k render, Behance award-winning 3D design --ar 21:9 --v 6.0
```

---

## 3. Pipeline Pembuatan Aset 3D untuk Web (GLB < 2.5 MB)

Agar website tetap **ringan, tidak lag saat di-scroll, dan mencapai 60 FPS**, ikuti alur konversi ini:

```
[2D Concept Image / Prompt] 
          │
          ▼
[Generasi Mesh 3D via Tripo3D / Meshy.ai / CAD SolidWorks Mahasiswa]
          │
          ▼
[Blender 4.x Retopology & Optimization]
  - Decimate mesh agar poligon di bawah 45.000 tris.
  - Bake material ke dalam 1 texture atlas (PBR: Base Color, Roughness, Normal) ukuran 2048x2048.
  - Hapus vertex groups dan animasi yang tidak perlu.
          │
          ▼
[Export ke format .GLB (Binary glTF)]
          │
          ▼
[Draco Compression via gltf-pipeline]
  npx gltf-pipeline -i robot-arvin.glb -o robot-arvin-opt.glb -d --draco.compressionLevel 7
          │
          ▼
[Target Akhir: Ukuran File <= 2.2 MB -> Siap Dimuat di Next.js Canvas]
```

---

## 4. Skrip Otomatisasi Kompresi Gambar (WebP & AVIF)

Gunakan skrip Node.js berikut untuk memastikan seluruh foto mockup prodi dikompresi otomatis sebelum diunggah ke katalog:

```javascript
// scripts/optimize-images.mjs
import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./public/images/raw";
const outputDir = "./public/images/catalog";

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir).forEach(async (file) => {
  const ext = path.extname(file).toLowerCase();
  if ([".jpg", ".jpeg", ".png"].includes(ext)) {
    const filename = path.basename(file, ext);
    
    // Generate WebP High Performance
    await sharp(path.join(inputDir, file))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(outputDir, `${filename}.webp`));

    console.log(`✓ Teroptimasi: ${filename}.webp`);
  }
});
```
