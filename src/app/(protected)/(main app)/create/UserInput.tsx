"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  CheckCircle2,
  Loader2,
  Info,
  BookOpen,
  Target,
  Map,
  Sparkles,
  AlertCircle,
  RouteIcon,
  ExternalLink,
  Plus,
} from "lucide-react"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { io, type Socket } from "socket.io-client"

// Type Definitions
interface RoadmapStage {
  name: string
  tooltip: string
  threshold: number
  icon: React.ReactNode
}

interface RoadmapResponse {
  message: string
  roadmap?: {
    name: string
    id: number
    content?: string
  }
  roadmapExists: boolean
}

interface SocketProgressData {
  progress: number
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
]

export default function RoadmapCreationComponent() {
  // State Management
  const [goal, setGoal] = useState<string>("")
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [currentStage, setCurrentStage] = useState<number>(0)
  const [roadmapResponse, setRoadmapResponse] = useState<RoadmapResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const charCount = goal.length

  // Memoized Confetti Effect
  const triggerConfetti = useCallback(() => {
    const duration = 2000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }, [])

  // Memoized Confetti Effect on Completion
  useEffect(() => {
    if (progress === 100) {
      triggerConfetti()
    }
  }, [progress, triggerConfetti])

  // Memoized Socket Connection Handler
  const setupSocketConnection = useCallback(() => {
    const authorization = document?.cookie
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("jwtToken="))
      ?.split("=")[1]

    if (!authorization) {
      setError("Please log in to create a roadmap")
      setIsCreating(false)
      return null
    }

    const newSocket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "https://api.speck.ing", {
      auth: { token: `Bearer ${authorization}` },
      path: "/socket",
      transports: ["websocket", "polling"],
      withCredentials: true,
    })

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server")
    })

    newSocket.on("connect_error", (error) => {
      console.error("Socket.IO connect error:", error.message)
      if (error.message.includes("Authentication error")) {
        setError("Session expired. Please log in again.")
        setIsCreating(false)
        newSocket.disconnect()
      }
    })

    newSocket.on("roadmapProgress", (data: SocketProgressData) => {
      console.log("Roadmap progress:", data)
      setProgress(data.progress)
      const stageIndex = STAGES.findLastIndex((stage) => data.progress >= stage.threshold)
      setCurrentStage(stageIndex)
    })

    newSocket.on("roadmapComplete", (data: RoadmapResponse) => {
      console.log("Roadmap complete:", data)
      setProgress(100)
      setRoadmapResponse(data)
      setIsCreating(false)
      newSocket.disconnect()
    })

    newSocket.on("roadmapExists", (data: RoadmapResponse) => {
      console.log("Roadmap exists:", data)
      setProgress(100)
      setRoadmapResponse(data)
      setIsCreating(false)
      newSocket.disconnect()
    })

    newSocket.on("roadmapError", (data: { message: string }) => {
      console.error("Roadmap error:", data.message)
      setError(data.message || "An unexpected error occurred")
      setIsCreating(false)
      newSocket.disconnect()
    })

    setSocket(newSocket)
    return newSocket
  }, [])

  // Memoized Roadmap Creation Handler
  const handleCreate = useCallback(() => {
    if (!goal.trim() || isCreating) return

    try {
      setError(null)
      setRoadmapResponse(null)
      setIsCreating(true)

      // Cleanup previous socket if exists
      socket?.disconnect()

      // Setup new socket connection
      const newSocket = setupSocketConnection()
      if (!newSocket) return // Stop if socket setup failed (e.g., no token)

      newSocket.emit("createRoadmap", { prompt: goal })
    } catch (error) {
      console.error("Error creating roadmap:", error)
      setError("An unexpected error occurred")
      setIsCreating(false)
    }
  }, [goal, isCreating, socket, setupSocketConnection])

  // Memoized Reset Form Handler
  const handleReset = useCallback(() => {
    setGoal("")
    setProgress(0)
    setCurrentStage(0)
    setRoadmapResponse(null)
    setError(null)
  }, [])

  // Memoized Current Stage Calculation
  const currentStageName = useMemo(
    () => (currentStage >= 0 && currentStage < STAGES.length ? STAGES[currentStage].name : ""),
    [currentStage],
  )

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isCreating && goal.trim()) {
        handleCreate()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleCreate, isCreating, goal])

  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!roadmapResponse ? (
          <motion.div
            key="creation-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl mx-auto px-4 py-6"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <RouteIcon className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-medium tracking-tight">Roadmap Creator</h1>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                Let's plan your learning journey together! Tell us what you'd love to learn, and we'll help you get
                there step by step.
              </p>
            </div>

            {/* Error Alert Area */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-4"
                  role="alert"
                  aria-live="polite"
                >
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {isCreating ? (
              <>
                <div className="relative mb-4">
                  <Textarea
                    placeholder="What do you want to learn? Be as specific as you'd like about your goals, interests, and current skill level."
                    value={goal}
                    minLength={5}
                    disabled
                    className="w-full h-40 text-base sm:text-sm p-4 rounded-lg resize-none opacity-50 cursor-not-allowed"
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
                <div className="relative mb-4">
                  <Textarea
                    placeholder="What do you want to learn? Be as specific as you'd like about your goals, interests, and current skill level."
                    value={goal}
                    minLength={5}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full resize-none min-h-[320px] text-base p-4 border-border/40 bg-background/80 focus-visible:ring-1"
                  />
                  <div
                    id="char-count"
                    className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/90 px-2 py-0.5 rounded"
                  >
                    {charCount} character{charCount !== 1 ? "s" : ""}
                  </div>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={!goal.trim()}
                  className="w-full h-11 text-base font-medium relative overflow-hidden bg-neutral-600 hover:bg-neutral-700"
                >
                  Create My Learning Roadmap
                </Button>
                <div className="mt-2 text-center text-xs text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 bg-muted rounded border border-border/40 mx-0.5">Ctrl</kbd> +{" "}
                  <kbd className="px-1 py-0.5 bg-muted rounded border border-border/40 mx-0.5">Enter</kbd> to create
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl mx-auto px-4 py-6"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <RouteIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-medium tracking-tight">
                  {roadmapResponse.roadmapExists ? "Personalized Learning Path Found" : "Your Custom Learning Roadmap"}
                </h1>
              </div>
              <p className="text-muted-foreground text-sm">{roadmapResponse.message}</p>
            </div>

            <div className="mb-6 p-6 bg-muted/10 rounded-lg border border-border/30">
              <h2 className="text-xl font-medium mb-2">{roadmapResponse.roadmap?.name || "Your Learning Journey"}</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your roadmap has been created and is ready to explore.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {roadmapResponse.roadmap?.id && (
                  <Button className="flex-1 gap-2 h-10 bg-neutral-600 hover:bg-neutral-700" asChild>
                    <Link href={`/course/${roadmapResponse.roadmap.id}`}>
                      <RouteIcon className="h-4 w-4" />
                      View Roadmap
                      <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                    </Link>
                  </Button>
                )}

                <Button variant="outline" className="flex-1 gap-2 h-10 border-neutral-300" onClick={handleReset}>
                  <Plus className="h-4 w-4" />
                  Create New Roadmap
                </Button>
              </div>
            </div>

            {roadmapResponse.roadmap?.content && (
              <div className="bg-muted/5 p-4 rounded-lg border border-border/20">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Roadmap Preview
                </h3>
                <div className="max-h-[150px] overflow-y-auto p-3 bg-background/50 rounded border border-border/10 text-xs font-mono">
                  {roadmapResponse.roadmap.content.substring(0, 300)}
                  {roadmapResponse.roadmap.content.length > 300 && "..."}
                </div>
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
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl mx-auto px-4 py-6 mt-4"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Progress value={progress} className="w-full h-2.5 rounded-full flex-grow" />
              <div className="text-sm font-medium text-muted-foreground">{progress}%</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          ${index <= currentStage ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {index < currentStage ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : index === currentStage ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <div className="h-5 w-5 flex items-center justify-center">{stage.icon}</div>
                            )}
                          </div>
                          <span className="text-[15px] font-medium leading-tight">{stage.name}</span>
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
    </div>
  )
}
