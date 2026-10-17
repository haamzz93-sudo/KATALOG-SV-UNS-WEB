import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      openaiApiKey,
      prompt,
      size = "1024x1536", // Portrait 2:3 ≈ 3:4, closest to 960x1280 supported by DALL-E
      quality = "standard",
      n = 1,
    } = body;

    const activeKey = (openaiApiKey && openaiApiKey.trim()) || process.env.OPENAI_API_KEY || "";

    if (!activeKey) {
      return NextResponse.json(
        { success: false, message: "OpenAI API key tidak ditemukan." },
        { status: 400 }
      );
    }

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, message: "Prompt tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Call OpenAI Images API (gpt-image-1 or dall-e-3)
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt.trim(),
        n,
        size,
        quality,
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      // Fallback: try dall-e-3 if gpt-image-1 not available on this account
      if (response.status === 400 || response.status === 404) {
        const fallbackRes = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeKey}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt.trim().slice(0, 4000),
            n: 1,
            size: "1024x1792", // Portrait 1:1.75 available in dall-e-3
            quality,
            response_format: "b64_json",
          }),
        });

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const b64 = fallbackData?.data?.[0]?.b64_json;
          if (b64) {
            return NextResponse.json({
              success: true,
              model: "dall-e-3",
              imageDataUrl: `data:image/png;base64,${b64}`,
            });
          }
        }

        const fallbackErr = await fallbackRes.json().catch(() => ({}));
        return NextResponse.json(
          {
            success: false,
            message: fallbackErr?.error?.message || errBody?.error?.message || "OpenAI API error",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: errBody?.error?.message || `OpenAI responded with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const b64 = data?.data?.[0]?.b64_json;

    if (!b64) {
      return NextResponse.json(
        { success: false, message: "OpenAI tidak mengembalikan gambar." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      model: "gpt-image-1",
      imageDataUrl: `data:image/png;base64,${b64}`,
    });
  } catch (error: any) {
    console.error("OpenAI image route error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
