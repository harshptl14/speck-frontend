"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface ProjectBreadcrumbProps {
  projectName: string
}

export default function ProjectBreadcrumb({ projectName }: ProjectBreadcrumbProps) {
  // Use state to store the truncated text
  const [truncatedName, setTruncatedName] = useState(projectName)

  // Update truncated name on client-side only
  useEffect(() => {
    // Function to truncate text with ellipsis if it's too long
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text
      return `${text.substring(0, maxLength)}...`
    }

    // Determine max length based on screen size
    const handleResize = () => {
      let maxLength = 40
      if (window.innerWidth < 640) maxLength = 15
      else if (window.innerWidth < 1024) maxLength = 25

      setTruncatedName(truncateText(projectName, maxLength))
    }

    // Initial truncation
    handleResize()

    // Add resize listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [projectName])

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-wrap">
        <BreadcrumbItem className="text-xs sm:text-sm">
          <BreadcrumbLink asChild>
            <Link href="/allmaps" className="whitespace-nowrap">
              <span className="hidden xs:inline">All Mindmaps</span>
              <span className="xs:hidden">Maps</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        </BreadcrumbSeparator>
        <BreadcrumbItem className="text-xs sm:text-sm max-w-[150px] sm:max-w-[250px] md:max-w-none overflow-hidden">
          <BreadcrumbPage className="truncate" title={projectName}>
            {projectName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
