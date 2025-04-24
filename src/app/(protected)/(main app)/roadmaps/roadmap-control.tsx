"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Roadmap } from "@/types/roadmap"
import RoadmapGrid from "./roadmap-grid"

interface RoadmapControlsProps {
  initialRoadmaps: Roadmap[]
}

export default function RoadmapControls({ initialRoadmaps }: RoadmapControlsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<Roadmap[]>(initialRoadmaps)

  // Apply filtering and sorting whenever searchTerm, sortBy, or initialRoadmaps change
  useEffect(() => {
    let result = [...initialRoadmaps]

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase()
      result = result.filter(
        (roadmap) =>
          roadmap.name.toLowerCase().includes(lowerCaseSearch) ||
          (roadmap.description && roadmap.description.toLowerCase().includes(lowerCaseSearch)),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

    setFilteredRoadmaps(result)
  }, [searchTerm, sortBy, initialRoadmaps])

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-6">
        <Input
          placeholder="Search roadmaps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-[200px]"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RoadmapGrid roadmaps={filteredRoadmaps} />
    </div>
  )
}
