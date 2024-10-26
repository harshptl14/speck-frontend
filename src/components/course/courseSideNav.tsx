"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Icons } from "../icon";
import { Checkbox } from "../ui/checkbox";

type ProgressStatus = {
  id: number;
  userId: number;
  roadmapId: number;
  topicId: number;
  subtopicId: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
};

type SubTopic = {
  id: number;
  name: string;
  progress: ProgressStatus[];
};

type Topic = {
  name: string;
  id: number;
  subtopics: SubTopic[];
};

type CourseData = {
  roadmap: {
    name: string;
  };
  topics: Topic[];
};

interface CourseSideNavProps {
  className?: string;
  courseData: CourseData;
  currentTopicId?: string;
  currentSubTopic?: string;
  searchQuery?: string;
  onSubtopicComplete: (
    topicId: number,
    subtopicId: number,
    status: ProgressStatus["status"]
  ) => Promise<boolean>;
}

export default function CourseSideNav({
  className,
  courseData,
  currentTopicId,
  currentSubTopic,
  searchQuery = "",
  onSubtopicComplete,
}: CourseSideNavProps) {
  const [completionStatus, setCompletionStatus] = useState<
    Record<number, boolean>
  >({});
  const [loadingStatus, setLoadingStatus] = useState<Record<number, boolean>>(
    {}
  );
  const { toast } = useToast();

  // Initialize completion status from course data
  useEffect(() => {
    const initialStatus: Record<number, boolean> = {};
    courseData.topics.forEach((topic) => {
      topic.subtopics.forEach((subtopic) => {
        initialStatus[subtopic.id] = subtopic.progress.some(
          (p) => p.status === "COMPLETED"
        );
      });
    });
    setCompletionStatus(initialStatus);
  }, [courseData]);

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return courseData.topics;

    const query = searchQuery.toLowerCase();
    return courseData.topics.filter((topic) => {
      const topicMatch = topic.name.toLowerCase().includes(query);
      const subtopicMatch = topic.subtopics.some((subtopic) =>
        subtopic.name.toLowerCase().includes(query)
      );
      return topicMatch || subtopicMatch;
    });
  }, [courseData.topics, searchQuery]);

  const handleSubtopicToggle = useCallback(
    async (topicId: number, subtopicId: number, currentStatus: boolean) => {
      const newStatus = currentStatus ? "NOT_STARTED" : "COMPLETED";
      setLoadingStatus((prev) => ({ ...prev, [subtopicId]: true }));

      try {
        const success = await onSubtopicComplete(
          topicId,
          subtopicId,
          newStatus
        );
        if (success) {
          setCompletionStatus((prev) => ({
            ...prev,
            [subtopicId]: !currentStatus,
          }));
          toast({
            title:
              newStatus === "COMPLETED" ? "Topic completed" : "Progress reset",
            description: "Your progress has been updated successfully.",
          });
        } else {
          throw new Error("Failed to update progress");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update progress. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingStatus((prev) => ({ ...prev, [subtopicId]: false }));
      }
    },
    [onSubtopicComplete, toast]
  );

  const calculateTopicProgress = useCallback(
    (subtopics: SubTopic[]) => {
      const completedCount = subtopics.filter(
        (subtopic) => completionStatus[subtopic.id]
      ).length;
      return (completedCount / subtopics.length) * 100;
    },
    [completionStatus]
  );

  if (!courseData.topics.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No topics available
      </div>
    );
  }

  const ChevronRight = Icons["chevronRight"];
  const ChevronDown = Icons["chevronDown"];

  return (
    <SidebarContent className="gap-0">
      {filteredTopics.map((topic) => {
        const completedSubtopics = topic.subtopics.filter(
          (st) => st.progress[0].status === "COMPLETED"
        ).length;
        const totalSubtopics = topic.subtopics.length;
        return (
          <Collapsible
            key={topic.id}
            defaultOpen={topic.id.toString() === currentTopicId?.toString()}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-1 text-start"
                asChild
              >
                <CollapsibleTrigger>
                  <span>{topic.name} </span>
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {topic.subtopics.map((subtopic) => {
                      const isCompleted = completionStatus[subtopic.id];
                      const isLoading = loadingStatus[subtopic.id];
                      const isActive =
                        subtopic.id.toString() === currentSubTopic;

                      return (
                        <SidebarMenuItem key={subtopic.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            size={"md"}
                          >
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Checkbox
                                      // className="size-6 shrink-0"
                                      onCheckedChange={() =>
                                        handleSubtopicToggle(
                                          topic.id,
                                          subtopic.id,
                                          isCompleted
                                        )
                                      }
                                      checked={
                                        subtopic.progress[0].status ===
                                        "COMPLETED"
                                      }
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                        <Loader2 className="size-4 animate-spin" />
                                      ) : isCompleted ? (
                                        <CheckCircle className="size-4 text-primary" />
                                      ) : (
                                        <Circle className="size-4 text-muted-foreground" />
                                      )}
                                      <span className="sr-only">
                                        {isCompleted
                                          ? "Mark as incomplete"
                                          : "Mark as complete"}
                                      </span>
                                    </Checkbox>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {isCompleted
                                        ? "Mark as incomplete"
                                        : "Mark as complete"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Link href={`${subtopic.id}`}>
                                {subtopic.name}
                              </Link>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        );
      })}
    </SidebarContent>
  );
}
