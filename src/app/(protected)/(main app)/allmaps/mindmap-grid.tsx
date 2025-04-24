"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Mindmap } from "./page";

export default function MindmapGrid({ mindmaps: initialMindmaps }: { mindmaps: Mindmap[] }) {
  const [mindmaps, setMindmaps] = useState<Mindmap[]>(initialMindmaps || []);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setMindmaps(initialMindmaps || []);
  }, [initialMindmaps]);

  useEffect(() => {
    if (!isHydrated) return;

    const handleMindmapsFiltered = (event: CustomEvent) => {
      console.log("Received filtered mindmaps:", event.detail.mindmaps);
      const filteredMindmaps = event.detail.mindmaps || [];
      setMindmaps(Array.isArray(filteredMindmaps) ? filteredMindmaps : []);
    };

    window.addEventListener("mindmapsFiltered", handleMindmapsFiltered as EventListener);
    return () => window.removeEventListener("mindmapsFiltered", handleMindmapsFiltered as EventListener);
  }, [isHydrated]);

  if (mindmaps.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No mindmaps found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your search or create a new mindmap</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mindmaps.map((mindmap) => (
        <Link href={`/mindmap/${mindmap.id}`} key={mindmap.id} className="group">
          <Card className="h-full transition-all hover:shadow-md bg-muted/10 rounded-lg border border-border/30">
            <CardHeader>
              <CardTitle className="line-clamp-2">{mindmap.title || "Untitled"}</CardTitle>
            </CardHeader>
            <CardContent>
              {mindmap.originalText && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{mindmap.originalText}</p>
              )}
              <MindmapPreview markdown={mindmap.markdown} />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {new Date(mindmap.createdAt).toISOString().split("T")[0]}
              </div>
              <Badge variant="outline">Mindmap</Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function MindmapPreview({ markdown }: { markdown?: string }) {
  if (!markdown) {
    return (
      <div className="h-24 bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
        <FileText className="h-8 w-8 opacity-50" />
      </div>
    );
  }

  const lines = markdown.split("\n").filter((line) => line.trim().startsWith("#")) || [];

  if (lines.length === 0) {
    return (
      <div className="h-24 bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
        <FileText className="h-8 w-8 opacity-50" />
      </div>
    );
  }

  return (
    <div className="h-24 bg-muted/10 rounded-md p-2 overflow-hidden text-xs">
      <div className="flex flex-col gap-1">
        {lines.slice(0, 4).map((line, index) => {
          const level = (line.match(/^#+/) || ["#"])[0].length;
          const text = line.replace(/^#+\s*/, "").trim() || "Untitled Section";
          return (
            <div key={index} className="flex items-center" style={{ paddingLeft: `${(level - 1) * 8}px` }}>
              <div className="w-2 h-2 rounded-full bg-primary/60 mr-1.5"></div>
              <span className="truncate">{text}</span>
            </div>
          );
        })}
        {lines.length > 4 && (
          <div className="text-muted-foreground text-center mt-1">+{lines.length - 4} more sections</div>
        )}
      </div>
    </div>
  );
}