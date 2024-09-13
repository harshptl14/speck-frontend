import React from "react";
import { cookies } from "next/headers";
import CombinedNav from "@/components/course/combinedNav";

const getMyRoadmapOutline = async (id: string) => {
  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/getTopicsById/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    return response.json();
  } catch (error) {
    console.error("Error getting roadmap:", error);
    throw error;
  }
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string; slug: string };
}>) {
  const myroadmapOutline = await getMyRoadmapOutline(params.id);
  return (
    <>
      <div className="flex flex-col h-screen">
        <CombinedNav
          courseData={myroadmapOutline?.data}
          currentTopic={params?.id}
          currentSubTopic={params?.slug}
          roadmapName={myroadmapOutline?.data?.roadmap?.name}
        >
          {children}
        </CombinedNav>
      </div>
    </>
  );
}
