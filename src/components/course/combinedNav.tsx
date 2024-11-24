"use client";

type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type ProgressData = {
  id: number;
  userId: number;
  roadmapId: number;
  topicId: number;
  subtopicId: number;
  status: ProgressStatus;
  createdAt: string;
  updatedAt: string;
};

type SubTopic = {
  id: number;
  name: string;
  progress: ProgressData[];
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

import * as React from "react";
import { useState } from "react";
import { useCallback } from "react";
import {
  Activity,
  CheckCircle2,
  Circle,
  HelpCircle,
  MoreHorizontal,
  RotateCcw,
  Search,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import AppIcon from "../appIcon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CourseSideNav from "./courseSideNav";
import Link from "next/link";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "@radix-ui/react-progress";
import { Dialog, DialogContent } from "../ui/dialog";

interface CombinedNavProps {
  courseData: CourseData;
  roadmapId: string;
  currentSubTopic?: string;
  children: React.ReactNode;
  updateSubtopicProgress: (
    roadmapId: number,
    topicId: number,
    subtopicId: number,
    newStatus: ProgressStatus
  ) => Promise<{ success: boolean }>;
  createFavorite: (
    roadmapId: number
  ) => Promise<{ success: boolean; message: string }>;
  removeFavorite: (
    roadmapId: number
  ) => Promise<{ success: boolean; message: string }>;
  resetRoadmapProgress: (
    roadmapId: string,
    currentSubTopic: string
  ) => Promise<{ success: boolean; message: string }>;
  isFavorite: boolean;
}

export function CombinedNav({
  roadmapId,
  currentSubTopic,
  courseData,
  children,
  createFavorite,
  removeFavorite,
  updateSubtopicProgress,
  resetRoadmapProgress,
  isFavorite,
}: CombinedNavProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  const actions: { label: string; icon: LucideIcon; action: () => void }[][] = [
    [
      {
        label: "Your Progress",
        icon: Activity,
        action: () => {},
      },
      {
        label: "Reset Progress",
        icon: RotateCcw,
        action: () => {},
        // resetRoadmapProgress(roadmapId, currentSubTopic as string),
      },
    ],
  ];

  const handleSubtopicProgressChange = useCallback(
    async (
      topicId: number,
      subtopicId: number,
      newStatus: ProgressStatus
    ): Promise<boolean> => {
      try {
        await updateSubtopicProgress(
          Number(roadmapId),
          topicId,
          subtopicId,
          newStatus
        );
        return true;
      } catch (err) {
        console.error("Error updating subtopic progress:", err);
        return false;
      }
    },
    [roadmapId, updateSubtopicProgress]
  );

  function findTopicIdBySubtopicId(
    subtopicId: number,
    courseData: CourseData
  ): number | null {
    for (const topic of courseData.topics) {
      const foundSubtopic = topic.subtopics.find(
        (subtopic) => subtopic.id === subtopicId
      );
      if (foundSubtopic) {
        return topic.id;
      }
    }
    return null;
  }

  const currentTopicId = findTopicIdBySubtopicId(
    Number(currentSubTopic),
    courseData
  );

  const courseProgress = {
    roadmapName: courseData.roadmap.name,
    topics: courseData.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      subtopics: topic.subtopics.map((subtopic) => ({
        id: subtopic.id,
        name: subtopic.name,
        status: subtopic.progress[0]?.status || "NOT_STARTED",
      })),
    })),
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Link
              href="/"
              className="text-2xl font-bold flex items-center gap-1"
            >
              <div className="flex aspect-square size-13 p-1 items-center justify-center rounded-2xl text-sidebar-primary-foreground">
                <AppIcon width={35} height={35} />
              </div>
              <span className="font-bold text-lg">Speck</span>
            </Link>
          </SidebarMenuButton>
          <form>
            <SidebarGroup className="py-0">
              <SidebarGroupContent className="relative">
                <Label htmlFor="search" className="sr-only">
                  Search topics
                </Label>
                <SidebarInput
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics..."
                  className="pl-8"
                />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
              </SidebarGroupContent>
            </SidebarGroup>
          </form>
        </SidebarHeader>
        <CourseSideNav
          courseData={courseData}
          currentTopicId={currentTopicId?.toString()}
          currentSubTopic={currentSubTopic}
          searchQuery={searchQuery}
          onSubtopicComplete={handleSubtopicProgressChange}
          className="p-0"
        />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex justify-between sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <span className="flex gap-3 items-center">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/library"
                    className="text-muted-foreground hidden md:block"
                  >
                    Library
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/course/${roadmapId}`}
                    className="text-muted-foreground"
                  >
                    {courseData.roadmap.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {currentTopicId && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink className="text-muted-foreground">
                        {
                          courseData.topics.find(
                            (t) => t.id.toString() === currentTopicId.toString()
                          )?.name
                        }
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </span>
          <NavActions
            actions={actions}
            onProgressOpen={() => setIsProgressOpen(true)}
            createFavorite={createFavorite}
            removeFavorite={removeFavorite}
            resetRoadmapProgress={resetRoadmapProgress}
            initialIsFavorite={isFavorite}
            roadmapId={roadmapId}
            subtopicId={currentSubTopic as string}
          />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div>{children}</div>
        </main>
      </SidebarInset>
      <Dialog open={isProgressOpen} onOpenChange={setIsProgressOpen}>
        <DialogContent className="sm:max-w-[525px] p-10">
          <YourProgress courseProgress={courseProgress} />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

interface CourseProgressType {
  roadmapName: string;
  topics: {
    id: number;
    name: string;
    subtopics: {
      id: number;
      name: string;
      status: ProgressStatus;
    }[];
  }[];
}

export default function YourProgress({
  courseProgress,
}: {
  courseProgress: CourseProgressType;
}) {
  const calculateTopicProgress = (subtopics: { status: ProgressStatus }[]) => {
    const completed = subtopics.filter(
      (st) => st.status === "COMPLETED"
    ).length;
    return (completed / subtopics.length) * 100;
  };

  const calculateOverallProgress = (
    topics: { subtopics: { status: ProgressStatus }[] }[]
  ) => {
    const totalSubtopics = topics.reduce(
      (acc, topic) => acc + topic.subtopics.length,
      0
    );
    const completedSubtopics = topics.reduce(
      (acc, topic) =>
        acc + topic.subtopics.filter((st) => st.status === "COMPLETED").length,
      0
    );
    return (completedSubtopics / totalSubtopics) * 100;
  };

  const overallProgress = calculateOverallProgress(courseProgress.topics);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Your Progress
        </CardTitle>
        <CardDescription>{courseProgress.roadmapName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 mb-6">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-primary/10"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <circle
                className="text-primary"
                strokeWidth="10"
                strokeDasharray={283}
                strokeDashoffset={283 - (283 * overallProgress) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
            </svg>
            <Trophy className="absolute h-12 w-12 text-primary" />
          </div>
          <div className="text-3xl font-bold">
            {Math.round(overallProgress)}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">Overall Progress</p>
        </div>
        <div className="space-y-4">
          {courseProgress.topics.map((topic) => {
            const topicProgress = calculateTopicProgress(topic.subtopics);
            return (
              <div key={topic.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-medium text-sm max-w-80">
                    {topic.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(topicProgress)}%
                  </span>
                </div>
                <Progress value={topicProgress} className="w-full h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function NavActions({
  actions,
  onProgressOpen,
  resetRoadmapProgress,
  createFavorite,
  removeFavorite,
  initialIsFavorite,
  roadmapId,
  subtopicId,
}: {
  actions: {
    label: string;
    icon: LucideIcon;
    action: () => void;
  }[][];
  onProgressOpen: () => void;
  resetRoadmapProgress: (
    roadmapId: string,
    currentSubTopic: string
  ) => Promise<{ success: boolean; message: string }>;
  createFavorite: (
    roadmapId: number
  ) => Promise<{ success: boolean; message: string }>;
  removeFavorite: (
    roadmapId: number
  ) => Promise<{ success: boolean; message: string }>;
  initialIsFavorite: boolean;
  roadmapId: string;
  subtopicId: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(Number(roadmapId));
        setIsFavorite(false);
      } else {
        await createFavorite(Number(roadmapId));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // React.useEffect(() => {
  //   setIsOpen(true);
  // }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* <div className="hidden font-medium text-muted-foreground md:inline-block">
        Edit Oct 08
      </div> */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleFavoriteToggle}
        disabled={isLoading}
      >
        <Star className={isFavorite ? "text-primary fill-primary" : ""} />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {actions.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0 my-1">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton
                            onClick={() => {
                              if (item.label === "Your Progress") {
                                onProgressOpen();
                              }
                              if (item.label === "Reset Progress") {
                                resetRoadmapProgress(roadmapId, subtopicId);
                              } else {
                                item.action();
                              }
                              setIsOpen(false);
                            }}
                          >
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
