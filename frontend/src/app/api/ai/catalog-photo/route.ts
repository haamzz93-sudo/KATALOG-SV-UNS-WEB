import { NextRequest, NextResponse } from "next/server";

const DEFAULT_GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      apiKey = DEFAULT_GEMINI_API_KEY,
      jenis = "produk",
      subJenis = "Makanan",
      rawImageBase64,
      customPrompt,
      namaItem = "Produk Inovasi Vokasi",
      domain = "katalog.unsmadiun.id"
    } = body;

    const activeKey = (apiKey && apiKey.trim()) || DEFAULT_GEMINI_API_KEY;

    // 1. Konsultasi / Pembuatan Prompt Presisi via Gemini 2.5 Flash
    let geminiEnhancedPrompt = "";
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;
      
      const systemInstruction = `Kamu adalah AI Creative Director spesialis fotografi komersial marketplace profesional untuk Sekolah Vokasi UNS (Domain: ${domain}).
Tugasmu adalah menganalisis nama produk "${namaItem}", jenis "${jenis}", dan sub-jenis "${subJenis}", lalu buatkan 3 deskripsi visual fotografi produk dalam Bahasa Inggris yang sangat fotorealistis, studio lighting, clean background, 8k resolution, landscape aspect ratio 16:9, layak jual di marketplace premium.
Format respon HANYA berupa JSON valid dengan struktur:
{
  "front_prompt": "...",
  "side_prompt": "...",
  "display_prompt": "..."
}`;

      const contents: any[] = [{
        parts: [
          { text: systemInstruction + `\n\nInstruksi Pengguna: ${customPrompt || "Buat foto produk studio clean tanpa teks berlebihan"}` }
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
          const parsed = JSON.parse(jsonMatch[0]);
          geminiEnhancedPrompt = parsed;
        }
      }
    } catch (err) {
      console.warn("Gemini prompt enhancement notice:", err);
    }

    // 2. Susun 3 Prompt Fotografi Multi-Sudut (Tampak Depan, Tampak Samping, Display Marketplace)
    const baseSubject = `${subJenis} ${jenis} named "${namaItem}", high quality product photography, commercial marketplace display for ${domain}, clean studio lighting, 8k resolution, photorealistic, sharp focus, 16:9 landscape aspect ratio, no heavy typography, aesthetic modern catalog showcase`;

    const prompts = {
      tampak_depan: (geminiEnhancedPrompt as any)?.front_prompt || `Straight-on eye-level front view of ${baseSubject}, white and soft grey minimal studio podium background`,
      tampak_samping: (geminiEnhancedPrompt as any)?.side_prompt || `45-degree isometric side view of ${baseSubject}, showing depth and fine details, soft studio shadow, professional commercial product angle`,
      tampak_display: (geminiEnhancedPrompt as any)?.display_prompt || `Dynamic aesthetic marketplace lifestyle hero display of ${baseSubject}, modern presentation setup, premium commercial showcase`,
    };

    // 3. Generate 3 Foto Dinamis HD Landscape (1280x720) via Turbo Model (No Paywall)
    const seedBase = Date.now();
    const photos = [
      {
        id: "front",
        title: "Tampak Depan (Front View)",
        angle: "Sudut Depan Presisi",
        prompt: prompts.tampak_depan,
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.tampak_depan)}?width=1280&height=720&seed=${seedBase + 1}&model=turbo&nologo=true`,
      },
      {
        id: "side",
        title: "Tampak Samping (Isometric / Side Angle)",
        angle: "Sudut Samping 45°",
        prompt: prompts.tampak_samping,
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.tampak_samping)}?width=1280&height=720&seed=${seedBase + 2}&model=turbo&nologo=true`,
      },
      {
        id: "display",
        title: "Display Marketplace (Hero Showcase)",
        angle: "Display Komersial HD",
        prompt: prompts.tampak_display,
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.tampak_display)}?width=1280&height=720&seed=${seedBase + 3}&model=turbo&nologo=true`,
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        domain,
        jenis,
        subJenis,
        photos,
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
