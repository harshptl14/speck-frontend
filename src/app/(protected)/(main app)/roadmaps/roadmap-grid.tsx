import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Roadmap } from "@/types/roadmap"

interface RoadmapGridProps {
  roadmaps: Roadmap[]
}

export default function RoadmapGrid({ roadmaps }: RoadmapGridProps) {
  if (roadmaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
        <h3 className="text-xl font-semibold mb-2">No roadmaps found</h3>
        <p className="text-muted-foreground mb-4">Create your first roadmap to get started on your learning journey.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roadmaps.map((roadmap) => (
        <Link href={`/course/${roadmap.id}`} key={roadmap.id} className="group">
          <Card className="h-full transition-all hover:shadow-md bg-muted/10 rounded-lg border border-border/30">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">{roadmap.name}</CardTitle>
              <CardDescription className="line-clamp-3">
                {roadmap.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardFooter className="text-xs text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(roadmap.createdAt), { addSuffix: true })}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
