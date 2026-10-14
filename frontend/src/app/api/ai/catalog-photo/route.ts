import { NextRequest, NextResponse } from "next/server";

const DEFAULT_GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      apiKey = DEFAULT_GEMINI_API_KEY,
      namaItem = "Produk Inovasi Vokasi UNS",
      tagline = "",
      kategori = "PRODUK MAKANAN",
      detailLabels = "Detail Material, Finishing Rapi, Desain Presisi",
      benefitHeadline = "KENAPA PRODUK INI LAYAK DIPILIH?",
      rawImageBase64,
      customPrompt,
      templateHero,
      templateDetail,
      templateBenefit,
      templateLifestyle,
      templateConsistency,
      domain = "spsbu.unsmadiun.id"
    } = body;

    const activeKey = (apiKey && apiKey.trim()) || DEFAULT_GEMINI_API_KEY;

    const labelsString = Array.isArray(detailLabels) ? detailLabels.join(", ") : detailLabels;

    // 1. Konsultasi / Pembuatan 4 Prompt Presisi via Gemini 2.5 Flash
    let geminiEnhancedPrompt: any = null;
    if (activeKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;
        
        const systemInstruction = `You are a World-Class Commercial Product Photographer and AI Creative Director specializing in high-converting marketplace visual assets (Domain: ${domain}).
You are analyzing a product named "${namaItem}"${tagline ? ` with tagline "${tagline}"` : ""} categorized under "${kategori}".
Verified quality characters to feature on details: ${labelsString}.
Infographic headline to feature: "${benefitHeadline}".

=== STRICT GUIDELINES FROM USER SPECIFICATION ===
MASTER CONSISTENCY RULE:
${templateConsistency || "Gunakan satu visual identity yang konsisten untuk seluruh 4 foto. Pertahankan warna produk yang sama, tone lighting seragam, proporsi produk konsisten, dan kualitas fotografi setara katalog brand profesional. Jangan mengubah logo, label, teks, bentuk, warna, material, jumlah item, atau fitur produk dari referensi asli."}

PROMPT 1 (Hero Product / Foto Utama Marketplace):
${templateHero || "Gunakan foto produk yang diberikan sebagai referensi utama. Identifikasi otomatis jenis produk, bentuk, warna, material, label, kemasan, logo, tulisan, serta karakter visualnya. Buat foto produk marketplace premium dengan komposisi hero product photography."}

PROMPT 2 (Detail & Quality / Meyakinkan Kualitas):
${templateDetail || "Gunakan produk yang sama sebagai referensi utama. Buat foto kedua yang fokus pada detail kualitas dan craftsmanship produk. Tampilkan 3–5 close-up detail dalam layout editorial modern."}

PROMPT 3 (Benefit & Key Features / Alasan Membeli):
${templateBenefit || "Gunakan produk asli sebagai fokus utama. Buat foto ketiga dalam format modern benefit infographic yang menjelaskan alasan utama calon pembeli memilih produk. Tampilkan headline: " + benefitHeadline}

PROMPT 4 (Lifestyle / Real Use Context):
${templateLifestyle || "Gunakan produk asli sebagai referensi dan pertahankan desainnya secara akurat. Buat foto lifestyle profesional yang menunjukkan produk digunakan dalam konteks nyata sesuai kategorinya."}

CRITICAL: Generate 4 specialized, detailed English photography prompts for an image generator (16:9 landscape aspect ratio, 8k resolution, photorealistic commercial photoshoot). Return strictly a JSON object with this exact schema:
{
  "hero_prompt": "...",
  "detail_prompt": "...",
  "benefit_prompt": "...",
  "lifestyle_prompt": "..."
}`;

        const contents: any[] = [{
          parts: [
            { text: systemInstruction + `\n\nInstruksi Pengguna Tambahan: ${customPrompt || "Jaga agar produk tampak tajam, profesional, layak jual, konsisten di seluruh 4 foto"}` }
          ]
        }];

        if (rawImageBase64 && rawImageBase64.startsWith("data:")) {
          const [meta, base64Data] = rawImageBase64.split(";base64,");
          const mimeType = meta.replace("data:", "");
          contents[0].parts.push({
            inlineData: {
              mimeType,
              data: base64Data
            }
          });
        }

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const textOut = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const jsonMatch = textOut.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            geminiEnhancedPrompt = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (err) {
        console.warn("Gemini prompt enhancement notice:", err);
      }
    }

    // 2. Susun 4 Prompt Fotografi Marketplace
    const baseSubject = `${kategori} named "${namaItem}", high quality commercial product photography for ${domain}, clean studio lighting, 8k resolution, photorealistic, sharp focus, 16:9 landscape aspect ratio, premium marketplace catalog showcase`;

    const prompts = {
      hero: geminiEnhancedPrompt?.hero_prompt || `Eye-level commercial hero product photography of ${baseSubject}, centered on clean minimalist ivory podium, soft studio lighting, crisp focus, clean white and light grey background, photorealistic 8k`,
      detail: geminiEnhancedPrompt?.detail_prompt || `Editorial macro close-up photography of ${baseSubject}, capturing fine material craftsmanship, tactile surface textures, ${labelsString}, precision finishing and premium packaging details, soft studio light, shallow depth of field, 8k`,
      benefit: geminiEnhancedPrompt?.benefit_prompt || `Modern aesthetic commercial infographic presentation of ${baseSubject}, featuring headline '${benefitHeadline}', showcasing key product benefits and reasons to buy with clean minimalist layout, soft lighting, premium marketplace catalog display, 8k`,
      lifestyle: geminiEnhancedPrompt?.lifestyle_prompt || `Authentic lifestyle product photography of ${baseSubject}, in natural real-world use environment for ${kategori}, warm ambient morning light, commercial catalog aesthetic, high quality depth of field, 8k`,
    };

    // 3. Generate 4 Foto Dinamis HD Landscape (1280x720) via Proxy (Bypasses 402 Referer Paywall)
    const seedBase = Date.now();
    const photos = [
      {
        id: "hero",
        title: "1. Foto Utama (Hero Marketplace)",
        angle: "Foto Utama",
        badge: "Hero Product",
        desc: "Fokus utama, background bersih (putih/ivory), pencahayaan studio lembut, identitas logo & warna presisi.",
        prompt: prompts.hero,
        url: `/api/v1/public/ai/image-proxy?prompt=${encodeURIComponent(prompts.hero)}&seed=${seedBase + 1}&width=1280&height=720`,
        directUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.hero)}?width=1280&height=720&seed=${seedBase + 1}&model=turbo&nologo=true`,
      },
      {
        id: "detail",
        title: "2. Detail & Kualitas (Macro Shot)",
        angle: "Meyakinkan Kualitas",
        badge: "Detail & Quality",
        desc: "Macro shot tekstur, material, kerapian finishing & kemasan untuk meyakinkan calon pembeli/mitra.",
        prompt: prompts.detail,
        url: `/api/v1/public/ai/image-proxy?prompt=${encodeURIComponent(prompts.detail)}&seed=${seedBase + 2}&width=1280&height=720`,
        directUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.detail)}?width=1280&height=720&seed=${seedBase + 2}&model=turbo&nologo=true`,
      },
      {
        id: "benefit",
        title: "3. Keunggulan & Fitur (Infografis)",
        angle: "Alasan Membeli",
        badge: "Key Features",
        desc: "Tampilan infografis modern menyajikan poin keunggulan dan alasan mengapa produk ini layak dipilih.",
        prompt: prompts.benefit,
        url: `/api/v1/public/ai/image-proxy?prompt=${encodeURIComponent(prompts.benefit)}&seed=${seedBase + 3}&width=1280&height=720`,
        directUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.benefit)}?width=1280&height=720&seed=${seedBase + 3}&model=turbo&nologo=true`,
      },
      {
        id: "lifestyle",
        title: "4. Konteks Penggunaan (Lifestyle)",
        angle: "Konteks Real Use",
        badge: "Real Context",
        desc: "Fotografi kontekstual penggunaan nyata produk sesuai kategori (meja kerja, lab, konsumsi, atau aktivitas sehari-hari).",
        prompt: prompts.lifestyle,
        url: `/api/v1/public/ai/image-proxy?prompt=${encodeURIComponent(prompts.lifestyle)}&seed=${seedBase + 4}&width=1280&height=720`,
        directUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.lifestyle)}?width=1280&height=720&seed=${seedBase + 4}&model=turbo&nologo=true`,
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        domain,
        namaItem,
        tagline,
        kategori,
        photos,
        usedGemini: !!geminiEnhancedPrompt,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("AI photo generation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memproses foto AI" },
      { status: 500 }
    );
  }
}
