"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export const CampusArchitecturalBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSiteSettings();

  const leftBuilding = settings?.bg_building_left_url || "/images/backgrounds/gedung-sv-3d-iso-2.png";
  const rightBuilding = settings?.bg_building_right_url || "/images/backgrounds/gedung-sv-3d-iso-1.png";
  const campusLandscape = settings?.bg_campus_landscape_url || "/images/backgrounds/gedung-sv-drone-aerial.jpg";

  // Direct compositor-friendly scroll parallax (no heavy spring loops)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth transforms using pure GPU matrix translation
  const yLeft = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const yRight = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.45, 0.9, 0.9, 0.45]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Ultra-light SVG Coordinate Grid (Static zero-cost layer) */}
      <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="campus-blueprint-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="30" cy="30" r="1.5" fill="currentColor" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#campus-blueprint-grid)" />
        </svg>
      </div>

      {/* 2. Zero-Cost Radial Gradient Halos */}
      <div 
        className="absolute -left-16 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.04) 40%, transparent 70%)",
        }}
      />
      <div 
        className="absolute -right-16 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(15, 76, 129, 0.14) 0%, rgba(15, 76, 129, 0.04) 40%, transparent 70%)",
        }}
      />

      {/* 2.5 Central Academic Campus Grounds Environment (Static Watermark) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.06] dark:opacity-[0.035]">
        {campusLandscape?.match(/\.(mp4|webm|ogg)$/i) ? (
          <video
            src={campusLandscape}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-6xl h-full object-cover object-center"
          />
        ) : (
          <img
            src={campusLandscape}
            alt="Sekolah Vokasi UNS Central Grounds"
            width={1200}
            height={670}
            loading="lazy"
            decoding="async"
            className="w-full max-w-6xl h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAFC] via-transparent to-[#F8FAFC] dark:from-[#07192C] dark:via-transparent dark:to-[#07192C] architectural-gradient-mask" />
      </div>

      {/* 3. LEFT VECTOR: Gedung Baru Sekolah Vokasi UNS */}
      <motion.div
        style={{
          y: yLeft,
          opacity: opacity,
          willChange: "transform, opacity",
          transform: "translateZ(0)",
        }}
        className="absolute -left-8 sm:-left-12 lg:-left-6 xl:left-2 2xl:left-10 top-1/2 -translate-y-1/2 w-[280px] sm:w-[350px] md:w-[400px] lg:w-[460px] xl:w-[500px] max-w-[42vw] pointer-events-none"
      >
        <div style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}>
          {leftBuilding?.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={leftBuilding}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-contain opacity-80 dark:opacity-45 rounded-2xl shadow-xl"
            />
          ) : (
            <img
              src={leftBuilding}
              alt="Gedung Baru Sekolah Vokasi UNS"
              width={675}
              height={610}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain opacity-80 dark:opacity-45 rounded-2xl shadow-xl"
            />
          )}
        </div>
      </motion.div>

      {/* 4. RIGHT VECTOR: Gedung Baru 8 Lantai Sekolah Vokasi UNS (Real Aerial) */}
      <motion.div
        style={{
          y: yRight,
          opacity: opacity,
          willChange: "transform, opacity",
          transform: "translateZ(0)",
        }}
        className="absolute -right-8 sm:-right-12 lg:-right-6 xl:right-2 2xl:right-10 top-1/2 -translate-y-1/2 w-[280px] sm:w-[350px] md:w-[400px] lg:w-[460px] xl:w-[500px] max-w-[42vw] pointer-events-none"
      >
        <div style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}>
          {rightBuilding?.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={rightBuilding}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-contain opacity-80 dark:opacity-45 rounded-2xl shadow-xl"
            />
          ) : (
            <img
              src={rightBuilding}
              alt="Gedung Baru 8 Lantai Sekolah Vokasi UNS"
              width={637}
              height={601}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain opacity-80 dark:opacity-45 rounded-2xl shadow-xl"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};
