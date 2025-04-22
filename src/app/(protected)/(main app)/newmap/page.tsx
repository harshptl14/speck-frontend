"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Use specific Textarea component if available/different from input styling
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { createMindmap } from "@/api/mindmap/api" // Assuming API path is correct
import { getClientSideCookie } from "@/lib/utils" // Assuming util path is correct
import { AlertCircle, Loader2, BrainCircuit, Sparkles, Bot } from "lucide-react" // Adjusted icons

// Define Model interface for clarity
interface AIModel {
  id: string;
  name: string;
  description?: string; // Optional description for tooltip or details
  icon: React.ComponentType<{ className?: string }>;
}

// Define available models
const availableModels: AIModel[] = [
  { id: "gemini:flash", name: "Gemini 2.0 Flash-lite", icon: Sparkles }, // Using Sparkles for Gemini Flash
  { id: "groq:llama-3.3", name: "LLaMA 3.3 70B Versatile", icon: Bot }, // Using generic Bot icon for LLaMA
];

export default function MindmapCreator() {
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")
  const [selectedModelId, setSelectedModelId] = useState<string>(availableModels[0].id) // Default to first model
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const charCount = text.length; // Derived state

  // Find the selected model object
  const selectedModel = availableModels.find(model => model.id === selectedModelId) ?? availableModels[0];

  // Memoized conversion handler
  const handleConvertToMarkdown = useCallback(async () => {
    setError(null)

    if (!text.trim()) {
      setError("Please paste or type content into the text area to generate a mindmap.")
      textareaRef.current?.focus()
      return
    }

    setIsConverting(true)

    try {
      const token = getClientSideCookie("jwtToken")
      if (!token) {
        throw new Error("Authentication session expired. Please log in again.")
      }

      const mindmap = await createMindmap(text, title.trim(), token, selectedModelId)

      toast({
        title: "Mindmap Created!",
        description: "Your mindmap is ready to be explored.",
        variant: "default", // Use 'success' variant if defined in your theme
      })

      // Slight delay for user to read toast before redirect
      setTimeout(() => {
        router.push(`/mindmap/${mindmap.id}`)
      }, 600)

    } catch (err: any) {
      console.error("Create mindmap error:", err)
      const errorMessage = err.message || "An unexpected error occurred."
      setError(`${errorMessage} Please check your input or try again later.`)

      toast({
        variant: "destructive",
        title: "Mindmap Creation Failed",
        description: errorMessage,
      })
      setIsConverting(false) // Ensure loading state stops on error
    }
    // No finally block needed here for setIsConverting, handled in error case. Success case navigates away.
  }, [text, title, selectedModelId, router, toast]) // Dependencies for the callback

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault()
        if (!isConverting && text.trim()) { // Only trigger if not already converting and text exists
           handleConvertToMarkdown()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isConverting, handleConvertToMarkdown, text]) // Add text to dependency to re-bind if needed, though handleConvertToMarkdown covers it

  return (
    <motion.main
      className="flex flex-col items-center justify-center p-4 md:p-8 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background to-muted/30" // Subtle background gradient
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-3xl" // Slightly wider max-width
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
      >
        <Card className="w-full shadow-xl border-border/40 overflow-hidden">
          <CardHeader className="p-6 bg-muted/50 border-b border-border/30">
            <div className="flex items-center justify-between gap-4">
                 <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                        Create New Mindmap
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Transform your notes or ideas into a structured mindmap automatically.
                    </CardDescription>
                 </div>
                 {/* Model Selector - moved to header for prominence */}
                 <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm text-muted-foreground hidden sm:inline">AI Model:</span>
                     <Select value={selectedModelId} onValueChange={setSelectedModelId} >
                        <SelectTrigger
                            className="w-auto sm:w-[240px] text-sm" // Adjusted width
                            aria-label="Select AI model for mindmap generation"
                        >
                            <div className="flex items-center gap-2">
                                {/* <selectedModel.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" /> */}
                                <SelectValue placeholder="Select Model..." />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {availableModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                                <div className="flex items-center gap-2">
                                    <model.icon className="h-4 w-4" aria-hidden="true" />
                                    <span>{model.name}</span>
                                </div>
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
            </div>

          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Error Alert Area */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  role="alert"
                  aria-live="polite" // Announce errors to screen readers
                >
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title Input */}
            <div>
              <Input
                id="mindmap-title"
                placeholder="Enter mindmap title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base" // Slightly larger text
                aria-label="Mindmap title (optional)"
              />
            </div>

            {/* Content Textarea */}
            <div className="relative flex flex-col">
              <Textarea // Use shadcn Textarea if available
                ref={textareaRef}
                id="mindmap-content"
                className="w-full flex-1 p-4 text-base border rounded-md resize-none min-h-[350px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-shadow duration-200" // Enhanced focus state
                placeholder="Paste your notes, article summary, or brainstorm ideas here... The AI will structure it into a mindmap."
                value={text}
                onChange={(e) => setText(e.target.value)}
                aria-label="Content to convert into a mindmap"
                aria-describedby="char-count" // Describe by char count element
                required // Indicate field is necessary for submission implicitly
              />
              <div
                id="char-count"
                className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded" // Added subtle background for readability
              >
                {charCount} character{charCount !== 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 border-t border-border/30">
            <Button
              onClick={handleConvertToMarkdown}
              disabled={isConverting || !text.trim()} // Disable if converting or text is empty
              className="w-full h-12 text-lg font-medium gap-2 relative overflow-hidden group transition-all duration-300 ease-out hover:shadow-md active:scale-[0.98]" // Larger, bolder button
              aria-label={isConverting ? "Generating Mindmap, please wait" : "Generate Mindmap from Text"}
              aria-live="polite" // Announce changes in button state/text
              aria-busy={isConverting}
            >
              <AnimatePresence mode="wait">
                {isConverting ? (
                  <motion.div
                    key="converting"
                    className="flex items-center justify-center gap-2 absolute inset-0"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    <span>Generating...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="create"
                    className="flex items-center justify-center gap-2 absolute inset-0"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Icon visible only when not converting */}
                    <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Generate Mindmap</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Invisible placeholder to maintain button height */}
              <span className="opacity-0 flex items-center justify-center gap-2">
                 <Sparkles className="h-5 w-5" /> Generate Mindmap
              </span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.main>
  )
}