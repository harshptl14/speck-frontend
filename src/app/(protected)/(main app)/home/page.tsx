// import CourseProgress from "@/components/homepage/courseProgress";
// import CTASection from "@/components/homepage/CTASection";
// import GreetingSection from "@/components/homepage/greetingSection";
// import RoadmapSummary from "@/components/homepage/roadmapSummary";
// import { fetchDataFromServer } from "@/services/fetch_roadmap_info";
// import type { Metadata } from "next";

// export const metadata = {
//   title: "Home",
// };

// export default async function HomePage() {
//   const { userInfo, roadmapData } = await fetchDataFromServer();

//   if (!userInfo) {
//     return <div>Please log in to view your roadmaps.</div>;
//   }

//   return (
//     <div className="from-background to-muted">
//       <main className="container mx-auto space-y-12">
//         <GreetingSection userName={userInfo.name} />
//         {roadmapData.totalRoadmapIds.length > 0 && (
//           <>
//             <RoadmapSummary
//               total={roadmapData.totalRoadmapIds.length}
//               completed={roadmapData.completedRoadmapIds.length}
//               favorite={roadmapData.favoriteRoadmapIds.length}
//             />
//             <CourseProgress courses={roadmapData.courses} />
//           </>
//         )}
//         <CTASection />
//       </main>
//     </div>
//   );
// }


import { fetchDataFromServer } from "@/services/fetch_roadmap_info"
import GreetingSection from "@/components/homepage/greetingSection"
import RoadmapSummary from "@/components/homepage/roadmapSummary"
import CourseProgress from "@/components/homepage/courseProgress"
import FeatureCards from "@/components/homepage/feature-cards"
import RecentMindmaps from "@/components/homepage/recent-mindmaps"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
  description: "Your AI-powered learning journey starts here",
}

export default async function HomePage() {
  const { userInfo, roadmapData, mindmapData } = await fetchDataFromServer()

  if (!userInfo) {
    return <div>Please log in to view your dashboard.</div>
  }

  const hasRoadmaps = roadmapData.totalRoadmapIds.length > 0
  const hasMindmaps = mindmapData.roadmapsInfo.totalMindmaps > 0
  const isNewUser = !hasRoadmaps && !hasMindmaps

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-12">
      <main className="container mx-auto px-4 space-y-10 pt-6">
        <GreetingSection userName={userInfo.name} />

        {isNewUser ? (
          <FeatureCards />
        ) : (
          <div className="space-y-10">
            {hasRoadmaps && (
              <div className="space-y-8">
                <RoadmapSummary
                  total={roadmapData.totalRoadmapIds.length}
                  completed={roadmapData.completedRoadmapIds.length}
                  favorite={roadmapData.favoriteRoadmapIds.length}
                />
                <CourseProgress courses={roadmapData.courses} />
              </div>
            )}

            {hasMindmaps && (
              <RecentMindmaps
                mindmaps={mindmapData.roadmapsInfo.latestMindmaps}
                total={mindmapData.roadmapsInfo.totalMindmaps}
              />
            )}

            {/* Show feature cards in a smaller format if user has some content but not both types */}
            {(!hasRoadmaps || !hasMindmaps) && (
              <div className="mt-8">
                <FeatureCards compact={true} showOnly={!hasRoadmaps ? "roadmap" : "mindmap"} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
