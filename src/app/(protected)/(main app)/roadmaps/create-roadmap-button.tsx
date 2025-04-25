"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateRoadmapButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/create")} className="flex items-center gap-2">
      <PlusIcon className="h-4 w-4" />
      Create Roadmap
    </Button>
  )
}
