'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Loader2, Info } from 'lucide-react'
import confetti from 'canvas-confetti'
import { io, Socket } from 'socket.io-client'

interface RoadmapStage {
  progress: number
  message: string
}

export default function RoadmapCreator() {
  const [goal, setGoal] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)
  const [socket, setSocket] = useState<Socket | null>(null)

  const stages = [
    {
      name: 'Starting roadmap creation',
      tooltip: 'Initializing the roadmap creation process',
      threshold: 0
    },
    {
      name: 'Checking existing roadmaps',
      tooltip: 'Comparing your goals with existing roadmaps',
      threshold: 10
    },
    {
      name: 'Generating roadmap structure',
      tooltip: 'Creating a personalized learning path',
      threshold: 20
    },
    {
      name: 'Converting roadmap to Markdown',
      tooltip: 'Formatting your roadmap for easy reading',
      threshold: 30
    },
    {
      name: 'Generating course information',
      tooltip: 'Gathering relevant course details',
      threshold: 40
    },
    {
      name: 'Generating course name',
      tooltip: 'Creating a unique name for your learning journey',
      threshold: 50
    },
    {
      name: 'Saving roadmap to database',
      tooltip: 'Securely storing your personalized roadmap',
      threshold: 70
    },
    {
      name: 'Populating initial content',
      tooltip: 'Adding starter content to your roadmap',
      threshold: 75
    },
    {
      name: 'Roadmap creation complete',
      tooltip: 'Your personalized learning path is ready!',
      threshold: 100
    }
  ]

  useEffect(() => {
    if (progress === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [progress])

  const handleCreate = () => {
    if (!goal.trim() || isCreating) return;

    setIsCreating(true)
    const authorization = document?.cookie
      ?.split(";")
      .find((cookie) => cookie.includes("jwtToken"))
      ?.split("=")[1];

    const token = `Bearer ${authorization}`
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_API, {
      auth: {
        token: token,
      },
    })

    setSocket(newSocket)

    newSocket.emit('createRoadmap', { prompt: goal })

    newSocket.on('roadmapProgress', (data: RoadmapStage) => {
      setProgress(data.progress)
      const currentStageIndex = stages.findLastIndex(
        (stage, index) =>
          data.progress >= stage.threshold &&
          (index === stages.length - 1 || data.progress < stages[index + 1].threshold)
      )
      setCurrentStage(currentStageIndex)
    })

    newSocket.on('roadmapComplete', (data: { message: string }) => {
      console.log(data.message)
      setProgress(100)
      setIsCreating(false)
      newSocket.disconnect()
    })

    newSocket.on('roadmapError', (data: { message: string }) => {
      console.error('Error:', data.message)
      setIsCreating(false)
      newSocket.disconnect()
    })

    return () => {
      if (newSocket) newSocket.disconnect()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreate()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Excited to learn something new?</h1>
        <Input
          type="text"
          placeholder="Enter your learning goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onKeyPress={handleKeyPress}
          className="mb-4"
          disabled={isCreating}
        />
        <Button
          onClick={handleCreate}
          disabled={isCreating || !goal.trim()}
          className="w-full mb-6"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Roadmap'
          )}
        </Button>
        {isCreating && (
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="space-y-2">
              {stages.map((stage, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index < currentStage ? (
                    <CheckCircle className="text-grey-500 h-5 w-5" />
                  ) : index === currentStage ? (
                    <Loader2 className="text-grey-500 h-5 w-5 animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={`text-sm ${index <= currentStage ? 'text-gray-800' : 'text-gray-400'}`}>
                    {stage.name}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stage.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}
        {progress === 100 && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-grey-600 mb-2">Roadmap Created Successfully!</h2>
            <p className="text-gray-600">Your personalized learning journey is ready to begin.</p>
          </div>
        )}
      </div>
    </div>
  )
}