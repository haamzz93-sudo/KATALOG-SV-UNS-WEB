"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"

interface GooeyDockProps {
  className?: string
  items: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick?: () => void
  }[]
}

export default function GooeyDock({ items, className }: GooeyDockProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)

  return (
    <div
      className={cn("flex items-center justify-center w-full py-6", className)}
    >
      {/* SVG goo filter */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -5"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <TooltipProvider delayDuration={100}>
        <div className="relative flex gap-4 px-6 py-3 rounded-full bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-2xl">
          {items.map((item, i) => {
            const isHovered = hovered === i
            const Icon = item.icon

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="relative"
                  >
                    {/* Liquid blob background with goo filter */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#C5A059]/40"
                      style={{ filter: "url(#goo)" }}
                      animate={{
                        scale: isHovered ? 1.6 : 1,
                        opacity: isHovered ? 1 : 0.4,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                      }}
                    />

                    {/* Icon button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full bg-slate-900/80 hover:bg-[#C5A059] text-white hover:text-[#0A2540] transition-colors"
                      onClick={item.onClick}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs bg-slate-900 text-white border-white/10">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
}
