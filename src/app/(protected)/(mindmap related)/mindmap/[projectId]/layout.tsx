import type React from "react"
import MindmapNav from "@/components/markmap/mindmapNav"
import { cookies } from "next/headers"


const getMindmapDetails = async (id: string) => {
  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/mindmap/${id}`,
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

export default async function MainLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { projectId: string};
}>) {

  const mindmapDetails = await getMindmapDetails(params.projectId)

  return (
    <div className="h-screen flex flex-col bg-background">
      <MindmapNav title={mindmapDetails.mindmap.title} />
      <main className="flex-1 container mx-auto px-0">{children}</main>
    </div>
  )
}
