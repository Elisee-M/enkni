"use client"

import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        variant === "default" && "border-zinc-700 bg-zinc-800 text-zinc-300",
        variant === "success" && "border-green-500/30 bg-green-500/10 text-green-400",
        variant === "warning" && "border-amber-500/30 bg-amber-500/10 text-amber-400",
        variant === "danger" && "border-red-500/30 bg-red-500/10 text-red-400",
        variant === "info" && "border-blue-500/30 bg-blue-500/10 text-blue-400",
        className,
      )}
      {...props}
    />
  )
}
