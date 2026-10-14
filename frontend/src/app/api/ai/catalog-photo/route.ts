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
      rawImageBase64,
      customPrompt,
      domain = "spsbu.unsmadiun.id"
    } = body;

    const activeKey = (apiKey && apiKey.trim()) || DEFAULT_GEMINI_API_KEY;

    // 1. Konsultasi / Pembuatan 4 Prompt Presisi via Gemini 2.5 Flash
    let geminiEnhancedPrompt: any = null;
    if (activeKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;
        
        const systemInstruction = `You are a World-Class Commercial Product Photographer and AI Creative Director specializing in high-converting marketplace visual assets (Domain: ${domain}).
You are analyzing a product named "${namaItem}"${tagline ? ` with tagline "${tagline}"` : ""} categorized under "${kategori}".

Generate 4 specialized commercial photography prompts in ENGLISH for a 4-photo marketplace product listing:

1. hero_prompt (Foto Utama Marketplace):
- Eye-level commercial hero photography on a minimalist clean ivory/white studio podium or surface.
- Soft balanced studio rim lighting, crisp focal point, elegant soft shadows.
- Strictly preserve original colors, logo, shape, proportions, and brand identity.

2. detail_prompt (Detail & Kualitas):
- Editorial macro close-up shot showcasing tactile texture, premium materials, craftsmanship, precise finishing, neat seams, and packaging details.
- Shallow depth of field, sharp macro lens focus.

3. benefit_prompt (Infografis Fitur & Alasan Membeli):
- Modern clean commercial product infographic layout with universal headline 'KENAPA PRODUK INI LAYAK DIPILIH?' or 'WHY YOU'LL LOVE IT'.
- Highlighting 3-5 core functional benefits with subtle minimalist aesthetic badges or graphic pointers around the product.

4. lifestyle_prompt (Konteks Penggunaan Nyata):
- Authentic contextual photography showing the product in genuine real-world usage suited to ${kategori} (e.g., appetizing food serving, wellness desk setup for herbal, modern office/tech workbench for engineering/IoT).
- Warm natural inviting light, aspirational commercial atmosphere.

CONSISTENT VISUAL IDENTITY: All 4 images must portray the exact same product model, identical colors, branding, scale, and lighting aesthetic.
Format your response as a strict JSON object with NO extra markdown or text:
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
      hero: geminiEnhancedPrompt?.hero_prompt || `Eye-level commercial hero product photography of ${baseSubject}, centered on clean minimalist ivory podium, soft studio lighting, crisp focus, clean white background`,
      detail: geminiEnhancedPrompt?.detail_prompt || `Editorial macro close-up photography of ${baseSubject}, capturing fine material craftsmanship, tactile surface textures, precision finishing and premium packaging details, soft studio light, shallow depth of field`,
      benefit: geminiEnhancedPrompt?.benefit_prompt || `Modern aesthetic commercial infographic presentation of ${baseSubject}, showcasing key product benefits and reasons to buy with clean minimalist layout, soft lighting, premium marketplace catalog display`,
      lifestyle: geminiEnhancedPrompt?.lifestyle_prompt || `Authentic lifestyle product photography of ${baseSubject}, in natural real-world use environment, warm ambient morning light, commercial catalog aesthetic, high quality depth of field`,
    };

    // 3. Generate 4 Foto Dinamis HD Landscape (1280x720) via Turbo Model (No Paywall)
    const seedBase = Date.now();
    const photos = [
      {
        id: "hero",
        title: "1. Foto Utama (Hero Marketplace)",
        angle: "Foto Utama",
        badge: "Hero Product",
        desc: "Fokus utama, background bersih (putih/ivory), pencahayaan studio lembut, identitas logo & warna presisi.",
        prompt: prompts.hero,
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.hero)}?width=1280&height=720&seed=${seedBase + 1}&model=turbo&nologo=true`,
      },
      {
        id: "detail",
        title: "2. Detail & Kualitas (Macro Shot)",
        angle: "Meyakinkan Kualitas",
        badge: "Detail & Quality",
        desc: "Macro shot tekstur, material, kerapian finishing & kemasan untuk meyakinkan calon pembeli/mitra.",
        prompt: prompts.detail,
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.detail)}?width=1280&height=720&seed=${seedBase + 2}&model=turbo&nologo=true`,
      },
      {
        id: "benefit",
        title: "3. Keunggulan & Fitur (Infografis)",
        angle: "Alasan Membeli",
        badge: "Key Features",
        desc: "Tampilan infografis modern menyajikan poin keunggulan dan alasan mengapa produk ini layak dipilih.",
        prompt: prompts.benefit,
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.benefit)}?width=1280&height=720&seed=${seedBase + 3}&model=turbo&nologo=true`,
      },
      {
        id: "lifestyle",
        title: "4. Konteks Penggunaan (Lifestyle)",
        angle: "Konteks Real Use",
        badge: "Real Context",
        desc: "Fotografi kontekstual penggunaan nyata produk sesuai kategori (meja kerja, lab, konsumsi, atau aktivitas sehari-hari).",
        prompt: prompts.lifestyle,
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.lifestyle)}?width=1280&height=720&seed=${seedBase + 4}&model=turbo&nologo=true`,
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
