"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import ProjectBreadcrumb from "@/components/markmap/project-breadcrumb"
import AppIcon from "../appIcon"

interface NavbarProps {
  className?: string
  title: string
}

export default function MindmapNav({ className, title }: NavbarProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  // Get project name from path if it exists
  const pathSegments = pathname.split("/").filter(Boolean)
  const isMindmapPage = pathSegments.length >= 2 && pathSegments[0] === "mindmap"
  const projectId = isMindmapPage ? pathSegments[1] : null

  const projectName = projectId ? title : null

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        isScrolled
          ? "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-border/40"
          : "bg-background border-border/20",
        className,
      )}
    >
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-2 sm:px-4">
        {/* Mobile layout: Logo on left, breadcrumb centered */}
        <div className="flex items-center gap-1 sm:gap-2 md:hidden">
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-2 transition-colors hover:opacity-80"
            aria-label="Go to homepage"
          >
            <AppIcon width={28} height={28} className="sm:w-[35px] sm:h-[35px]" />
            <span className="font-medium text-base sm:text-lg hidden sm:inline-block">Speck</span>
          </Link>
        </div>

        {/* Mobile layout: Centered breadcrumb */}
        {isMindmapPage && projectName && (
          <div className="flex-1 mx-2 flex justify-start items-center overflow-hidden md:hidden">
            <ProjectBreadcrumb projectName={projectName} />
          </div>
        )}

        {/* Tablet/Laptop layout: Logo and breadcrumb together on left */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors hover:opacity-80"
            aria-label="Go to homepage"
          >
            <AppIcon width={35} height={35} />
            <span className="font-medium text-lg">Speck</span>
          </Link>

          {isMindmapPage && projectName && (
            <div className="flex items-center overflow-hidden">
              <ProjectBreadcrumb projectName={projectName} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">{/* Additional navbar items could go here */}</div>
      </div>
    </header>
  )
}
