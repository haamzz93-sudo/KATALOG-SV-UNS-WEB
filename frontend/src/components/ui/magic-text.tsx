"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

export interface MagicTextProps {
  text: string;
  className?: string;
  textClassName?: string;
}

interface WordProps {
  children: string;
  progress: any;
  range: number[];
  textClassName?: string;
}

const Word: React.FC<WordProps> = ({ children, progress, range, textClassName }) => {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const filter = useTransform(progress, range, ["blur(5px)", "blur(0px)"]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <span className={cn("relative mr-1.5 inline-block", textClassName)}>
      {/* Ghost text for layout & subtle background */}
      <span className="absolute opacity-15 select-none pointer-events-none">{children}</span>
      <motion.span style={{ opacity, filter, y }} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ 
  text, 
  className = "", 
  textClassName = "" 
}) => {
  const container = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.4"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className={cn("flex flex-wrap items-center leading-relaxed font-sans", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.2 / words.length);

        return (
          <React.Fragment key={`${word}-${i}`}>
            <Word progress={scrollYProgress} range={[start, end]} textClassName={textClassName}>
              {word}
            </Word>
            {i < words.length - 1 && <span className="inline select-text">&nbsp;</span>}
          </React.Fragment>
        );
      })}
    </p>
  );
};
