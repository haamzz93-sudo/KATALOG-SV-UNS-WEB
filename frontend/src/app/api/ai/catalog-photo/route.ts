import { NextRequest, NextResponse } from "next/server";

const DEFAULT_GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const DEFAULT_OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      apiKey = DEFAULT_GEMINI_API_KEY,
      openaiApiKey,
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

    const activeGeminiKey = (apiKey && apiKey.trim()) || DEFAULT_GEMINI_API_KEY;
    const activeOpenAiKey = (openaiApiKey && openaiApiKey.trim()) || DEFAULT_OPENAI_API_KEY;

    const labelsString = Array.isArray(detailLabels) ? detailLabels.join(", ") : detailLabels;

    // 1. Konsultasi / Pembuatan 4 Prompt Presisi via Gemini 2.5 Flash
    let geminiEnhancedPrompt: any = null;
    if (activeGeminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeGeminiKey}`;
        
        const systemInstruction = `You are a World-Class Commercial Product Photographer and AI Creative Director specializing in high-converting marketplace visual assets (Domain: ${domain}).
You are analyzing a product named "${namaItem}"${tagline ? ` with tagline "${tagline}"` : ""} categorized under "${kategori}".
Verified quality characters to feature on details: ${labelsString}.
Infographic headline to feature: "${benefitHeadline}".

=== STRICT GUIDELINES FROM USER SPECIFICATION ===
MASTER CONSISTENCY RULE:
${templateConsistency || "Gunakan satu visual identity yang konsisten untuk seluruh 4 foto. Pertahankan warna produk yang sama, tone lighting seragam, proporsi produk konsisten, dan kualitas fotografi setara katalog brand profesional."}

PROMPT 1 (Hero Product / Foto Utama Marketplace):
${templateHero || "Buat foto produk marketplace premium dengan komposisi hero product photography."}

PROMPT 2 (Detail & Quality):
${templateDetail || "Buat foto kedua yang fokus pada detail kualitas dan craftsmanship produk."}

PROMPT 3 (Benefit & Key Features):
${templateBenefit || "Buat foto ketiga dalam format modern benefit infographic. Tampilkan headline: " + benefitHeadline}

PROMPT 4 (Lifestyle / Real Use Context):
${templateLifestyle || "Buat foto lifestyle profesional yang menunjukkan produk digunakan dalam konteks nyata."}

CRITICAL: Generate 4 specialized, detailed English photography prompts for an image generator (3:4 portrait aspect ratio, 960x1280 resolution, photorealistic commercial photoshoot). Return strictly a JSON object:
{
  "hero_prompt": "...",
  "detail_prompt": "...",
  "benefit_prompt": "...",
  "lifestyle_prompt": "..."
}`;

        const contents: any[] = [{
          parts: [
            { text: systemInstruction + `\n\nExtra instruction: ${customPrompt || "Keep product sharp, professional, consistent across all 4 photos."}` }
          ]
        }];

        if (rawImageBase64 && rawImageBase64.startsWith("data:")) {
          const [meta, base64Data] = rawImageBase64.split(";base64,");
          const mimeType = meta.replace("data:", "");
          contents[0].parts.push({ inlineData: { mimeType, data: base64Data } });
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
          if (jsonMatch) geminiEnhancedPrompt = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn("Gemini prompt enhancement notice:", err);
      }
    }

    // 2. Susun 4 Prompt Fotografi Marketplace
    const baseSubject = `${kategori} named "${namaItem}", commercial product photography for ${domain}, studio lighting, 8k, photorealistic, portrait orientation`;

    const prompts = {
      hero: geminiEnhancedPrompt?.hero_prompt || `Hero commercial product photography of ${baseSubject}, centered on clean minimalist ivory podium, soft studio rim lighting, white/light grey background, 8k portrait`,
      detail: geminiEnhancedPrompt?.detail_prompt || `Editorial macro close-up of ${baseSubject}, ${labelsString}, material craftsmanship, soft studio light, shallow depth of field, 8k portrait`,
      benefit: geminiEnhancedPrompt?.benefit_prompt || `Commercial infographic presentation of ${baseSubject}, headline '${benefitHeadline}', key product benefits, clean layout, 8k portrait`,
      lifestyle: geminiEnhancedPrompt?.lifestyle_prompt || `Lifestyle product photography of ${baseSubject} in natural real-world use for ${kategori}, warm morning light, commercial catalog, 8k portrait`,
    };

    // 3. Generate 4 foto via OpenAI DALL-E (engine utama jika key tersedia)
    if (activeOpenAiKey) {
      try {
        const SCENE_CONFIGS = [
          { id: "hero", title: "1. Foto Utama (Hero Marketplace)", angle: "Foto Utama", badge: "Hero Product", desc: "Fokus utama, background bersih, pencahayaan studio lembut.", prompt: prompts.hero },
          { id: "detail", title: "2. Detail & Kualitas (Macro Shot)", angle: "Meyakinkan Kualitas", badge: "Detail & Quality", desc: "Macro shot tekstur, material, kerapian finishing & kemasan.", prompt: prompts.detail },
          { id: "benefit", title: "3. Keunggulan & Fitur (Infografis)", angle: "Alasan Membeli", badge: "Key Features", desc: "Infografis modern keunggulan produk.", prompt: prompts.benefit },
          { id: "lifestyle", title: "4. Konteks Penggunaan (Lifestyle)", angle: "Konteks Real Use", badge: "Real Context", desc: "Fotografi kontekstual penggunaan nyata produk.", prompt: prompts.lifestyle },
        ];

        const generateOneImage = async (scenePrompt: string): Promise<string | null> => {
          // Try gpt-image-1 first (newest, highest quality)
          try {
            const res = await fetch("https://api.openai.com/v1/images/generations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${activeOpenAiKey}`,
              },
              body: JSON.stringify({
                model: "gpt-image-1",
                prompt: scenePrompt,
                n: 1,
                size: "1024x1536",
                quality: "standard",
                response_format: "b64_json",
              }),
            });
            if (res.ok) {
              const data = await res.json();
              const b64 = data?.data?.[0]?.b64_json;
              if (b64) return b64;
            }
          } catch {}

          // Fallback: dall-e-3 portrait
          try {
            const res = await fetch("https://api.openai.com/v1/images/generations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${activeOpenAiKey}`,
              },
              body: JSON.stringify({
                model: "dall-e-3",
                prompt: scenePrompt.slice(0, 4000),
                n: 1,
                size: "1024x1792",
                quality: "standard",
                response_format: "b64_json",
              }),
            });
            if (res.ok) {
              const data = await res.json();
              return data?.data?.[0]?.b64_json || null;
            }
          } catch {}

          return null;
        };

        // Generate all 4 photos concurrently
        const results = await Promise.allSettled(
          SCENE_CONFIGS.map((scene) => generateOneImage(scene.prompt))
        );

        const openaiPhotos = SCENE_CONFIGS.map((scene, i) => {
          const result = results[i];
          const b64 = result.status === "fulfilled" ? result.value : null;
          if (!b64) return null;
          const dataUrl = `data:image/png;base64,${b64}`;
          return {
            id: scene.id,
            title: scene.title,
            angle: scene.angle,
            badge: scene.badge,
            desc: scene.desc,
            prompt: scene.prompt,
            url: dataUrl,
            directUrl: dataUrl,
          };
        }).filter(Boolean);

        if (openaiPhotos.length >= 3) {
          return NextResponse.json({
            success: true,
            data: {
              domain, namaItem, tagline, kategori,
              photos: openaiPhotos,
              usedGemini: !!geminiEnhancedPrompt,
              engine: "openai_dalle",
              generatedAt: new Date().toISOString(),
            },
          });
        }
      } catch (openaiErr) {
        console.warn("OpenAI DALL-E generation error, falling back:", openaiErr);
      }
    }

    // 4. Fallback ke Pollinations.ai proxy (jika OpenAI tidak tersedia / gagal)
    const seedBase = Date.now();
    const photos = [
      {
        id: "hero",
        title: "1. Foto Utama (Hero Marketplace)",
        angle: "Foto Utama",
        badge: "Hero Product",
        desc: "Fokus utama, background bersih (putih/ivory), pencahayaan studio lembut, identitas logo & warna presisi.",
        prompt: prompts.hero,
        url: `/api/v1/public/ai/image-proxy?prompt=${encodeURIComponent(prompts.hero)}&seed=${seedBase + 1}&width=960&height=1280`,
        directUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.hero)}?width=960&height=1280&seed=${seedBase + 1}&model=turbo&nologo=true`,
      },
      {
        id: "detail",
        title: "2. Detail & Kualitas (Macro Shot)",
        angle: "Meyakinkan Kualitas",
        badge: "Detail & Quality",
        desc: "Macro shot tekstur, material, kerapian finishing & kemasan untuk meyakinkan calon pembeli/mitra.",
        prompt: prompts.detail,
        url: `/api/v1/public/ai/image-proxy?prompt=${encodeURIComponent(prompts.detail)}&seed=${seedBase + 2}&width=960&height=1280`,
        directUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.detail)}?width=960&height=1280&seed=${seedBase + 2}&model=turbo&nologo=true`,
      },
      {
        id: "benefit",
        title: "3. Keunggulan & Fitur (Infografis)",
        angle: "Alasan Membeli",
        badge: "Key Features",
        desc: "Tampilan infografis modern menyajikan poin keunggulan dan alasan mengapa produk ini layak dipilih.",
        prompt: prompts.benefit,
        url: `/api/v1/public/ai/image-proxy?prompt=${encodeURIComponent(prompts.benefit)}&seed=${seedBase + 3}&width=960&height=1280`,
        directUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.benefit)}?width=960&height=1280&seed=${seedBase + 3}&model=turbo&nologo=true`,
      },
      {
        id: "lifestyle",
        title: "4. Konteks Penggunaan (Lifestyle)",
        angle: "Konteks Real Use",
        badge: "Real Context",
        desc: "Fotografi kontekstual penggunaan nyata produk sesuai kategori (meja kerja, lab, konsumsi, atau aktivitas sehari-hari).",
        prompt: prompts.lifestyle,
        url: `/api/v1/public/ai/image-proxy?prompt=${encodeURIComponent(prompts.lifestyle)}&seed=${seedBase + 4}&width=960&height=1280`,
        directUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompts.lifestyle)}?width=960&height=1280&seed=${seedBase + 4}&model=turbo&nologo=true`,
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        domain, namaItem, tagline, kategori,
        photos,
        usedGemini: !!geminiEnhancedPrompt,
        engine: "pollinations_fallback",
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
