import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MindmapGrid from "./mindmap-grid";
import CreateMindmapButton from "./create-mindmap-button";
import MindmapControls from "./mindmap-control";

export type Mindmap = {
  id: number;
  title: string;
  markdown?: string;
  createdAt: string;
  updatedAt?: string;
  originalText?: string;
};

async function getMindmaps() {
  const token = cookies().get("jwtToken")?.value;

  if (!token) {
    redirect("/auth");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/mindmap`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch mindmaps: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw backend response:", data);

    let mindmaps: Mindmap[];
    mindmaps = data.mindmaps || [];

    // Normalize dates to ISO strings
    mindmaps = mindmaps.map((mindmap) => ({
      ...mindmap,
      createdAt: new Date(mindmap.createdAt).toISOString(),
      updatedAt: mindmap.updatedAt ? new Date(mindmap.updatedAt).toISOString() : undefined,
    }));

    console.log("Parsed mindmaps:", mindmaps);

    if (mindmaps.length === 0) {
      console.warn("No mindmaps found in response");
    } else {
      mindmaps.forEach((mindmap, index) => {
        if (!mindmap.id || !mindmap.title || !mindmap.createdAt) {
          console.warn(`Invalid mindmap at index ${index}:`, mindmap);
        }
      });
    }

    return mindmaps as Mindmap[];
  } catch (error) {
    console.error("Error fetching mindmaps:", error);
    throw error;
  }
}

export default async function HomePage() {
  let mindmaps: Mindmap[] = [];
  let error = null;

  try {
    mindmaps = await getMindmaps();
    console.log("Returned mindmaps:", mindmaps);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch mindmaps";
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
          <a href="/login">Go to Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Mindmaps</h1>
        <p className="text-muted-foreground">Organize your thoughts and ideas visually</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <CreateMindmapButton />
        <MindmapControls initialMindmaps={mindmaps} />
      </div>

      <MindmapGrid mindmaps={mindmaps} />
    </div>
  );
}

function MindmapGridSkeleton() {
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
  );
}