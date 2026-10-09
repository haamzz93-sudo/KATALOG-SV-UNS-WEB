"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export const CampusShowcaseBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSiteSettings();

  const leftBuilding = settings?.bg_building_left_url || "/images/backgrounds/gedung-vokasi-pusat-left.png";
  const rightBuilding = settings?.bg_building_right_url || "/images/backgrounds/gedung-vokasi-pusat-right.png";
  const campusLandscape = settings?.bg_campus_landscape_url || "/images/backgrounds/Mendiktisaintek-Resmikan-Gedung-Baru-Sekolah-Vokasi-UNS.webp";

  // Smooth scroll parallax for the showcase section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yLeft = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);
  const yRight = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const opacityBuildings = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.35, 0.85, 0.85, 0.35]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Subtle Isometric Blueprint Coordinate Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.045] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="showcase-blueprint-grid" width="70" height="70" patternUnits="userSpaceOnUse">
              <path d="M 70 0 L 0 0 0 70" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="35" cy="35" r="1.5" fill="currentColor" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#showcase-blueprint-grid)" />
        </svg>
      </div>

      {/* 2. Zero-Cost Radial Gradient Halos */}
      <div 
        className="absolute -left-20 top-1/4 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.10) 0%, rgba(249, 115, 22, 0.03) 40%, transparent 70%)",
        }}
      />
      <div 
        className="absolute -right-20 top-1/2 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(15, 76, 129, 0.12) 0%, rgba(15, 76, 129, 0.03) 40%, transparent 70%)",
        }}
      />
      <div 
        className="absolute left-1/3 bottom-10 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(197, 160, 89, 0.09) 0%, transparent 70%)",
        }}
      />

      {/* 3. Central Panoramic Campus Landscape (Static Watermark) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] dark:opacity-[0.04] pointer-events-none overflow-hidden">
        <img
          src={campusLandscape}
          alt="Sekolah Vokasi UNS Grounds"
          width={1200}
          height={670}
          loading="lazy"
          decoding="async"
          className="w-full max-w-7xl h-auto object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-transparent to-[#F8FAFC] dark:from-[#07192C] dark:via-transparent dark:to-[#07192C] architectural-gradient-mask-v" />
      </div>

      {/* 4. LEFT BUILDING: Gedung Baru Sekolah Vokasi UNS (Fasad Utama) */}
      <motion.div
        style={{
          y: yLeft,
          opacity: opacityBuildings,
          willChange: "transform, opacity",
          transform: "translateZ(0)",
        }}
        className="absolute -left-8 sm:-left-12 md:-left-6 lg:left-2 xl:left-6 top-[16%] w-[260px] sm:w-[320px] md:w-[380px] lg:w-[440px] xl:w-[480px] max-w-[40vw] pointer-events-none"
      >
        <div style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}>
          <img
            src={leftBuilding}
            alt="Gedung Baru Sekolah Vokasi UNS"
            width={675}
            height={610}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain opacity-80 dark:opacity-45 rounded-2xl shadow-xl"
          />
        </div>
      </motion.div>

      {/* 5. RIGHT BUILDING: Gedung Baru 8 Lantai Sekolah Vokasi UNS (Real Aerial) */}
      <motion.div
        style={{
          y: yRight,
          opacity: opacityBuildings,
          willChange: "transform, opacity",
          transform: "translateZ(0)",
        }}
        className="absolute -right-8 sm:-right-12 md:-right-6 lg:right-2 xl:right-6 top-[46%] w-[260px] sm:w-[320px] md:w-[380px] lg:w-[440px] xl:w-[480px] max-w-[40vw] pointer-events-none"
      >
        <div style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}>
          <img
            src={rightBuilding}
            alt="Gedung Baru 8 Lantai Sekolah Vokasi UNS"
            width={637}
            height={601}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain opacity-80 dark:opacity-45 rounded-2xl shadow-xl"
          />
        </div>
      </motion.div>
    </div>
  );
};
