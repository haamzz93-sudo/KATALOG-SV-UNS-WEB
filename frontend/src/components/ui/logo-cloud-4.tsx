"use client";

import React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export type Logo = {
  src: string;
  alt: string;
  name?: string;
  width?: number;
  height?: number;
};

export type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
  itemClassName?: string;
  textClassName?: string;
};

export function LogoCloud({ logos, className, itemClassName, textClassName, ...props }: LogoCloudProps) {
  // Ensure enough items so InfiniteSlider covers full width smoothly without stuttering or gaps
  const safeLogos = React.useMemo(() => {
    if (!logos || logos.length === 0) return [];
    let list = [...logos];
    while (list.length < 8) {
      list = [...list, ...logos];
    }
    return list;
  }, [logos]);

  if (safeLogos.length === 0) return null;

  return (
    <div className={`relative mx-auto max-w-5xl py-6 overflow-hidden ${className || ""}`} {...props}>
      <InfiniteSlider gap={36} duration={30} durationOnHover={18}>
        {safeLogos.map((logo, idx) => (
          <div
            key={`logo-${logo.alt || logo.name}-${idx}`}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-sm shrink-0 hover:border-[#C5A059]/60 transition-colors ${itemClassName || ""}`}
          >
            <div className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center p-1 shrink-0 shadow-xs">
              <img
                alt={logo.alt || logo.name || "UNS Partner"}
                className="pointer-events-none h-5 w-5 object-contain select-none"
                height="20"
                width="20"
                loading="lazy"
                src={logo.src}
              />
            </div>
            {logo.name && (
              <span className={`text-xs font-bold tracking-wide ${textClassName || "text-slate-700 dark:text-slate-300"}`}>
                {logo.name}
              </span>
            )}
          </div>
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={0.8}
        className="pointer-events-none absolute top-0 left-0 h-full w-[120px] z-10"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={0.8}
        className="pointer-events-none absolute top-0 right-0 h-full w-[120px] z-10"
        direction="right"
      />
    </div>
  );
}
