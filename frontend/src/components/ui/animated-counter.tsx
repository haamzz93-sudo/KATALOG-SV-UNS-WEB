"use client";

import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export function AnimatedCounter({
  value,
  direction = "up",
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 35,
    stiffness: 140,
    mass: 1,
  });
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "down" ? 0 : value);
    }
  }, [motionValue, isInView, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springValue, decimals, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={`inline-block font-black tabular-nums tracking-tight ${className}`}
    >
      {prefix}0{suffix}
    </span>
  );
}
