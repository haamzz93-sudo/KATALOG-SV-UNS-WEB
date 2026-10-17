import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();
    const key = apiKey?.trim() || process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Kunci API OpenAI tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Test 1: Verify key validity against models endpoint
    const modelsRes = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    if (!modelsRes.ok) {
      const err = await modelsRes.json().catch(() => ({}));
      const errMsg = err?.error?.message || "Kunci API OpenAI tidak valid (HTTP " + modelsRes.status + ").";
      return NextResponse.json({ success: false, message: errMsg }, { status: 400 });
    }

    // Test 2: Check quota / credits with a minimal chat test
    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Ping" }],
        max_tokens: 5,
      }),
    });

    if (!chatRes.ok) {
      const chatErr = await chatRes.json().catch(() => ({}));
      if (chatRes.status === 429) {
        return NextResponse.json({
          success: true,
          hasCredits: false,
          message: "Kunci API OpenAI Terverifikasi & Valid! Namun kuota/kredit akun saat ini $0 (habis). Harap isi saldo billing di platform.openai.com agar generate gambar aktif.",
          model: "openai-api-connected",
        });
      }
      return NextResponse.json({
        success: true,
        hasCredits: false,
        message: "Kunci API OpenAI Terverifikasi Valid! Respon: " + (chatErr?.error?.message || "Akun aktif"),
        model: "openai-api-connected",
      });
    }

    return NextResponse.json({
      success: true,
      hasCredits: true,
      message: "Koneksi OpenAI API Key Berhasil & Kuota Aktif! (Model DALL-E / ChatGPT Siap Digunakan)",
      model: "openai-gpt-dalle-ready",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
