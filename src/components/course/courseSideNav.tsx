"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

import React, { useState } from "react";
import { Icons } from "../icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface courseNavProps {
  className?: string;
  courseData: {
    topics: {
      name: string;
      id: number;
      subtopics: {
        id: number;
        name: string;
      }[];
    }[];
  };
  currentTopic?: string;
  currentSubTopic?: string;
}

function findTopicIdBySubtopicId(
  subtopicId: number,
  courseData: courseNavProps["courseData"]
): number | null {
  for (const topic of courseData.topics) {
    const foundSubtopic = topic.subtopics.find(
      (subtopic) => subtopic.id === subtopicId
    );
    if (foundSubtopic) {
      return topic.id;
    }
  }
  return null; // Return null if no matching subtopic is found
}

export const CourseSideNav = ({
  className = "",
  courseData,
  currentTopic,
  currentSubTopic,
}: courseNavProps) => {
  const currentTopicId = findTopicIdBySubtopicId(
    Number(currentSubTopic),
    courseData
  );
  const [selectedSubtopic, setSelectedSubtopic] = useState(
    courseData.topics[0].subtopics[0]
  );
  const [openTopics, setOpenTopics] = useState<string[]>([
    currentTopicId?.toString() as string,
  ]);

  const toggleTopic = (topicName: string) => {
    console.log(openTopics);

    setOpenTopics((prev) =>
      prev.includes(topicName)
        ? prev.filter((t) => t !== topicName)
        : [...prev, topicName]
    );
  };

  const ChevronRight = Icons["chevronRight"];
  const ChevronDown = Icons["chevronDown"];
  const path = usePathname();

  return (
    <ScrollArea className={`h-[calc(100vh-4rem)] ${className}`}>
      <div className="space-y-2 p-4">
        {courseData.topics.map((topic) => (
          <Collapsible
            key={topic.name}
            open={openTopics.includes(topic?.id.toString())}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between font-normal text-left p-2 h-auto"
                onClick={() => {
                  toggleTopic(topic?.id.toString());
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="mr-2 text-left break-words">
                    {topic.name}
                  </span>
                  <span className="flex-shrink-0">
                    {openTopics.includes(topic?.id?.toString()) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {topic.subtopics.map((subtopic) => (
                <Link
                  key={subtopic?.id}
                  href={subtopic?.id.toString()}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-3 py-2 m-1 transition-all hover:text-primary text-sm w-full justify-start pl-6",
                    currentSubTopic === subtopic?.id.toString()
                      ? "bg-muted"
                      : "text-muted-foreground"
                  )}
                >
                  <span>{subtopic?.name}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  );
};
