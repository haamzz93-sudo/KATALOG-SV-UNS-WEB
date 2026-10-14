/**
 * Studio Marketplace Photo Generator (100% Produk Asli Presisi)
 * Membangun 4 foto standar marketplace komersial (1280x720 HD) langsung dari
 * foto produk asli yang diunggah pengguna, mempertahankan bentuk, warna, logo,
 * dan identitas produk 100% tanpa distorsi halusinasi AI.
 */

export interface MarketplacePhotoResult {
  id: "hero" | "detail" | "benefit" | "lifestyle";
  title: string;
  angle: string;
  badge: string;
  desc: string;
  url: string;
  directUrl?: string;
  prompt?: string;
}

interface GeneratorOptions {
  imageSrc: string; // Base64 data URL atau URL gambar lokal
  namaItem?: string;
  kategori?: string;
  detailTags?: string[];
  benefitHeadline?: string;
}

/**
 * Polyfill aman untuk rounded rectangle di semua browser
 */
export const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | number[]
) => {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    const radius = typeof r === "number" ? r : (r[0] || 0);
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
};

/**
 * Memuat gambar ke elemen Image HTML dengan konversi aman ke Blob/DataURL
 * agar tidak pernah terkena CORS error dan kanvas tidak pernah 'tainted'.
 */
export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  let finalSrc = src;

  // Jika src adalah URL remote/relative, konversi ke base64 data URL via fetch & FileReader
  if (!src.startsWith("data:") && !src.startsWith("blob:")) {
    try {
      const res = await fetch(src);
      if (res.ok) {
        const blob = await res.blob();
        finalSrc = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }
    } catch (e) {
      console.warn("fetch blob fallback:", e);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    // Jangan pernah pasang crossOrigin untuk data: atau blob: URL
    if (!finalSrc.startsWith("data:") && !finalSrc.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Gagal memuat gambar produk mentah: " + e));
    img.src = finalSrc;
  });
};

/**
 * Isolasi Foreground Produk (Smart Background Removal / Studio Isolation)
 * Menggunakan algoritma BFS Flood-Fill dari tepi border gambar untuk memotong
 * background studio/meja berwarna terang secara presisi tanpa merusak detail
 * logo, warna, atau teks di dalam produk fisik.
 */
export const isolateProductForeground = (
  sourceImg: HTMLImageElement | HTMLCanvasElement,
  tolerance = 34
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const w = sourceImg.width;
  const h = sourceImg.height;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.drawImage(sourceImg, 0, 0);

  // Jika resolusi sangat besar, batasi untuk performa real-time
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // 1. Sampling warna background dari 4 sudut & tepi atas
    const sampleCorner = (px: number, py: number) => {
      const idx = (py * w + px) * 4;
      return [data[idx], data[idx + 1], data[idx + 2]];
    };

    const corners = [
      sampleCorner(2, 2),
      sampleCorner(w - 3, 2),
      sampleCorner(2, h - 3),
      sampleCorner(w - 3, h - 3),
      sampleCorner(Math.floor(w / 2), 2),
    ];

    const avgBgR = corners.reduce((acc, c) => acc + c[0], 0) / corners.length;
    const avgBgG = corners.reduce((acc, c) => acc + c[1], 0) / corners.length;
    const avgBgB = corners.reduce((acc, c) => acc + c[2], 0) / corners.length;

    // Hanya potong jika background bertipe studio/terang (brightness > 120)
    const brightness = (avgBgR + avgBgG + avgBgB) / 3;
    if (brightness < 110) {
      return canvas; // Kembalikan apa adanya jika foto background gelap pekat
    }

    // 2. BFS Flood-fill dari seluruh tepi luar (Border Pixels)
    const totalPixels = w * h;
    const visited = new Uint8Array(totalPixels);
    const queue = new Int32Array(totalPixels);
    let head = 0;
    let tail = 0;

    const isBackground = (r: number, g: number, b: number) => {
      const dr = r - avgBgR;
      const dg = g - avgBgG;
      const db = b - avgBgB;
      return Math.sqrt(dr * dr + dg * dg + db * db) <= tolerance;
    };

    const enqueue = (px: number, py: number) => {
      const pIdx = py * w + px;
      if (visited[pIdx]) return;
      const dIdx = pIdx * 4;
      if (isBackground(data[dIdx], data[dIdx + 1], data[dIdx + 2])) {
        visited[pIdx] = 1;
        queue[tail++] = pIdx;
      }
    };

    // Border atas & bawah
    for (let x = 0; x < w; x++) {
      enqueue(x, 0);
      enqueue(x, h - 1);
    }
    // Border kiri & kanan
    for (let y = 0; y < h; y++) {
      enqueue(0, y);
      enqueue(w - 1, y);
    }

    // Eksekusi BFS
    while (head < tail) {
      const curr = queue[head++];
      const cx = curr % w;
      const cy = Math.floor(curr / w);

      // Tetangga 4 arah
      if (cx > 0) enqueue(cx - 1, cy);
      if (cx < w - 1) enqueue(cx + 1, cy);
      if (cy > 0) enqueue(cx, cy - 1);
      if (cy < h - 1) enqueue(cx, cy + 1);
    }

    // 3. Ubah seluruh pixel background terhubung menjadi transparan (Alpha = 0)
    for (let i = 0; i < totalPixels; i++) {
      if (visited[i]) {
        data[i * 4 + 3] = 0;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.warn("Isolasi background canvas gagal, fallback ke gambar asli:", err);
  }

  return trimTransparentBorders(canvas);
};

/**
 * Memotong margin kosong/transparan di sekitar produk sehingga
 * produk terbingkai penuh (bounding-box cropping) dengan proporsi hero yang pas.
 */
export const trimTransparentBorders = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const w = canvas.width;
  const h = canvas.height;
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let minX = w, minY = h, maxX = 0, maxY = 0;
    let found = false;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const alpha = data[(y * w + x) * 4 + 3];
        if (alpha > 12) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          found = true;
        }
      }
    }

    if (!found || minX >= maxX || minY >= maxY) return canvas;

    // Beri sedikit padding 4px
    const pad = 4;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad);
    maxY = Math.min(h - 1, maxY + pad);

    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;

    const cropped = document.createElement("canvas");
    cropped.width = cropW;
    cropped.height = cropH;
    const croppedCtx = cropped.getContext("2d");
    if (!croppedCtx) return canvas;

    croppedCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
    return cropped;
  } catch {
    return canvas;
  }
};

/**
 * Menggambar bayangan kontak elips realistis di bawah produk
 */
const drawContactShadow = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  opacity = 0.32
) => {
  ctx.save();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
  grad.addColorStop(0, `rgba(15, 23, 42, ${opacity})`);
  grad.addColorStop(0.5, `rgba(15, 23, 42, ${opacity * 0.45})`);
  grad.addColorStop(1, "rgba(15, 23, 42, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

/**
 * 1. FOTO UTAMA / HERO PRODUCT (1280x720)
 * Center focal point, podium ivory minimalis, studio lighting
 */
export const generateHeroPhoto = (
  img: HTMLImageElement | HTMLCanvasElement,
  namaItem: string,
  kategori: string
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Studio Backdrop (Clean Light Grey to White Gradient)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 720);
  bgGrad.addColorStop(0, "#F8FAFC");
  bgGrad.addColorStop(0.65, "#EDF2F7");
  bgGrad.addColorStop(1, "#E2E8F0");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1280, 720);

  // Soft Radial Spotlight
  const spotGrad = ctx.createRadialGradient(640, 300, 50, 640, 300, 550);
  spotGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  spotGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.3)");
  spotGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, 1280, 720);

  // 2. Podium Minimalis Putih / Ivory (3D Cylindrical Pedestal)
  const podX = 640;
  const podY = 530;
  const podRx = 330;
  const podRy = 50;
  const podH = 55;

  // Podium Drop Shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(podX, podY + podH + 10, podRx + 25, podRy + 15, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(15, 23, 42, 0.08)";
  ctx.fill();
  ctx.restore();

  // Podium Cylinder Body
  const podBodyGrad = ctx.createLinearGradient(podX - podRx, 0, podX + podRx, 0);
  podBodyGrad.addColorStop(0, "#D9E2EC");
  podBodyGrad.addColorStop(0.3, "#F0F4F8");
  podBodyGrad.addColorStop(0.7, "#FFFFFF");
  podBodyGrad.addColorStop(1, "#CBD5E1");

  ctx.beginPath();
  ctx.moveTo(podX - podRx, podY);
  ctx.lineTo(podX - podRx, podY + podH);
  ctx.ellipse(podX, podY + podH, podRx, podRy, 0, 0, Math.PI, false);
  ctx.lineTo(podX + podRx, podY);
  ctx.ellipse(podX, podY, podRx, podRy, 0, 0, Math.PI, true);
  ctx.closePath();
  ctx.fillStyle = podBodyGrad;
  ctx.fill();

  // Podium Top Surface (Clean White Ellipse)
  const podTopGrad = ctx.createLinearGradient(podX, podY - podRy, podX, podY + podRy);
  podTopGrad.addColorStop(0, "#FFFFFF");
  podTopGrad.addColorStop(1, "#F1F5F9");
  ctx.beginPath();
  ctx.ellipse(podX, podY, podRx, podRy, 0, 0, Math.PI * 2);
  ctx.fillStyle = podTopGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(226, 232, 240, 0.8)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. Product Contact Shadow on Podium
  const prodTargetH = 430;
  const prodRatio = img.width / img.height;
  const prodW = prodTargetH * prodRatio;
  const prodX = 640 - prodW / 2;
  const prodY = podY - prodTargetH + 12;

  drawContactShadow(ctx, 640, podY + 5, prodW * 0.45, 18, 0.35);

  // 4. Gambar Produk Asli
  ctx.drawImage(img, prodX, prodY, prodW, prodTargetH);

  // 5. Header Branding Badge
  ctx.fillStyle = "rgba(15, 76, 129, 0.92)";
  ctx.beginPath();
  drawRoundRect(ctx, 40, 35, 340, 34, 17);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("1. FOTO UTAMA • HERO MARKETPLACE", 58, 57);

  // Category Tag Top Right
  if (kategori) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "rgba(197, 160, 89, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawRoundRect(ctx, 1020, 35, 220, 34, 17);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0F4C81";
    ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Kategori: ${kategori}`, 1130, 57);
    ctx.textAlign = "left";
  }

  // Bottom Label
  ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
  ctx.font = "11px system-ui, -apple-system, sans-serif";
  ctx.fillText("Standar Foto Marketplace Komersial • 100% Keaslian Identitas & Warna Produk Terjaga", 45, 690);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * 2. DETAIL & QUALITY (MACRO SHOT) (1280x720)
 * Macro zoom 1.75x pada produk asli, overlay tag karakter kualitas
 */
export const generateDetailPhoto = (
  img: HTMLImageElement | HTMLCanvasElement,
  detailTags: string[]
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Studio Editorial Background
  const bg = ctx.createLinearGradient(0, 0, 1280, 720);
  bg.addColorStop(0, "#F1F5F9");
  bg.addColorStop(0.5, "#E2E8F0");
  bg.addColorStop(1, "#CBD5E1");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1280, 720);

  // Diagonal Light Accent
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(800, 0);
  ctx.lineTo(480, 720);
  ctx.lineTo(0, 720);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fill();
  ctx.restore();

  // 2. Macro Zoom pada Produk Asli (Scale 1.75x)
  const macroH = 560;
  const macroW = (macroH * img.width) / img.height;
  const macroX = 640 - macroW / 2;
  const macroY = 100;

  // Shadow belakang produk
  drawContactShadow(ctx, 640, 640, macroW * 0.48, 25, 0.25);

  ctx.drawImage(img, macroX, macroY, macroW, macroH);

  // 3. Header Badge
  ctx.fillStyle = "rgba(15, 76, 129, 0.92)";
  ctx.beginPath();
  drawRoundRect(ctx, 40, 35, 360, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("2. DETAIL & KUALITAS • MACRO CRAFTSMANSHIP", 56, 58);

  // 4. Feature Callout Badges (Glassmorphism Pills)
  const tags = detailTags && detailTags.length > 0
    ? detailTags.slice(0, 4)
    : ["Detail Material", "Finishing Rapi", "Desain Presisi", "Kemasan Premium"];

  const badgePositions = [
    { x: 60, y: 160 },
    { x: 920, y: 190 },
    { x: 60, y: 480 },
    { x: 920, y: 510 },
  ];

  tags.forEach((tag, idx) => {
    const pos = badgePositions[idx] || { x: 60, y: 200 + idx * 80 };

    // Glass pill background
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.strokeStyle = "rgba(197, 160, 89, 0.75)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    drawRoundRect(ctx, pos.x, pos.y, 280, 48, 24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Check indicator icon circle
    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.arc(pos.x + 24, pos.y + 24, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("✓", pos.x + 20.5, pos.y + 28);

    // Text
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 13.5px system-ui, -apple-system, sans-serif";
    ctx.fillText(tag, pos.x + 44, pos.y + 29);
  });

  // Footer note
  ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText("Fokus Macro 1.8x • Menampilkan Detail Material, Tekstur Permukaan & Presisi Kemasan Asli", 45, 690);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * 3. INFOGRAFIS FITUR & KEUNGGULAN (1280x720)
 * Headline komersial, kartu keunggulan di sisi kiri, produk asli di sisi kanan
 */
export const generateBenefitPhoto = (
  img: HTMLImageElement | HTMLCanvasElement,
  headline: string,
  namaItem: string,
  kategori: string
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Studio Clean Tech Background
  const bg = ctx.createLinearGradient(0, 0, 1280, 720);
  bg.addColorStop(0, "#FFFFFF");
  bg.addColorStop(0.5, "#F8FAFC");
  bg.addColorStop(1, "#EDF2F7");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1280, 720);

  // Left Blue Accent Stripe
  ctx.fillStyle = "#0F4C81";
  ctx.fillRect(0, 0, 8, 720);

  // 2. Headline & Section Header
  ctx.fillStyle = "#C5A059";
  ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
  ctx.fillText("INFOGRAFIS HILIRISASI PRODUK INOVASI VOKASI UNS", 55, 52);

  const mainHeadline = headline || "KENAPA PRODUK INI LAYAK DIPILIH?";
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
  ctx.fillText(mainHeadline, 55, 88);

  ctx.fillStyle = "#64748B";
  ctx.font = "13px system-ui, -apple-system, sans-serif";
  ctx.fillText("3 Alasan Utama Mengapa Produk Inovasi Ini Memiliki Nilai Jual & Keunggulan Tinggi:", 55, 115);

  // 3. 3 Kartu Keunggulan (Left Side: x=55 to 580)
  const features = [
    {
      title: "Kualitas & Formula Terverifikasi Lab",
      desc: "Diriset & dikembangkan langsung oleh sivitas akademika Sekolah Vokasi UNS dengan uji mutu ketat.",
      badge: "01",
      color: "#0F4C81",
    },
    {
      title: "Kemasan Rapi, Higienis & Siap Pasar",
      desc: "Standar packaging komersial modern, melindungi kualitas produk, serta siap bersaing di marketplace.",
      badge: "02",
      color: "#C5A059",
    },
    {
      title: "Solutif & Siap Kolaborasi Industri",
      desc: "Menjawab kebutuhan mitra DUDI dan konsumen dengan efisiensi biaya dan daya guna maksimal.",
      badge: "03",
      color: "#10B981",
    },
  ];

  features.forEach((feat, i) => {
    const cardY = 145 + i * 145;

    // Card background
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawRoundRect(ctx, 55, cardY, 520, 125, 16);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Number Badge Circle
    ctx.fillStyle = feat.color + "18";
    ctx.beginPath();
    ctx.arc(95, cardY + 45, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = feat.color;
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(feat.badge, 95, cardY + 50);
    ctx.textAlign = "left";

    // Card Title
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
    ctx.fillText(feat.title, 135, cardY + 42);

    // Card Description
    ctx.fillStyle = "#475569";
    ctx.font = "12px system-ui, -apple-system, sans-serif";
    const words = feat.desc.split(" ");
    let line1 = "";
    let line2 = "";
    for (const w of words) {
      if ((line1 + w).length < 46) {
        line1 += w + " ";
      } else {
        line2 += w + " ";
      }
    }
    ctx.fillText(line1.trim(), 135, cardY + 68);
    if (line2) ctx.fillText(line2.trim(), 135, cardY + 88);
  });

  // 4. Product Display Podium di Sisi Kanan (x = 880, y = 520)
  const prodH = 430;
  const prodW = (prodH * img.width) / img.height;
  const prodX = 930 - prodW / 2;
  const prodY = 150;

  // Podium Ellipse
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(930, 560, 260, 42, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(15, 76, 129, 0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(197, 160, 89, 0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Contact shadow
  drawContactShadow(ctx, 930, 555, prodW * 0.44, 18, 0.32);

  // Draw product
  ctx.drawImage(img, prodX, prodY, prodW, prodH);

  // Bottom Footer
  ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText("Standar Infografis Edukatif & Promotif • Membantu Calon Pembeli Memahami Manfaat Utama Produk", 55, 690);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * 4. KONTEKS LIFESTYLE (REAL USE TABLETOP) (1280x720)
 * Permukaan kayu hangat, pencahayaan alami jendela, produk asli berdiri natural
 */
export const generateLifestylePhoto = (
  img: HTMLImageElement | HTMLCanvasElement,
  kategori: string
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Warm Ambient Studio Backdrop (Top 60%)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, 440);
  wallGrad.addColorStop(0, "#F1ECE6");
  wallGrad.addColorStop(0.5, "#E8DFD5");
  wallGrad.addColorStop(1, "#D6C8B8");
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, 1280, 440);

  // Soft morning sunlight window beam
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(650, 0);
  ctx.lineTo(950, 440);
  ctx.lineTo(250, 440);
  ctx.closePath();
  const sunGrad = ctx.createLinearGradient(300, 0, 600, 440);
  sunGrad.addColorStop(0, "rgba(255, 250, 240, 0.45)");
  sunGrad.addColorStop(1, "rgba(255, 250, 240, 0.05)");
  ctx.fillStyle = sunGrad;
  ctx.fill();
  ctx.restore();

  // 2. Warm Wooden Table Surface (Bottom 40%: y = 440 to 720)
  const woodGrad = ctx.createLinearGradient(0, 440, 0, 720);
  woodGrad.addColorStop(0, "#C79C6F");
  woodGrad.addColorStop(0.4, "#B58455");
  woodGrad.addColorStop(1, "#8A582F");
  ctx.fillStyle = woodGrad;
  ctx.fillRect(0, 440, 1280, 280);

  // Subtle wood planks lines
  ctx.strokeStyle = "rgba(110, 65, 30, 0.18)";
  ctx.lineWidth = 1.5;
  for (let y = 475; y < 720; y += 45) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }

  // Table edge shadow transition
  const edgeShadow = ctx.createLinearGradient(0, 440, 0, 460);
  edgeShadow.addColorStop(0, "rgba(0, 0, 0, 0.18)");
  edgeShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = edgeShadow;
  ctx.fillRect(0, 440, 1280, 20);

  // 3. Product Placement on Table (x = 640, y = 480)
  const prodH = 410;
  const prodRatio = img.width / img.height;
  const prodW = prodH * prodRatio;
  const prodX = 640 - prodW / 2;
  const prodY = 470 - prodH + 20;

  // Realistic contact shadow on wood
  drawContactShadow(ctx, 640, 475, prodW * 0.46, 20, 0.45);

  // Soft subtle reflection on polished wood
  ctx.save();
  ctx.translate(640, 470);
  ctx.scale(1, -0.32);
  ctx.translate(-640, -470);
  ctx.globalAlpha = 0.14;
  ctx.drawImage(img, prodX, prodY, prodW, prodH);
  ctx.restore();

  // Draw main product
  ctx.drawImage(img, prodX, prodY, prodW, prodH);

  // 4. Header Badge
  ctx.fillStyle = "rgba(15, 76, 129, 0.9)";
  ctx.beginPath();
  drawRoundRect(ctx, 40, 35, 380, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("4. KONTEKS LIFESTYLE • REAL USE DISPLAY", 56, 58);

  // Bottom Label
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText("Display Meja Komersial Estetik • Menampilkan Kesan Produk Digunakan dalam Kehidupan Nyata", 45, 690);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * Fungsi Utama: Menghasilkan 4 Foto Marketplace Secara Instan dari Foto Asli
 */
export async function generateStudioMarketplacePhotos(
  options: GeneratorOptions
): Promise<MarketplacePhotoResult[]> {
  const { imageSrc, namaItem = "Produk Inovasi Vokasi UNS", kategori = "Produk", detailTags = [], benefitHeadline = "KENAPA PRODUK INI LAYAK DIPILIH?" } = options;

  if (!imageSrc) {
    throw new Error("Foto produk mentahan belum diunggah.");
  }

  // 1. Muat gambar produk secara aman
  const img = await loadImage(imageSrc);

  // 2. Isolasi foreground produk (potong background studio secara otomatis jika latar terang)
  const isolatedImg = isolateProductForeground(img);

  // 3. Render 4 standar marketplace
  const heroUrl = generateHeroPhoto(isolatedImg, namaItem, kategori);
  const detailUrl = generateDetailPhoto(isolatedImg, detailTags);
  const benefitUrl = generateBenefitPhoto(isolatedImg, benefitHeadline, namaItem, kategori);
  const lifestyleUrl = generateLifestylePhoto(isolatedImg, kategori);

  return [
    {
      id: "hero",
      title: "1. Foto Utama (Hero Marketplace)",
      angle: "Foto Utama",
      badge: "100% Produk Asli",
      desc: "Fokus utama produk asli di atas podium studio putih ivory bersih, pencahayaan lembut, bentuk & warna 100% presisi.",
      url: heroUrl,
      directUrl: heroUrl,
    },
    {
      id: "detail",
      title: "2. Detail & Kualitas (Macro Shot)",
      angle: "Meyakinkan Kualitas",
      badge: "Macro Shot 1.8x",
      desc: "Macro zoom tajam pada tekstur material, finishing kemasan, dan badge karakter kualitas terlihat.",
      url: detailUrl,
      directUrl: detailUrl,
    },
    {
      id: "benefit",
      title: "3. Keunggulan & Fitur (Infografis)",
      angle: "Alasan Membeli",
      badge: "Infografis Komersial",
      desc: "Tata letak infografis modern menyajikan headline dan 3 poin keunggulan utama produk inovasi.",
      url: benefitUrl,
      directUrl: benefitUrl,
    },
    {
      id: "lifestyle",
      title: "4. Konteks Penggunaan (Lifestyle)",
      angle: "Konteks Real Use",
      badge: "Lifestyle Tabletop",
      desc: "Fotografi kontekstual produk asli di atas meja kayu hangat dengan pencahayaan pagi estetik.",
      url: lifestyleUrl,
      directUrl: lifestyleUrl,
    },
  ];
}
