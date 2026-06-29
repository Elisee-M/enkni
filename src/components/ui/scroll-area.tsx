"use client"

import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function ScrollArea({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700",
        className,
      )}
      {...props}
    />
  )
}
