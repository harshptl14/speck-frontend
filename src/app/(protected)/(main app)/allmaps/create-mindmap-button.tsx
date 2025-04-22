"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreateMindmapButton() {
  return (
    <Button asChild size="lg" className="gap-2 font-medium shadow-sm">
      <Link href="/newmap">
        <Plus className="h-5 w-5" />
        Create New Mindmap
      </Link>
    </Button>
  )
}
