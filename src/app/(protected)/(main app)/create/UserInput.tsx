"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  Loader2,
  Info,
  BookOpen,
  Target,
  Map,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { io, Socket } from "socket.io-client";

// Type Definitions
interface RoadmapStage {
  name: string;
  tooltip: string;
  threshold: number;
  icon: React.ReactNode;
}

interface RoadmapResponse {
  message: string;
  roadmap?: {
    name: string;
    id: number;
    content?: string;
  };
  roadmapExists: boolean;
}

interface SocketProgressData {
  progress: number;
}

// Stages Configuration
const STAGES: RoadmapStage[] = [
  {
    name: "Starting roadmap creation",
    tooltip: "Initializing the roadmap creation process",
    threshold: 0,
    icon: <Target className="h-4 w-4" />,
  },
  {
    name: "Checking existing roadmaps",
    tooltip: "Comparing your goals with existing roadmaps",
    threshold: 10,
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    name: "Generating roadmap structure",
    tooltip: "Creating a personalized learning path",
    threshold: 20,
    icon: <Map className="h-4 w-4" />,
  },
  {
    name: "Converting roadmap to Markdown",
    tooltip: "Formatting your roadmap for easy reading",
    threshold: 30,
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    name: "Generating course information",
    tooltip: "Gathering relevant course details",
    threshold: 40,
    icon: <Info className="h-4 w-4" />,
  },
  {
    name: "Generating course name",
    tooltip: "Creating a unique name for your learning journey",
    threshold: 50,
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    name: "Saving roadmap to database",
    tooltip: "Securely storing your personalized roadmap",
    threshold: 70,
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    name: "Populating initial content",
    tooltip: "Adding starter content to your roadmap",
    threshold: 75,
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    name: "Roadmap creation complete",
    tooltip: "Your personalized learning path is ready!",
    threshold: 100,
    icon: <Target className="h-4 w-4" />,
  },
];

export default function RoadmapCreationComponent() {
  // State Management
  const [goal, setGoal] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [roadmapResponse, setRoadmapResponse] =
    useState<RoadmapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Memoized Confetti Effect
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  // Memoized Confetti Effect on Completion
  useEffect(() => {
    if (progress === 100) {
      triggerConfetti();
    }
  }, [progress, triggerConfetti]);

  // Memoized Socket Connection Handler
  const setupSocketConnection = useCallback(() => {
    const authorization = document?.cookie
      ?.split(";")
      .find((cookie) => cookie.includes("jwtToken"))
      ?.split("=")[1];

    const newSocket = io(process.env.WEB_SOCKET_URL, {
      auth: { token: `Bearer ${authorization}` },
      withCredentials: true,
    });

    newSocket.on("roadmapProgress", (data: SocketProgressData) => {
      setProgress(data.progress);
      const stageIndex = STAGES.findLastIndex(
        (stage) => data.progress >= stage.threshold
      );
      setCurrentStage(stageIndex);
    });

    newSocket.on("roadmapComplete", (data: RoadmapResponse) => {
      setProgress(100);
      setRoadmapResponse(data);
      setIsCreating(false);
      newSocket.disconnect();
    });

    newSocket.on("roadmapExists", (data: RoadmapResponse) => {
      setProgress(100);
      setRoadmapResponse(data);
      setIsCreating(false);
      newSocket.disconnect();
    });

    newSocket.on("roadmapError", (data: { message: string }) => {
      console.error("Error:", data.message);
      setError(data.message || "An unexpected error occurred");
      setIsCreating(false);
      newSocket.disconnect();
    });

    setSocket(newSocket);
    return newSocket;
  }, []);

  // Memoized Roadmap Creation Handler
  const handleCreate = useCallback(() => {
    if (!goal.trim() || isCreating) return;

    try {
      setError(null);
      setRoadmapResponse(null);
      setIsCreating(true);

      // Cleanup previous socket if exists
      socket?.disconnect();

      // Setup new socket connection
      const newSocket = setupSocketConnection();
      newSocket.emit("createRoadmap", { prompt: goal });
    } catch (error) {
      console.error("Error creating roadmap:", error);
      setError("An unexpected error occurred");
      setIsCreating(false);
    }
  }, [goal, isCreating, socket, setupSocketConnection]);

  // Memoized Reset Form Handler
  const handleReset = useCallback(() => {
    setGoal("");
    setProgress(0);
    setCurrentStage(0);
    setRoadmapResponse(null);
    setError(null);
  }, []);

  // Memoized Current Stage Calculation
  const currentStageName = useMemo(
    () =>
      currentStage >= 0 && currentStage < STAGES.length
        ? STAGES[currentStage].name
        : "",
    [currentStage]
  );

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <p className="text-red-700 font-semibold">
                Roadmap Creation Failed
              </p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {!roadmapResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="text-center space-y-2 md:space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  Let's Plan Your Learning Journey Together! ✨
                </h1>
                <p className="text-sm sm:text-md lg:text-lg text-muted-foreground">
                  Tell us what you'd love to learn, and we'll help you get there
                  step by step.
                </p>
              </div>

              {isCreating ? (
                <>
                  <div className="relative">
                    <Textarea
                      placeholder="What do you want to learn? Be as specific as you'd like about your goals, interests, and current skill level."
                      value={goal}
                      minLength={5}
                      disabled
                      className="w-full h-40 text-base sm:text-lg p-4 rounded-lg resize-none opacity-50 cursor-not-allowed"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-white/80 px-4 py-2 rounded-full text-primary font-semibold">
                        {currentStageName}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    placeholder="What do you want to learn? Be as specific as you'd like about your goals, interests, and current skill level."
                    value={goal}
                    minLength={5}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full h-40 text-base sm:text-lg p-4 rounded-lg resize-none"
                  />
                  <Button
                    onClick={handleCreate}
                    disabled={!goal.trim()}
                    className="w-full text-base sm:text-sm py-4"
                  >
                    Create My Learning Roadmap
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Stages */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 mb-4 space-y-8"
            >
              <div className="flex items-center space-x-4">
                <Progress
                  value={progress}
                  className="w-full h-2.5 rounded-full flex-grow"
                />
                <div className="text-sm font-medium text-muted-foreground">
                  {progress}%
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {STAGES.map((stage, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`
                            flex items-center
                            min-h-[4rem]
                            px-4 py-3
                            rounded-lg
                            transition-colors duration-200
                            ${
                              index <= currentStage
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {index < currentStage ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : index === currentStage ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <div className="h-5 w-5 flex items-center justify-center">
                                  {stage.icon}
                                </div>
                              )}
                            </div>
                            <span className="text-[15px] font-medium leading-tight">
                              {stage.name}
                            </span>
                          </div>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent className="px-3 py-1.5">
                        <p className="text-sm">{stage.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roadmap Response View */}
        {roadmapResponse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 md:mt-12 p-6 md:p-8 space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {roadmapResponse.roadmapExists
                  ? "Personalized Learning Path Found"
                  : "Your Custom Learning Roadmap"}
              </h2>
              <p className="text-muted-foreground mb-6 text-sm md:text-base">
                {roadmapResponse.message}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-primary mb-3">
                  Course Overview
                </h3>
                {roadmapResponse.roadmap?.name ? (
                  <div>
                    <p className="text-sm font-normal">
                      {roadmapResponse.roadmap.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No specific name generated
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-primary mb-3">
                  Learning Goal
                </h3>
                <p className="italic text-muted-foreground">{goal}</p>
              </div>
            </div>

            {roadmapResponse.roadmap?.content && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-primary mb-3">
                  Roadmap Details
                </h3>
                <pre className="bg-white p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">
                  {roadmapResponse.roadmap.content}
                </pre>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              {roadmapResponse.roadmap?.id && (
                <Link href={`/course/${roadmapResponse.roadmap.id}`}>
                  <Button>View Roadmap</Button>
                </Link>
              )}
              <Button variant="secondary" onClick={handleReset}>
                Create Another Roadmap
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
