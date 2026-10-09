# 06. IMPLEMENTASI 3D SCROLL IMAGE SEQUENCE (CANVAS SCROLL ala APPLE)

Teknik yang Anda sebutkan adalah teknik **Image Sequence / Frame-by-Frame Scrollytelling**. Teknik ini dipopulerkan oleh Apple (pada halaman AirPods Pro, MacBook Pro, dan Vision Pro) karena memiliki **keunggulan performa mutlak**:
1. **Sangat Ringan**: Tidak perlu me-render jutaan poligon 3D WebGL secara real-time yang bisa membuat GPU laptop panas atau patah-patah.
2. **Kualitas Fotorealistik 100%**: Karena setiap *frame* adalah hasil render gambar berkualitas tinggi, pencahayaan dan pantulan material tampak sempurna di semua browser & HP.
3. **Smooth Scroll**: Pergantian frame terikat langsung dengan koordinat scroll pengguna (*scroll progress*).

---

## 1. Lokasi Aset Sequence yang Sudah Dibuat

Semua aset frame urutan rotasi produk telah disimpan di direktori proyek:
* `public/images/sequence/robot-frame-01.jpg` -> Frame 1: Tampak Depan (0°)
* `public/images/sequence/robot-frame-02.jpg` -> Frame 2: Sudut Tiga Perempat (45°)
* `public/images/sequence/robot-frame-03.jpg` -> Frame 3: Profil Samping Penuh (90°)
* `public/images/backgrounds/dark-web-background.jpg` -> Latar Hitam Studio Seamless

---

## 2. Komponen Next.js / React: `CanvasScrollyRobot.tsx`

Berikut komponen siap pakai untuk menampilkan animasi rotasi 3D per frame saat di-scroll:

```tsx
// src/components/3d/CanvasScrollyRobot.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";

const FRAME_PATHS = [
  "/images/sequence/robot-frame-01.jpg",
  "/images/sequence/robot-frame-02.jpg",
  "/images/sequence/robot-frame-03.jpg",
];

export const CanvasScrollyRobot: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Mengambil posisi scroll progress (0 s/d 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Preload seluruh image sequence ke memory browser
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    FRAME_PATHS.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        loadedImages[index] = img;
        if (loadedCount === FRAME_PATHS.length) {
          setImages(loadedImages);
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  // 2. Gambar frame yang sesuai ke Canvas saat scroll bergerak
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const render = (progress: number) => {
      // Menghitung indeks frame berdasarkan progress scroll
      const totalFrames = images.length;
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(progress * totalFrames)
      );

      const activeImg = images[frameIndex];
      if (activeImg) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Gambar gambar ke tengah canvas (cover/contain style)
        const hRatio = canvas.width / activeImg.width;
        const vRatio = canvas.height / activeImg.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShiftX = (canvas.width - activeImg.width * ratio) / 2;
        const centerShiftY = (canvas.height - activeImg.height * ratio) / 2;

        context.drawImage(
          activeImg,
          0,
          0,
          activeImg.width,
          activeImg.height,
          centerShiftX,
          centerShiftY,
          activeImg.width * ratio,
          activeImg.height * ratio
        );
      }
    };

    // Render frame pertama
    render(scrollYProgress.get());

    // Berlangganan perubahan scroll progress
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      render(latest);
    });

    return () => unsubscribe();
  }, [imagesLoaded, images, scrollYProgress]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#050811]">
      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Latar Belakang Hitam Berpendar */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none"
          style={{ backgroundImage: `url('/images/backgrounds/dark-web-background.jpg')` }}
        />

        {/* HTML5 Canvas untuk Render Frame Sequence */}
        <canvas
          ref={canvasRef}
          width={1000}
          height={1000}
          className="relative z-10 w-[350px] sm:w-[500px] md:w-[650px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(15,76,129,0.3)]"
        />

        {/* Floating Callout Text ala Apple */}
        <div className="absolute bottom-16 inset-x-6 text-center z-20 pointer-events-none">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">
            Interactive Frame-by-Frame Sequence
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
            Putar & Periksa Detail Robotika Arvin v2
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Gulir layar ke bawah atau ke atas untuk memutar sudut pandang produk.
          </p>
        </div>
      </div>
    </section>
  );
};
```
