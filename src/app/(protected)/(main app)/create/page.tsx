import RoadmapCreator from "./UserInput";
import type { Metadata } from "next";

// app/create-roadmap/page.tsx (Server Component)

export const metadata: Metadata = {
  title: "Create Roadmap",
};

export default function CreateRoadmapPage() {
  return (
      <div >
        <RoadmapCreator />
      </div>
  );
}
