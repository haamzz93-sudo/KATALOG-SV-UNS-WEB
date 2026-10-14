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
 * Memuat gambar ke elemen Image HTML
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Gagal memuat gambar produk mentah: " + e));
    img.src = src;
  });
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
  opacity = 0.28
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
  img: HTMLImageElement,
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
  ctx.filter = "blur(18px)";
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
  const prodTargetH = 390;
  const prodRatio = img.width / img.height;
  const prodW = prodTargetH * prodRatio;
  const prodX = 640 - prodW / 2;
  const prodY = podY - prodTargetH + 20;

  drawContactShadow(ctx, 640, podY + 5, prodW * 0.45, 18, 0.35);

  // 4. Gambar Produk Asli
  ctx.drawImage(img, prodX, prodY, prodW, prodTargetH);

  // 5. Header Branding Badge
  ctx.fillStyle = "rgba(15, 76, 129, 0.9)";
  ctx.beginPath();
  ctx.roundRect(40, 35, 340, 34, 17);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("✨ 1. FOTO UTAMA • HERO MARKETPLACE", 58, 57);

  // Category Tag Top Right
  if (kategori) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.strokeStyle = "rgba(197, 160, 89, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(1020, 35, 220, 34, 17);
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
 * Macro zoom 1.7x pada produk asli, overlay tag karakter kualitas
 */
export const generateDetailPhoto = (
  img: HTMLImageElement,
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
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(640, 640, macroW * 0.48, 25, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(15, 23, 42, 0.16)";
  ctx.filter = "blur(14px)";
  ctx.fill();
  ctx.restore();

  ctx.drawImage(img, macroX, macroY, macroW, macroH);

  // 3. Header Badge
  ctx.fillStyle = "rgba(15, 76, 129, 0.92)";
  ctx.beginPath();
  ctx.roundRect(40, 35, 360, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("🔍 2. DETAIL & KUALITAS • MACRO CRAFTSMANSHIP", 56, 58);

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
    const text = `✦ ${tag}`;

    // Glass pill background
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.strokeStyle = "rgba(197, 160, 89, 0.75)";
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "rgba(15, 23, 42, 0.12)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, 280, 48, 24);
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
  img: HTMLImageElement,
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
      icon: "🔬",
      color: "#0F4C81",
    },
    {
      title: "Kemasan Rapi, Higienis & Siap Pasar",
      desc: "Standar packaging komersial modern, melindungi kualitas produk, serta siap bersaing di marketplace.",
      icon: "📦",
      color: "#C5A059",
    },
    {
      title: "Solutif & Siap Kolaborasi Industri",
      desc: "Menjawab kebutuhan mitra DUDI dan konsumen dengan efisiensi biaya dan daya guna maksimal.",
      icon: "🤝",
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
    ctx.shadowColor = "rgba(15, 23, 42, 0.05)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.roundRect(55, cardY, 520, 125, 16);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Icon Circle
    ctx.fillStyle = feat.color + "18";
    ctx.beginPath();
    ctx.arc(95, cardY + 45, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(feat.icon, 95, cardY + 52);
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
  img: HTMLImageElement,
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
  const prodW = (prodH * img.width) / img.height;
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
  ctx.roundRect(40, 35, 380, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.fillText("☕ 4. KONTEKS LIFESTYLE • REAL USE DISPLAY", 56, 58);

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

  const img = await loadImage(imageSrc);

  const heroUrl = generateHeroPhoto(img, namaItem, kategori);
  const detailUrl = generateDetailPhoto(img, detailTags);
  const benefitUrl = generateBenefitPhoto(img, benefitHeadline, namaItem, kategori);
  const lifestyleUrl = generateLifestylePhoto(img, kategori);

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
