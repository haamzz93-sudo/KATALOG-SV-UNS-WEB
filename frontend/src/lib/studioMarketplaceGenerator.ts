/**
 * Studio Marketplace Photo Generator (Format Portrait 3:4 - 960x1280 HD)
 * Membangun 4 foto standar marketplace komersial berformat vertikal 3:4
 * (standar e-commerce Shopee, Tokopedia, Instagram & Amazon) langsung dari
 * foto produk asli yang diunggah pengguna.
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
        if (alpha > 14) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          found = true;
        }
      }
    }

    if (!found || minX >= maxX || minY >= maxY) return canvas;

    const pad = 6;
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
 * Isolasi Foreground Produk (Smart Background Removal / Studio Isolation)
 * Menggunakan algoritma BFS Flood-Fill dari tepi border gambar untuk memotong
 * background studio/meja berwarna terang secara presisi tanpa merusak detail
 * logo, warna, atau teks di dalam produk fisik.
 */
export const isolateProductForeground = (
  sourceImg: HTMLImageElement | HTMLCanvasElement,
  tolerance = 36
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const w = sourceImg.width;
  const h = sourceImg.height;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.drawImage(sourceImg, 0, 0);

  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

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

    const brightness = (avgBgR + avgBgG + avgBgB) / 3;
    if (brightness < 105) {
      return trimTransparentBorders(canvas);
    }

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

    for (let x = 0; x < w; x++) {
      enqueue(x, 0);
      enqueue(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      enqueue(0, y);
      enqueue(w - 1, y);
    }

    while (head < tail) {
      const curr = queue[head++];
      const cx = curr % w;
      const cy = Math.floor(curr / w);

      if (cx > 0) enqueue(cx - 1, cy);
      if (cx < w - 1) enqueue(cx + 1, cy);
      if (cy > 0) enqueue(cx, cy - 1);
      if (cy < h - 1) enqueue(cx, cy + 1);
    }

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
 * Menggambar bayangan kontak elips realistis di bawah produk
 */
const drawContactShadow = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  opacity = 0.36
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
 * 1. FOTO UTAMA / HERO PRODUCT (FORMAT PORTRAIT 3:4 - 960x1280)
 * Center focal point, podium ivory 3D, studio spotlight
 */
export const generateHeroPhoto = (
  img: HTMLImageElement | HTMLCanvasElement,
  namaItem: string,
  kategori: string
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Studio Backdrop (Clean Vertical Gradient)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1280);
  bgGrad.addColorStop(0, "#F8FAFC");
  bgGrad.addColorStop(0.65, "#EDF2F7");
  bgGrad.addColorStop(1, "#E2E8F0");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 960, 1280);

  // Soft Radial Spotlight
  const spotGrad = ctx.createRadialGradient(480, 520, 60, 480, 520, 620);
  spotGrad.addColorStop(0, "rgba(255, 255, 255, 0.96)");
  spotGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.35)");
  spotGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, 960, 1280);

  // 2. Podium Minimalis Putih / Ivory (3D Cylindrical Pedestal)
  const podX = 480;
  const podY = 960;
  const podRx = 380;
  const podRy = 65;
  const podH = 80;

  // Podium Drop Shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(podX, podY + podH + 12, podRx + 25, podRy + 15, 0, 0, Math.PI * 2);
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
  ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. Product Contact Shadow on Podium
  const prodTargetH = 740;
  const prodRatio = img.width / img.height;
  const prodW = prodTargetH * prodRatio;
  const prodX = 480 - prodW / 2;
  const prodY = podY - prodTargetH + 18;

  drawContactShadow(ctx, 480, podY + 5, prodW * 0.46, 22, 0.38);

  // 4. Gambar Produk Asli
  ctx.drawImage(img, prodX, prodY, prodW, prodTargetH);

  // 5. Header Branding Badge
  ctx.fillStyle = "rgba(15, 76, 129, 0.92)";
  ctx.beginPath();
  drawRoundRect(ctx, 40, 40, 360, 42, 21);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("1. FOTO UTAMA • HERO MARKETPLACE", 60, 66);

  // Category Tag Top Right
  if (kategori) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.strokeStyle = "rgba(197, 160, 89, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawRoundRect(ctx, 680, 40, 240, 42, 21);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0F4C81";
    ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${kategori}`, 800, 66);
    ctx.textAlign = "left";
  }

  // Bottom Label
  ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.fillText("Standar Foto Marketplace Komersial (3:4) • 100% Keaslian Identitas & Warna Terjaga", 45, 1240);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * 2. DETAIL & QUALITY (MACRO SHOT) (FORMAT PORTRAIT 3:4 - 960x1280)
 * Macro zoom 1.85x pada produk asli, overlay tag karakter kualitas
 */
export const generateDetailPhoto = (
  img: HTMLImageElement | HTMLCanvasElement,
  detailTags: string[]
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Studio Editorial Background
  const bg = ctx.createLinearGradient(0, 0, 960, 1280);
  bg.addColorStop(0, "#F1F5F9");
  bg.addColorStop(0.5, "#E2E8F0");
  bg.addColorStop(1, "#CBD5E1");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 960, 1280);

  // Diagonal Light Accent
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(600, 0);
  ctx.lineTo(360, 1280);
  ctx.lineTo(0, 1280);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fill();
  ctx.restore();

  // 2. Macro Zoom pada Produk Asli (Scale 1.85x)
  const macroH = 1000;
  const macroW = (macroH * img.width) / img.height;
  const macroX = 480 - macroW / 2;
  const macroY = 140;

  // Shadow belakang produk
  drawContactShadow(ctx, 480, 1140, macroW * 0.48, 35, 0.28);

  ctx.drawImage(img, macroX, macroY, macroW, macroH);

  // 3. Header Badge
  ctx.fillStyle = "rgba(15, 76, 129, 0.92)";
  ctx.beginPath();
  drawRoundRect(ctx, 40, 40, 390, 42, 21);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("2. DETAIL & KUALITAS • MACRO CRAFTSMANSHIP", 58, 66);

  // 4. Feature Callout Badges (Glassmorphism Pills)
  const tags = detailTags && detailTags.length > 0
    ? detailTags.slice(0, 4)
    : ["Detail Material", "Finishing Rapi", "Desain Presisi", "Kemasan Premium"];

  const badgePositions = [
    { x: 50, y: 130 },
    { x: 560, y: 130 },
    { x: 50, y: 1060 },
    { x: 560, y: 1060 },
  ];

  tags.forEach((tag, idx) => {
    const pos = badgePositions[idx] || { x: 50, y: 200 + idx * 80 };

    // Glass pill background
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.strokeStyle = "rgba(197, 160, 89, 0.8)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    drawRoundRect(ctx, pos.x, pos.y, 350, 52, 26);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Check indicator icon circle
    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.arc(pos.x + 28, pos.y + 26, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillText("✓", pos.x + 23.5, pos.y + 31);

    // Text
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
    ctx.fillText(tag, pos.x + 50, pos.y + 31);
  });

  // Footer note
  ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("Fokus Macro 1.8x • Menampilkan Detail Material, Tekstur Permukaan & Presisi Kemasan Asli", 45, 1240);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * 3. INFOGRAFIS FITUR & KEUNGGULAN (FORMAT PORTRAIT 3:4 - 960x1280)
 * Headline komersial, display produk di tengah, 3 kartu keunggulan di bawah
 */
export const generateBenefitPhoto = (
  img: HTMLImageElement | HTMLCanvasElement,
  headline: string,
  namaItem: string,
  kategori: string
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Studio Clean Tech Background
  const bg = ctx.createLinearGradient(0, 0, 960, 1280);
  bg.addColorStop(0, "#FFFFFF");
  bg.addColorStop(0.5, "#F8FAFC");
  bg.addColorStop(1, "#EDF2F7");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 960, 1280);

  // Left Blue Accent Stripe
  ctx.fillStyle = "#0F4C81";
  ctx.fillRect(0, 0, 10, 1280);

  // 2. Headline & Section Header (Top)
  ctx.fillStyle = "#C5A059";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("INFOGRAFIS HILIRISASI PRODUK INOVASI VOKASI UNS", 50, 56);

  const mainHeadline = headline || "KENAPA PRODUK INI LAYAK DIPILIH?";
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillText(mainHeadline, 50, 96);

  ctx.fillStyle = "#64748B";
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillText("3 Alasan Utama Mengapa Produk Inovasi Ini Memiliki Nilai Jual & Mutu Tinggi:", 50, 126);

  // 3. Product Display in Showcase Frame (y = 150 to 650)
  const prodH = 460;
  const prodW = (prodH * img.width) / img.height;
  const prodX = 480 - prodW / 2;
  const prodY = 160;

  // Podium Ellipse
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(480, 620, 280, 40, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(15, 76, 129, 0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(197, 160, 89, 0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Contact shadow
  drawContactShadow(ctx, 480, 615, prodW * 0.44, 20, 0.35);

  // Draw product
  ctx.drawImage(img, prodX, prodY, prodW, prodH);

  // 4. 3 Kartu Keunggulan (Stacked Vertically at Bottom: y = 670 to 1190)
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
    const cardY = 670 + i * 165;

    // Card background
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drawRoundRect(ctx, 50, cardY, 860, 140, 20);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Number Badge Circle
    ctx.fillStyle = feat.color + "18";
    ctx.beginPath();
    ctx.arc(105, cardY + 50, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = feat.color;
    ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(feat.badge, 105, cardY + 57);
    ctx.textAlign = "left";

    // Card Title
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 17px system-ui, -apple-system, sans-serif";
    ctx.fillText(feat.title, 155, cardY + 48);

    // Card Description
    ctx.fillStyle = "#475569";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    const words = feat.desc.split(" ");
    let line1 = "";
    let line2 = "";
    for (const w of words) {
      if ((line1 + w).length < 65) {
        line1 += w + " ";
      } else {
        line2 += w + " ";
      }
    }
    ctx.fillText(line1.trim(), 155, cardY + 78);
    if (line2) ctx.fillText(line2.trim(), 155, cardY + 102);
  });

  // Bottom Footer
  ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("Standar Infografis Edukatif & Promotif • Membantu Calon Pembeli Memahami Manfaat Utama Produk", 50, 1240);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * 4. KONTEKS LIFESTYLE (REAL USE TABLETOP) (FORMAT PORTRAIT 3:4 - 960x1280)
 * Permukaan meja kayu hangat, pencahayaan alami jendela, produk asli berdiri natural
 */
export const generateLifestylePhoto = (
  img: HTMLImageElement | HTMLCanvasElement,
  kategori: string
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Warm Ambient Studio Backdrop (Top 55%: y = 0 to 700)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, 700);
  wallGrad.addColorStop(0, "#F1ECE6");
  wallGrad.addColorStop(0.5, "#E8DFD5");
  wallGrad.addColorStop(1, "#D6C8B8");
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, 960, 700);

  // Soft morning sunlight window beam
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(500, 0);
  ctx.lineTo(720, 700);
  ctx.lineTo(180, 700);
  ctx.closePath();
  const sunGrad = ctx.createLinearGradient(200, 0, 450, 700);
  sunGrad.addColorStop(0, "rgba(255, 250, 240, 0.45)");
  sunGrad.addColorStop(1, "rgba(255, 250, 240, 0.05)");
  ctx.fillStyle = sunGrad;
  ctx.fill();
  ctx.restore();

  // 2. Warm Wooden Table Surface (Bottom 45%: y = 700 to 1280)
  const woodGrad = ctx.createLinearGradient(0, 700, 0, 1280);
  woodGrad.addColorStop(0, "#C79C6F");
  woodGrad.addColorStop(0.4, "#B58455");
  woodGrad.addColorStop(1, "#8A582F");
  ctx.fillStyle = woodGrad;
  ctx.fillRect(0, 700, 960, 580);

  // Subtle wood planks lines
  ctx.strokeStyle = "rgba(110, 65, 30, 0.18)";
  ctx.lineWidth = 1.5;
  for (let y = 745; y < 1280; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(960, y);
    ctx.stroke();
  }

  // Table edge shadow transition
  const edgeShadow = ctx.createLinearGradient(0, 700, 0, 725);
  edgeShadow.addColorStop(0, "rgba(0, 0, 0, 0.18)");
  edgeShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = edgeShadow;
  ctx.fillRect(0, 700, 960, 25);

  // 3. Product Placement on Table (x = 480, y = 720)
  const prodH = 680;
  const prodRatio = img.width / img.height;
  const prodW = prodH * prodRatio;
  const prodX = 480 - prodW / 2;
  const prodY = 720 - prodH + 20;

  // Realistic contact shadow on wood
  drawContactShadow(ctx, 480, 725, prodW * 0.46, 24, 0.45);

  // Soft subtle reflection on polished wood
  ctx.save();
  ctx.translate(480, 720);
  ctx.scale(1, -0.32);
  ctx.translate(-480, -720);
  ctx.globalAlpha = 0.14;
  ctx.drawImage(img, prodX, prodY, prodW, prodH);
  ctx.restore();

  // Draw main product
  ctx.drawImage(img, prodX, prodY, prodW, prodH);

  // 4. Header Badge
  ctx.fillStyle = "rgba(15, 76, 129, 0.9)";
  ctx.beginPath();
  drawRoundRect(ctx, 40, 40, 390, 42, 21);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("4. KONTEKS LIFESTYLE • REAL USE DISPLAY", 58, 66);

  // Bottom Label
  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("Display Meja Komersial Estetik (3:4) • Menampilkan Kesan Produk Digunakan dalam Kehidupan Nyata", 45, 1240);

  return canvas.toDataURL("image/jpeg", 0.92);
};

/**
 * Fungsi Utama: Menghasilkan 4 Foto Marketplace Secara Instan dari Foto Asli (Format 3:4)
 */
export async function generateStudioMarketplacePhotos(
  options: GeneratorOptions
): Promise<MarketplacePhotoResult[]> {
  const { imageSrc, namaItem = "Produk Inovasi Vokasi UNS", kategori = "PRODUK", detailTags = [], benefitHeadline = "KENAPA PRODUK INI LAYAK DIPILIH?" } = options;

  if (!imageSrc) {
    throw new Error("Foto produk mentahan belum diunggah.");
  }

  // 1. Muat gambar produk secara aman
  const img = await loadImage(imageSrc);

  // 2. Isolasi foreground produk (potong background studio secara otomatis jika latar terang)
  const isolatedImg = isolateProductForeground(img);

  // 3. Render 4 standar marketplace portrait 3:4 (960x1280 HD)
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
      desc: "Fokus utama produk asli di atas podium studio putih ivory bersih, pencahayaan lembut, proporsi portrait 3:4 rapi.",
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
      desc: "Tata letak infografis portrait menyajikan headline dan 3 poin keunggulan utama produk inovasi.",
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
