
import CourseProgress from "@/components/homepage/courseProgress";
import CTASection from "@/components/homepage/CTASection";
import GreetingSection from "@/components/homepage/greetingSection";
import RoadmapSummary from "@/components/homepage/roadmapSummary";
import { fetchDataFromServer } from "@/services/fetch_roadmap_info";

export default async function HomePage() {
  const { userInfo, roadmapData } = await fetchDataFromServer();

  if (!userInfo) {
    return <div>Please log in to view your roadmaps.</div>;
  }

  return (
    <div className="min-h-screen from-background to-muted p-6">
      <main className="container mx-auto space-y-12">
        <GreetingSection userName={userInfo.name} />
        {roadmapData.totalRoadmapIds.length > 0 && (
          <>
            <RoadmapSummary
              total={roadmapData.totalRoadmapIds.length}
              completed={roadmapData.completedRoadmapIds.length}
              favorite={roadmapData.favoriteRoadmapIds.length}
            />
            <CourseProgress courses={roadmapData.courses} />
          </>
        )}
        <CTASection />
      </main>
    </div>
  );
}