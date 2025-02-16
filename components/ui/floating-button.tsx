"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideProps } from "lucide-react"

interface FloatingButtonProps {
  title: string
  href: string
  iconName: string
  className?: string
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ title, href, iconName, className }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [Icon, setIcon] = useState<React.ComponentType<LucideProps> | null>(null)

  useEffect(() => {
    const loadIcon = async () => {
      const icon = (await import("lucide-react"))[
        iconName as keyof typeof import("lucide-react")
      ] as React.ComponentType<LucideProps>
      setIcon(() => icon)
    }
    loadIcon()
  }, [iconName])

  return (
    <Link
      href={href}
      className={cn(
        "fixed bottom-4 right-4 flex items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isHovered ? "px-4 py-2" : "p-2",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {Icon && <Icon className="size-6 shrink-0" />}
      {isHovered && <span className="ml-2 whitespace-nowrap">{title}</span>}
    </Link>
  )
}

