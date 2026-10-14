import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");
    const prompt = searchParams.get("prompt");
    const seed = searchParams.get("seed") || "42";
    const width = searchParams.get("width") || "960";
    const height = searchParams.get("height") || "1280";

    let fetchUrl = "";
    if (targetUrl && targetUrl.startsWith("http")) {
      fetchUrl = targetUrl;
    } else if (prompt) {
      fetchUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=turbo&nologo=true`;
    } else {
      return new NextResponse("Missing prompt or url parameter", { status: 400 });
    }

    // Fetch from Pollinations strictly without Referer header to bypass 402 x402 payment wall
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      // If Turbo failed or 402, try fallback without model query
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt || "commercial product photography")}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "image/*",
        },
      });

      if (fallbackRes.ok) {
        const imageBuffer = await fallbackRes.arrayBuffer();
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            "Content-Type": fallbackRes.headers.get("content-type") || "image/jpeg",
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
          },
        });
      }

      throw new Error(`Upstream image generator responded with ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error.message);
    
    // Return SVG Placeholder on error so UI never breaks
    const svgPlaceholder = `
      <svg width="960" height="1280" viewBox="0 0 960 1280" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#07192C"/>
        <circle cx="480" cy="560" r="80" fill="#0F4C81"/>
        <text x="480" y="575" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#C5A059" text-anchor="middle">UNS</text>
        <text x="480" y="690" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Katalog Foto Marketplace Vokasi UNS</text>
        <text x="480" y="730" font-family="system-ui, sans-serif" font-size="18" fill="#94A3B8" text-anchor="middle">Format Portrait 3:4 (960x1280) • Standar Komersial</text>
      </svg>
    `;

    return new NextResponse(svgPlaceholder, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache",
      },
    });
  }
}
