"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all inline-flex items-center justify-center font-bold text-white shadow-lg",
  {
    variants: {
      size: {
        default: "px-7 py-3.5 text-sm",
        sm: "px-5 py-2.5 text-xs",
        lg: "px-9 py-4 text-base",
        icon: "h-10 w-10 p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
  glowColor?: "blue" | "gold";
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, glowColor = "gold", contentClassName, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          glassButtonVariants({ size }),
          "border border-white/25 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95",
          glowColor === "gold"
            ? "bg-gradient-to-r from-[#C5A059] to-[#dfba6a] text-[#0A2540] shadow-[0_10px_25px_rgba(197,160,89,0.4)]"
            : "bg-gradient-to-r from-[#0F4C81] to-[#0A2540] text-white shadow-[0_10px_25px_rgba(15,76,129,0.5)]",
          className
        )}
        {...props}
      >
        <span className={cn("relative z-10 flex items-center gap-2", contentClassName)}>
          {children}
        </span>
      </button>
    );
  }
);
GlassButton.displayName = "GlassButton";
