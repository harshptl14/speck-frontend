import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import CreateRoadmapButton from "./create-roadmap-button"
import RoadmapControls from "./roadmap-control"
import type { Roadmap } from "@/types/roadmap"

async function getRoadmaps() {
  const token = cookies().get("jwtToken")?.value

  if (!token) {
    redirect("/auth")
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/myroadmaps`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch roadmaps: ${response.statusText}`)
    }

    const data = await response.json()

    let roadmaps: Roadmap[] = []

    if (data.roadmaps && Array.isArray(data.roadmaps)) {
      roadmaps = data.roadmaps.map((roadmap: any) => ({
        id: roadmap.id,
        name: roadmap.name,
        description: roadmap.description || "",
        markdown: roadmap.markdown || "",
        createdAt: new Date(roadmap.createdAt).toISOString(),
        updatedAt: new Date(roadmap.updatedAt).toISOString(),
        topics: roadmap.topics || [],
      }))
    }


    if (roadmaps.length === 0) {
      console.warn("No roadmaps found in response")
    } else {
      roadmaps.forEach((roadmap, index) => {
        if (!roadmap.id || !roadmap.name || !roadmap.createdAt) {
          console.warn(`Invalid roadmap at index ${index}:`, roadmap)
        }
      })
    }
    console.log("Roadmaps fetched successfully: ====>", roadmaps)

    return roadmaps
  } catch (error) {
    console.error("Error fetching roadmaps:", error)
    throw error
  }
}

export default async function RoadmapsPage() {
  let roadmaps: Roadmap[] = []
  let error = null

  try {
    roadmaps = await getRoadmaps()
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch roadmaps"
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild>
          <a href="/auth">Go to Login</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-background p-0">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Roadmaps</h1>
        <p className="text-muted-foreground">Track your learning journey with structured roadmaps</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <CreateRoadmapButton />
      </div>
      <RoadmapControls initialRoadmaps={roadmaps} />

    </div>
  )
}