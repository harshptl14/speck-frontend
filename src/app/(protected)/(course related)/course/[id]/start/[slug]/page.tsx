import { cookies } from "next/headers";
import React from "react";
import { Metadata } from "next";
import Generate from "./generate";
import VideoView from "@/components/course/videoView";
import LinkView from "@/components/course/linkView";
import MarkdownRenderer from "@/components/markdownRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// export const metadata: Metadata = {
//   title: "Roadmap | Learn Programming",
//   description: "Start your programming journey with our interactive roadmap",
// };

const linkData = [
  {
    title: "C++ Reference",
    url: "https://en.cppreference.com/w/",
    description: "Comprehensive C++ language and standard library reference",
  },
  {
    title: "C++ Standard Library",
    url: "https://en.cppreference.com/w/cpp/header",
    description: "Detailed information about the C++ Standard Library",
  },
  {
    title: "C++ Core Guidelines",
    url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines",
    description:
      "A set of tried-and-true guidelines, rules, and best practices about coding in C++",
  },
  {
    title: "C++ Compiler Explorer",
    url: "https://godbolt.org/",
    description:
      "Online compiler to explore C++ code compilation and assembly output",
  },
];

const getSubtopicData = async (id: string) => {
  const authorization = cookies().get("jwtToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/getSubTopicById/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error getting roadmap:", error);
    throw error;
  }
};

export const StartRoadmap = async ({
  params,
}: {
  params: { id: string; slug: string };
}) => {
  const subtopicData = await getSubtopicData(params.slug);

  return (
    <main className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-primary">
        {/* <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl border-b pb-5 mb-3"> */}
        {subtopicData?.data?.subtopic?.name || (
          <Skeleton className="h-12 w-3/4 mb-4" />
        )}
      </h1>
      {subtopicData?.data?.subtopic?.textContents.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Content Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Content Generation Required</AlertTitle>
              <AlertDescription>
                The content for this subtopic hasn't been generated yet. Click
                the button below to start the generation process.
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Generate subtopicId={params?.slug} roadmapId={params?.id} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12">
          <MarkdownRenderer
            markdown={subtopicData?.data?.subtopic?.textContents[0]?.content}
          />
          {/* Shorts Video section */}
          {/* <h2 className="mb-4 mt-8 text-2xl font-semibold">
            Related YouTube Shorts
          </h2> */}
          {subtopicData?.data?.shortsVideoContents.length > 0 ? (
            <VideoView videoData={subtopicData?.data?.shortsVideoContents} />
          ) : (
            <></>
          )}
          {/* Video section */}
          {/* <h2 className="mb-4 mt-8 text-2xl font-semibold">
            Related YouTube Videos
          </h2> */}

          {subtopicData?.data?.normalVideoContents.length > 0 ? (
            <VideoView videoData={subtopicData?.data?.normalVideoContents} />
          ) : (
            <></>
          )}
          {/* Links section */}
          {/* <h2 className="mt-8 text-2xl font-semibold">Useful Links</h2> */}
          <LinkView linkData={linkData} />
        </div>
      )}
    </main>
  );
};

export default StartRoadmap;
