import { cookies } from "next/headers";
import MarkdownRenderer from "@/components/markdownRenderer";
import GridCard from "@/components/gridCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SideNav from "@/components/sideNav";
import MainNav from "@/components/mainNav";
import TabsComponent from "@/components/tabsComponent";
import { Metadata, ResolvingMetadata } from "next";
import { siteConfig } from "@/config/site";

type Props = {
  params: { id: string };
};

// Generate metadata for the roadmap page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Reuse the existing fetch function to get roadmap data
  const roadmapData = await getMyRoadmap(params.id);

  // Construct time to complete string
  const timeToComplete = roadmapData?.data?.approximateTime
    ? `${roadmapData.data.approximateTime} hours`
    : "Variable duration";

  // Format the module count string
  const moduleInfo = `${roadmapData?.data?.topicCount || 0} modules, ${
    roadmapData?.data?.subtopicCount || 0
  } subtopics`;

  return {
    title: `${roadmapData?.data?.roadmap?.name || "Learning Roadmap"}`,
    description:
      roadmapData?.data?.roadmap?.description ||
      "Explore this comprehensive learning roadmap",

    // OpenGraph metadata for social sharing
    openGraph: {
      title: roadmapData?.data?.roadmap?.name,
      description: roadmapData?.data?.roadmap?.description,
      type: "article",
      authors: ["YourSiteName"],
      publishedTime: roadmapData?.data?.roadmap?.createdAt,
      modifiedTime: roadmapData?.data?.roadmap?.updatedAt,
    },

    // Twitter card metadata
    twitter: {
      card: "summary_large_image",
      title: roadmapData?.data?.roadmap?.name,
      description: roadmapData?.data?.roadmap?.description,
    },

    // Additional metadata
    keywords: [
      "learning roadmap",
      "online course",
      roadmapData?.data?.roadmap?.name,
      "education",
      "learning path",
    ].filter(Boolean),

    // Other metadata properties
    other: {
      "course:modules": moduleInfo,
      "course:duration": timeToComplete,
      "course:level": roadmapData?.data?.roadmap?.level || "All levels",
    },

    // Robots metadata
    robots: {
      index: true,
      follow: true,
    },
  };
}

const getMyRoadmap = async (id: string) => {
  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/getById/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    console.log("response in the getMyRoadmap fun:", response);

    return response.json();
  } catch (error) {
    console.error("Error getting roadmap:", error);
    throw error;
  }
};

export default async function RoadmapPage({
  params,
}: {
  params: { id: string };
}) {
  console.log("params", params);

  const myroadmap = await getMyRoadmap(params.id);
  console.log("roadmap", myroadmap);
  console.log("roadmap Desc", myroadmap?.roadmap?.description);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideNav
        items={[
          {
            href: "/home",
            icon: "home",
            title: "Home",
          },
          {
            href: "/library",
            icon: "library",
            title: "Library",
          },
          {
            href: "/templates",
            icon: "template",
            title: "Templates",
            badge: 6,
          },
        ]}
        key={0}
      />
      <div className="flex flex-col">
        <MainNav
          items={[
            {
              href: "/home",
              icon: "home",
              title: "Home",
            },
            {
              href: "/library",
              icon: "library",
              title: "Library",
            },
            {
              href: "/templates",
              icon: "template",
              title: "Templates",
              badge: 6,
            },
          ]}
          key={1}
          breadcrumbs={[
            {
              href: "/library",
              title: "Library",
            },
            {
              href: ``,
              title: myroadmap?.data?.roadmap?.name,
            },
          ]}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl border-b pb-5 mb-3">
            {myroadmap?.data?.roadmap?.name}
          </h1>
          <MarkdownRenderer markdown={myroadmap?.data?.roadmap?.description} />
          {/* make a little gap */}
          <div className="mb-3"></div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">
            Roadmap Details
          </h4>
          <GridCard
            cardData={[
              {
                title: "Modules",
                number: myroadmap?.data?.topicCount,
                subtitle: `${myroadmap?.data?.subtopicCount} subtopics`,
              },
              {
                title: "Approximate Time to Complete",
                number: myroadmap?.data?.approximateTime,
                subtitle: "hours",
              },
              {
                title: "Created At",
                number: new Date(
                  myroadmap?.data?.roadmap?.createdAt
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              },
              {
                title: "Updated At",
                number: new Date(
                  myroadmap?.data?.roadmap?.updatedAt
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              },
            ]}
          />
          <div className="mb-5"></div>

          <Link
            href={`/course/${params?.id}/start/${myroadmap?.data?.initialSubtopic}`}
          >
            <Button>Start Learning</Button>
          </Link>
          <div className="mb-5"></div>
          <TabsComponent
            markdown={myroadmap?.data?.roadmap?.markdown}
          ></TabsComponent>
        </main>
      </div>
    </div>
  );
}
