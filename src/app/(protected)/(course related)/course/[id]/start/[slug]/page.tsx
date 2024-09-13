import VideoView from "@/components/course/videoView";
import LinkView from "@/components/course/linkView";

import MarkdownRenderer from "@/components/markdownRenderer";
import { cookies } from "next/headers";
import React from "react";

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
  console.log("params", params);
  const subtopicData = await getSubtopicData(params.slug);
  console.log("subtopicData in page", subtopicData);

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl border-b pb-5 mb-3">
        {subtopicData?.data?.subtopic?.name}
      </h1>

      <MarkdownRenderer
        markdown={subtopicData?.data?.subtopic?.textContents[0]?.content}
      />

      {/* Shorts Video section */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        Related YouTube Shorts
      </h2>
      <VideoView videoData={subtopicData?.data?.shortsVideoContents} />

      {/* Video section */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        Related YouTube Videos
      </h2>
      <VideoView videoData={subtopicData?.data?.normalVideoContents} />

      {/* Links section */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Useful Links</h2>
      <LinkView linkData={linkData} />
    </div>
  );
};

export default StartRoadmap;
