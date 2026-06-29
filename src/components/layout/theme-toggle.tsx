"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.classList.toggle("light", !dark)
  }, [dark])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark(!dark)}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
