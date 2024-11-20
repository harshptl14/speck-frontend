import RoadmapCreator from "./UserInput";

// app/create-roadmap/page.tsx (Server Component)
export default function CreateRoadmapPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <RoadmapCreator />
      </div>
    </div>
  );
}
