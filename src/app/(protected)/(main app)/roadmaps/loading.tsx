import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Roadmaps</h1>
        <p className="text-muted-foreground">Track your learning journey with structured roadmaps</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="h-10 w-40 bg-muted rounded-md animate-pulse" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-6">
        <div className="h-10 w-[200px] bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-[150px] bg-muted rounded-md animate-pulse" />
      </div>

      <RoadmapGridSkeleton />
    </div>
  )
}


function RoadmapGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  )
}
