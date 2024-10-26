import React from "react";
import { cookies } from "next/headers";
import { CombinedNav } from "@/components/course/combinedNav";
import { revalidatePath } from "next/cache";

const getMyRoadmapOutline = async (id: string) => {
  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/getTopicsById/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
        cache: "no-store", // Disable caching to always get fresh data
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch roadmap data");
    }

    return response.json();
  } catch (error) {
    console.error("Error getting roadmap:", error);
    throw error;
  }
};

// Server action for updating subtopic completion
async function updateSubtopicProgress(
  roadmapId: number,
  topicId: number,
  subtopicId: number,
  newStatus: string
) {
  "use server";

  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/updateSubtopicCompletion`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authorization}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roadmapId,
          topicId,
          subtopicId,
          newStatus,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update progress");
    }

    // Revalidate the current path to refresh the data
    revalidatePath(`/roadmap/${roadmapId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string; slug: string };
}>) {
  const myroadmapOutline = await getMyRoadmapOutline(params.id);

  const courseData = {
    ...myroadmapOutline?.data,
    subtopics: {
      completed: true,
    },
  };

  return (
    <div className="flex flex-col h-screen">
      <CombinedNav
        courseData={courseData}
        roadmapId={params.id}
        currentSubTopic={params.slug}
        updateSubtopicProgress={updateSubtopicProgress}
      >
        {children}
      </CombinedNav>
    </div>
  );
}
