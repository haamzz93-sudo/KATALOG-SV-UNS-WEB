'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxComponent({
  title = "Inovasi Multidisiplin",
  subtitle = "Sinergi Rekayasa Perangkat Lunak, Mekatronika IoT & Manufaktur Terapan"
}: {
  title?: string;
  subtitle?: string;
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0.5
        }
      });

      const layers = [
        { layer: "1", yPercent: 60 },
        { layer: "2", yPercent: 45 },
        { layer: "3", yPercent: 30 },
        { layer: "4", yPercent: 12 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) gsap.killTweensOf(triggerElement);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#07192C] text-white py-20 my-12 rounded-[40px] border border-[#C5A059]/30 shadow-2xl" ref={parallaxRef}>
      <div className="relative max-w-6xl mx-auto px-6">
        <div data-parallax-layers className="relative min-h-[460px] flex flex-col items-center justify-center text-center">
          {/* Layer 1: Ambient Depth Lighting */}
          <div data-parallax-layer="1" className="absolute -top-20 inset-x-0 h-96 bg-gradient-to-b from-[#0F4C81]/40 via-[#C5A059]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

          {/* Layer 2: Geometric Blueprint Rings */}
          <div data-parallax-layer="2" className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[500px] h-[500px] rounded-full border border-sky-400 border-dashed animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-[#C5A059] opacity-40 animate-[spin_40s_linear_infinite_reverse]" />
          </div>

          {/* Layer 3: Main Parallax Typography Content */}
          <div data-parallax-layer="3" className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#C5A059] px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              Sekolah Vokasi Universitas Sebelas Maret
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg text-white">
              {title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Layer 4: Floating Tech Badges */}
          <div data-parallax-layer="4" className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-bold text-slate-200 shadow-md">
              Edge AI & Computer Vision
            </span>
            <span className="px-4 py-2 rounded-xl bg-[#C5A059]/20 backdrop-blur-xl border border-[#C5A059]/40 text-xs font-bold text-[#EAD096] shadow-md">
              Fullstack Cloud Native SaaS
            </span>
            <span className="px-4 py-2 rounded-xl bg-sky-500/20 backdrop-blur-xl border border-sky-400/40 text-xs font-bold text-sky-200 shadow-md">
              LiDAR Autonomous SLAM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
