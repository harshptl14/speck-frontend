"use client";

import { useState, useEffect } from "react";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Mindmap } from "./page";

type SortOption = "newest" | "alphabetical" | "updated";

interface MindmapControlsProps {
  initialMindmaps: Mindmap[];
}

export default function MindmapControls({ initialMindmaps }: MindmapControlsProps) {
  const safeMindmaps = Array.isArray(initialMindmaps) ? initialMindmaps : [];
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const filteredAndSortedMindmaps = filterAndSortMindmaps(safeMindmaps, searchQuery, sortOption, sortDirection);
    const event = new CustomEvent("mindmapsFiltered", {
      detail: { mindmaps: filteredAndSortedMindmaps },
    });
    window.dispatchEvent(event);
  }, [isHydrated, safeMindmaps, searchQuery, sortOption, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search mindmaps..."
          className="pl-9 w-full sm:w-[250px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-between">
              {getSortLabel(sortOption)}
              <SortAsc className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOption("newest")}>Date Created</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("alphabetical")}>Alphabetical</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("updated")}>Last Updated</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon" onClick={toggleSortDirection}>
          {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

function getSortLabel(option: SortOption): string {
  switch (option) {
    case "newest":
      return "Date Created";
    case "alphabetical":
      return "Alphabetical";
    case "updated":
      return "Last Updated";
    default:
      return "Sort By";
  }
}

function filterAndSortMindmaps(
  mindmaps: Mindmap[],
  searchQuery: string,
  sortOption: SortOption,
  sortDirection: "asc" | "desc",
): Mindmap[] {
  let filtered = mindmaps;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = mindmaps.filter(
      (mindmap) =>
        mindmap.title?.toLowerCase().includes(query) ||
        (mindmap.originalText && mindmap.originalText.toLowerCase().includes(query)),
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    switch (sortOption) {
      case "newest": {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return isNaN(aDate.getTime()) || isNaN(bDate.getTime()) ? 0 : bDate.getTime() - aDate.getTime();
      }
      case "alphabetical": {
        return (a.title || "").localeCompare(b.title || "");
      }
      case "updated": {
        const aUpdated = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt);
        const bUpdated = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt);
        return isNaN(aUpdated.getTime()) || isNaN(bUpdated.getTime()) ? 0 : bUpdated.getTime() - aUpdated.getTime();
      }
      default:
        return 0;
    }
  });

  return sortDirection === "desc" ? sorted : sorted.reverse();
}