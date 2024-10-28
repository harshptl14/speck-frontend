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

// New function to create a favorite
async function createFavorite(roadmapId: number) {
  "use server";

  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/createFavorite/${roadmapId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add roadmap to favorites");
    }

    // Revalidate the current path to refresh the data
    revalidatePath(`/roadmap/${roadmapId}`);

    return { success: true, message: "Roadmap added to favorites" };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
}

// New function to remove a favorite
async function removeFavorite(roadmapId: number) {
  "use server";

  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/removeFavorite/${roadmapId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove roadmap from favorites");
    }

    // Revalidate the current path to refresh the data
    revalidatePath(`/roadmap/${roadmapId}`);

    return { success: true, message: "Roadmap removed from favorites" };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
}

// New function to get user favorites
async function getUserFavorites() {
  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/userFavorites`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
        cache: "no-store", // Disable caching to always get fresh data
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user favorites");
    }

    return response.json();
  } catch (error) {
    console.error("Error getting user favorites:", error);
    throw error;
  }
}

// New function to reset roadmap progress
async function resetRoadmapProgress(roadmapId: string, subtopicId: string) {
  "use server";

  console.log("in reset progress", roadmapId, subtopicId);

  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/resetRoadmapProgress`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authorization}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roadmapId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reset roadmap progress");
    }

    revalidatePath(`/roadmap/${roadmapId}`);
    // Revalidate the current path to refresh the data
    // revalidatePath(`/course/${roadmapId}/start/${subtopicId}`);

    return { success: true, message: "Roadmap progress reset successfully" };
  } catch (error) {
    console.error("Error resetting roadmap progress:", error);
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
  const userFavorites = await getUserFavorites();

  const courseData = {
    ...myroadmapOutline?.data,
    subtopics: {
      completed: true,
    },
  };

  const isFavorite = userFavorites.favorites.some(
    (fav: any) => fav.roadmapId === parseInt(params.id)
  );

  return (
    <div className="flex flex-col h-screen">
      <CombinedNav
        courseData={courseData}
        roadmapId={params.id}
        currentSubTopic={params.slug}
        updateSubtopicProgress={updateSubtopicProgress}
        resetRoadmapProgress={resetRoadmapProgress}
        createFavorite={createFavorite}
        removeFavorite={removeFavorite}
        isFavorite={isFavorite}
      >
        {children}
      </CombinedNav>
    </div>
  );
}
