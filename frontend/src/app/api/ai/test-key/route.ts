import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();
    const key = apiKey?.trim() || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const payload = {
      contents: [{ parts: [{ text: "Ping test. Balas dengan: KONEKSI GEMINI AKTIF" }] }]
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ success: false, message: err?.error?.message || "Kunci API tidak valid atau limit kuota" }, { status: 400 });
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "OK";

    return NextResponse.json({
      success: true,
      message: "Koneksi Google Gemini 2.5 Flash Berhasil!",
      model: "gemini-2.5-flash",
      reply
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
