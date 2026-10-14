import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json({ success: false, message: "Format file tidak didukung" }, { status: 422 });
    }

    const ext = file.name.split(".").pop() || (isImage ? "png" : "mp4");
    const fileName = `${isImage ? "img_" : "vid_"}${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        message: "File berhasil diunggah",
      });
    } catch (fsErr) {
      console.warn("Direct file write failed, returning base64 data url:", fsErr);
      // Fallback to base64 Data URL so upload NEVER fails or throws 500
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        message: "File diproses sebagai data URL",
      });
    }
  } catch (error: any) {
    console.error("Next.js upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memproses file" },
      { status: 500 }
    );
  }
}
