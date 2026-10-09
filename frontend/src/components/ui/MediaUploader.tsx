"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, Film, Image as ImageIcon, CheckCircle2, AlertTriangle, X, RefreshCw, Play } from "lucide-react";

interface MediaUploaderProps {
  label?: string;
  description?: string;
  currentUrl?: string;
  onUploadSuccess: (url: string, fileInfo?: { type: "image" | "video"; duration?: number; sizeMb: number }) => void;
  acceptedType?: "image" | "video" | "both";
  maxSizeMb?: number;
  maxDurationSeconds?: number;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label = "Upload Media (Drag & Drop)",
  description,
  currentUrl,
  onUploadSuccess,
  acceptedType = "both",
  maxSizeMb = 10,
  maxDurationSeconds,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [mediaType, setMediaType] = useState<"image" | "video">(
    currentUrl?.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image"
  );
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptMime =
    acceptedType === "image"
      ? "image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
      : acceptedType === "video"
      ? "video/mp4, video/webm"
      : "image/png, image/jpeg, image/webp, image/svg+xml, video/mp4, video/webm";

  const defaultDescription =
    description ||
    (acceptedType === "image"
      ? `PNG, JPG, WEBP atau SVG (Maksimal ${maxSizeMb}MB)`
      : acceptedType === "video"
      ? `MP4 atau WEBM (Maksimal ${maxSizeMb}MB${maxDurationSeconds ? `, Durasi maks ${maxDurationSeconds} detik` : ""})`
      : `Foto (maks 10MB) atau Video MP4/WEBM (maks ${maxSizeMb}MB${maxDurationSeconds ? `, durasi maks ${maxDurationSeconds}s` : ""})`);

  // Validate and handle file
  const processFile = async (file: File) => {
    setErrorMsg(null);

    const isImg = file.type.startsWith("image/");
    const isVid = file.type.startsWith("video/");

    if (!isImg && !isVid) {
      setErrorMsg("Format file tidak didukung. Harap pilih gambar atau video yang valid.");
      return;
    }

    if (acceptedType === "image" && !isImg) {
      setErrorMsg("Harap upload file berupa foto/gambar saja.");
      return;
    }

    if (acceptedType === "video" && !isVid) {
      setErrorMsg("Harap upload file berupa video (MP4/WEBM) saja.");
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    const effectiveMaxMb = isImg ? Math.min(maxSizeMb, 10) : maxSizeMb;
    if (sizeMb > effectiveMaxMb) {
      setErrorMsg(`Ukuran ${isImg ? "foto" : "video"} (${sizeMb.toFixed(1)}MB) melebihi batas maksimal ${effectiveMaxMb}MB.`);
      return;
    }

    // Video duration validation using temporary video element
    if (isVid) {
      try {
        const duration = await getVideoDuration(file);
        setVideoDuration(Math.round(duration));
        if (maxDurationSeconds && duration > maxDurationSeconds) {
          setErrorMsg(
            `Durasi video (${Math.round(duration)} detik) melebihi batas maksimal yang diizinkan (${maxDurationSeconds} detik).`
          );
          return;
        }
      } catch {
        console.warn("Could not read video duration beforehand.");
      }
    }

    // Proceed to upload
    setIsUploading(true);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setMediaType(isVid ? "video" : "image");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
      const res = await fetch(`${API_BASE}/public/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        const serverUrl = json.url || localUrl;
        setPreviewUrl(serverUrl);
        onUploadSuccess(serverUrl, {
          type: isVid ? "video" : "image",
          duration: videoDuration || undefined,
          sizeMb: Number(sizeMb.toFixed(2)),
        });
      } else {
        // Fallback to local object URL
        onUploadSuccess(localUrl, {
          type: isVid ? "video" : "image",
          duration: videoDuration || undefined,
          sizeMb: Number(sizeMb.toFixed(2)),
        });
      }
    } catch {
      // Offline fallback: Use object URL so user workflow is uninterrupted
      onUploadSuccess(localUrl, {
        type: isVid ? "video" : "image",
        duration: videoDuration || undefined,
        sizeMb: Number(sizeMb.toFixed(2)),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => reject("Error loading video metadata");
      video.src = URL.createObjectURL(file);
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUploadSuccess("");
  };

  return (
    <div className={`space-y-2 text-left ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {label}
          </label>
          {previewUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hapus Media</span>
            </button>
          )}
        </div>
      )}

      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ borderRadius: "20px" }}
        className={`relative border-2 border-dashed p-4 sm:p-6 transition-all duration-200 cursor-pointer text-center group ${
          isDragging
            ? "border-[#0F4C81] dark:border-[#C5A059] bg-blue-50/70 dark:bg-white/10 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 hover:border-[#0F4C81] dark:hover:border-[#C5A059] bg-slate-50/80 dark:bg-slate-900/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptMime}
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="py-6 flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 text-[#0F4C81] dark:text-[#C5A059] animate-spin" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Sedang Mengunggah & Memvalidasi Media...
            </p>
            <p className="text-xs text-slate-500">Mohon tunggu beberapa saat</p>
          </div>
        ) : previewUrl ? (
          <div className="space-y-3">
            <div className="relative mx-auto rounded-xl overflow-hidden max-h-48 flex items-center justify-center bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-slate-800">
              {mediaType === "video" ? (
                <div className="relative w-full flex justify-center items-center py-2">
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-40 rounded-lg max-w-full shadow-md"
                  />
                  {videoDuration && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono font-bold">
                      {videoDuration} detik
                    </span>
                  )}
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 object-contain rounded-lg"
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Media Siap Digunakan. Klik atau drag file baru untuk mengganti.</span>
            </div>
          </div>
        ) : (
          <div className="py-4 sm:py-6 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-white/10 text-[#0F4C81] dark:text-[#C5A059] flex items-center justify-center group-hover:scale-110 transition-transform">
              {acceptedType === "video" ? (
                <Film className="w-6 h-6" />
              ) : acceptedType === "image" ? (
                <ImageIcon className="w-6 h-6" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                Tarik & Lepas (Drag and Drop) file ke sini, atau{" "}
                <span className="text-[#0F4C81] dark:text-[#C5A059] underline">pilih dari perangkat</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {defaultDescription}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error alert if validation failed */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
