"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

export interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
  className?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
  altBefore = "Before",
  altAfter = "After",
  className = "",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newPosition = ((clientX - rect.left) / rect.width) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));
    setSliderPosition(newPosition);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // Touch handlers engineered for smooth mobile scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If movement is predominantly vertical (swiping down to scroll page), do NOT drag slider
    if (deltaY > deltaX) {
      if (isDragging) setIsDragging(false);
      return;
    }

    // Only if horizontal movement is dominant, update slider
    if (deltaX > 8) {
      setIsDragging(true);
      updatePosition(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current = null;
  };

  useEffect(() => {
    const handleGlobalUp = () => {
      setIsDragging(false);
      touchStartRef.current = null;
    };
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchend", handleGlobalUp);
    window.addEventListener("touchcancel", handleGlobalUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchend", handleGlobalUp);
      window.removeEventListener("touchcancel", handleGlobalUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto select-none rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/50 dark:border-white/10 touch-pan-y ${className}`}
      style={{ touchAction: "pan-y" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* After Image (Top Layer) */}
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt={altAfter}
          className="h-full w-full object-cover object-left"
          draggable="false"
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0A2540]/90 text-white backdrop-blur-md border border-white/20">
          {altAfter}
        </span>
      </div>

      {/* Before Image (Bottom Layer) */}
      <img
        src={beforeImage}
        alt={altBefore}
        className="block h-full w-full object-cover object-left pointer-events-none"
        draggable="false"
      />
      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-md border border-white/20 pointer-events-none">
        {altBefore}
      </span>

      {/* Slider Divider Bar & Grab Handle */}
      <div
        className="absolute top-0 bottom-0 w-10 -ml-5 flex items-center justify-center cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%`, touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Subtle Vertical Divider Line */}
        <div className="absolute top-0 bottom-0 w-1 bg-white/95 shadow-lg pointer-events-none" />

        {/* Circular Handle Pill */}
        <div
          className={`relative z-10 bg-white text-slate-800 rounded-full h-10 w-10 flex items-center justify-center shadow-xl border border-slate-300 transition-transform duration-150 ${
            isDragging ? "scale-110 shadow-2xl ring-4 ring-[#C5A059]/40" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="-ml-2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};
