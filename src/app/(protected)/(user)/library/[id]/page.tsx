import { cookies } from "next/headers";
// import { remark } from "remark";
// import html from "remark-html";
import MarkdownRenderer from "@/components/markdownRenderer";
import GridCard from "@/components/gridCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

    return response.json();
  } catch (error) {
    console.error("Error getting roadmap:", error);
    throw error;
  }
};

// const mdToHtml = async (md: string) => {
//   const result = await remark().use(html).process(md);
//   return result.toString();
// };

export default async function RoadmapPage({
  params,
}: {
  params: { id: string };
}) {
  const myroadmap = await getMyRoadmap(params.id);
  // const markdownContent = await mdToHtml(myroadmap?.roadmap?.markdown);
  console.log("roadmap", myroadmap);
  console.log("roadmap Desc", myroadmap?.roadmap?.description);

  return (
    <div>
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

      <Link href={`/library/${params?.id}/start`}>
        <Button>Start Learning</Button>
      </Link>
      <div className="mb-5"></div>

      <MarkdownRenderer markdown={myroadmap?.data?.roadmap?.markdown} />
    </div>
  );
}
