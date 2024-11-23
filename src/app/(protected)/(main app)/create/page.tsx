import RoadmapCreator from "./UserInput";
import type { Metadata } from "next";

// app/create-roadmap/page.tsx (Server Component)

export const metadata: Metadata = {
  title: "Create Roadmap",
};

export default function CreateRoadmapPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <RoadmapCreator />
      </div>
    </div>
  );
}
