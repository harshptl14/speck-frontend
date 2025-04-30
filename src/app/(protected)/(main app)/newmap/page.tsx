// "use client"

// import type React from "react"

// import { useState, useRef, useCallback, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useToast } from "@/components/ui/use-toast"
// import { createMindmap } from "@/api/mindmap/api"
// import { getClientSideCookie } from "@/lib/utils"
// import { AlertCircle, Loader2, Sparkles, Zap, Network, ExternalLink, Plus, NetworkIcon, HeartPulse, ActivityIcon } from "lucide-react"
// import confetti from "canvas-confetti"

// // Define Model interface
// interface AIModel {
//   id: string
//   name: string
//   icon: React.ComponentType<{ className?: string }>
// }

// // Define available models
// const availableModels: AIModel[] = [
//   {
//     id: "gemini:flash",
//     name: "Gemini 2.0 Flash",
//     icon: Zap,
//   },
//   {
//     id: "groq:llama-3.3",
//     name: "LLaMA 3.3 70B",
//     icon: Network,
//   },
// ]

// interface MindmapResult {
//   markdown: string
//   id: string
//   title: string
// }

// export default function MindmapCreator() {
//   const [text, setText] = useState("")
//   const [title, setTitle] = useState("")
//   const [selectedModelId, setSelectedModelId] = useState<string>(availableModels[0].id)
//   const [isConverting, setIsConverting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [createdMindmap, setCreatedMindmap] = useState<MindmapResult | null>(null)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)
//   const { toast } = useToast()

//   const charCount = text.length
//   const selectedModel = availableModels.find((model) => model.id === selectedModelId) ?? availableModels[0]

//   // Confetti effect on successful creation
//   const triggerConfetti = useCallback(() => {
//     const duration = 2000
//     const animationEnd = Date.now() + duration
//     const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

//     function randomInRange(min: number, max: number) {
//       return Math.random() * (max - min) + min
//     }

//     const interval: any = setInterval(() => {
//       const timeLeft = animationEnd - Date.now()

//       if (timeLeft <= 0) {
//         return clearInterval(interval)
//       }

//       const particleCount = 50 * (timeLeft / duration)

//       // Since particles fall down, start a bit higher than random
//       confetti({
//         ...defaults,
//         particleCount,
//         origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
//       })
//       confetti({
//         ...defaults,
//         particleCount,
//         origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
//       })
//     }, 250)
//   }, [])

//   // Memoized conversion handler
//   const handleConvertToMarkdown = useCallback(async () => {
//   setError(null)

//   if (!text.trim()) {
//     setError("Please paste or type content into the text area to generate a mindmap.")
//     textareaRef.current?.focus()
//     return
//   }

//   setIsConverting(true)

//   try {
//     const token = getClientSideCookie("jwtToken")
//     if (!token) {
//       throw new Error("Authentication session expired. Please log in again.")
//     }

//     const mindmap = await createMindmap(text, title.trim(), token, selectedModelId)

//     // Instead of redirecting, store the result
//     setCreatedMindmap({
//       markdown: mindmap.markdown,
//       id: mindmap.id,
//       title: title || mindmap.title,
//     })

//     toast({
//       title: "Mindmap Created!",
//       description: "Your mindmap is ready to be explored.",
//       variant: "default",
//     })

//     // Trigger confetti animation
//     triggerConfetti()

//     setIsConverting(false)
//   } catch (err: any) {
    
//     // Extract the actual error message
//     let errorMessage = "An unexpected error occurred."
    
//     // First try to get the message directly from the error
//     if (err.message) {
//       errorMessage = err.message
//     }
    
//     // If the error response contains a message property, use that instead
//     if (err.response?.data?.message) {
//       errorMessage = err.response.data.message
//     }
    
//     setError(errorMessage)

//     toast({
//       variant: "destructive",
//       title: "Mindmap Creation Failed",
//       description: errorMessage,
//     })
//     setIsConverting(false)
//   }
// }, [text, title, selectedModelId, toast, triggerConfetti])

//   const handleReset = () => {
//     setCreatedMindmap(null)
//     setText("")
//     setTitle("")
//   }

//   // Handle keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Ctrl/Cmd + Enter to submit
//       if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isConverting && text.trim()) {
//         handleConvertToMarkdown()
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     return () => window.removeEventListener("keydown", handleKeyDown)
//   }, [handleConvertToMarkdown, isConverting, text])

//   return (
//     <div className="w-full h-full min-h-[calc(100vh-4rem)] relative">
//       {/* Subtle background pattern */}
//       <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none" />

//       <AnimatePresence mode="wait">
//         {!createdMindmap ? (
//           <motion.div
//             key="creation-form"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="w-full max-w-3xl mx-auto px-4 py-6"
//           >
//             <div className="mb-6">
//               <div className="flex items-center gap-2.5 mb-1.5">
//                 <ActivityIcon className="h-6 w-6 text-primary" />
//                 <h1 className="text-2xl font-medium tracking-tight">Mindmap Creator</h1>
//               </div>
//               <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
//                 Transform your ideas into beautifully structured visual mindmaps with our cutting-edge AI technology.
//               </p>
//             </div>

//             {/* Error Alert Area */}
//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3, ease: "easeInOut" }}
//                   className="mb-4"
//                   role="alert"
//                   aria-live="polite"
//                 >
//                   <Alert variant="destructive" className="text-sm">
//                     <AlertCircle className="h-4 w-4" aria-hidden="true" />
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <div className="mb-4">
//               <div className="flex items-center justify-between mb-2">
//                 <label htmlFor="ai-engine" className="text-sm font-medium">
//                   AI Engine:
//                 </label>
//                 <div className="relative">
//                   <Select value={selectedModelId} onValueChange={setSelectedModelId}>
//                     <SelectTrigger
//                       id="ai-engine"
//                       className="w-[200px] text-sm h-10 border border-border/40 bg-background/80"
//                       aria-label="Select AI model for mindmap generation"
//                     >
//                       <div className="flex items-center gap-2">
//                         <selectedModel.icon className="h-4 w-4 text-primary" aria-hidden="true" />
//                         <SelectValue placeholder="Select Model..." />
//                       </div>
//                     </SelectTrigger>
//                     <SelectContent className="min-w-[200px]">
//                       {availableModels.map((model) => (
//                         <SelectItem key={model.id} value={model.id} className="py-1.5">
//                           <div className="flex items-center gap-2">
//                             {/* <model.icon className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" /> */}
//                             <span>{model.name}</span>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             {/* Title Input */}
//             <div className="mb-4">
//               <Input
//                 id="mindmap-title"
//                 placeholder="Enter mindmap title (optional)"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full h-10 text-base border-border/40 bg-background/80"
//                 aria-label="Mindmap title (optional)"
//               />
//             </div>

//             {/* Content Textarea */}
//             <div className="relative mb-4">
//               <Textarea
//                 ref={textareaRef}
//                 id="mindmap-content"
//                 className="w-full resize-none min-h-[320px] text-base p-4 border-border/40 bg-background/80 focus-visible:ring-1"
//                 placeholder="Paste your notes, article summary, or brainstorm ideas here... Our AI will transform it into an interactive mindmap."
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 aria-label="Content to convert into a mindmap"
//                 aria-describedby="char-count"
//                 required
//               />
//               <div
//                 id="char-count"
//                 className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/90 px-2 py-0.5 rounded"
//               >
//                 {charCount} character{charCount !== 1 ? "s" : ""}
//               </div>
//             </div>

//             <Button
//               onClick={handleConvertToMarkdown}
//               disabled={isConverting || !text.trim()}
//               className="w-full h-11 text-base font-medium relative overflow-hidden bg-neutral-600 hover:bg-neutral-700"
//               aria-label={isConverting ? "Generating Mindmap, please wait" : "Generate Mindmap from Text"}
//               aria-live="polite"
//               aria-busy={isConverting}
//             >
//               {isConverting ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
//                   <span>Transforming to Mindmap...</span>
//                 </span>
//               ) : (
//                 <span className="flex items-center justify-center gap-2">
//                   <Sparkles className="h-4 w-4" />
//                   <span>Transform to Mindmap</span>
//                 </span>
//               )}
//             </Button>

//             <div className="mt-2 text-center text-xs text-muted-foreground">
//               <p className="mb-1">
//               Press <kbd className="px-1 py-0.5 bg-muted rounded border border-border/40 mx-0.5">Ctrl</kbd> +{" "}
//               <kbd className="px-1 py-0.5 bg-muted rounded border border-border/40 mx-0.5">Enter</kbd> to transform
//               </p>
//               <p>Input limit: 35,000 characters</p>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             key="success-view"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="w-full max-w-3xl mx-auto px-4 py-6"
//           >
//             <div className="mb-6">
//               <div className="flex items-center gap-2.5 mb-1.5">
//                 <div className="bg-primary/10 p-1.5 rounded-full">
//                   <ActivityIcon className="h-6 w-6 text-primary" />
//                 </div>
//                 <h1 className="text-2xl font-medium tracking-tight">Mindmap Created</h1>
//               </div>
//               <p className="text-muted-foreground text-sm">Your neural connections have been mapped successfully</p>
//             </div>

//             <div className="mb-6 p-6 bg-muted/10 rounded-lg border border-border/30">
//               <h2 className="text-xl font-medium mb-2">{createdMindmap.title}</h2>
//               <p className="text-muted-foreground text-sm mb-6">
//                 Your mindmap has been created and is ready to explore.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-3">
//                 <Button className="flex-1 gap-2 h-10 bg-neutral-600 hover:bg-neutral-700" asChild>
//                   <a href={`/mindmap/${createdMindmap.id}`}>
//                     <Network className="h-4 w-4" />
//                     View Mindmap
//                     <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
//                   </a>
//                 </Button>

//                 <Button variant="outline" className="flex-1 gap-2 h-10 border-neutral-300" onClick={handleReset}>
//                   <Plus className="h-4 w-4" />
//                   Create New Mindmap
//                 </Button>
//               </div>
//             </div>

//             <div className="bg-muted/5 p-4 rounded-lg border border-border/20">
//               <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
//                 <Sparkles className="h-3.5 w-3.5 text-primary" />
//                 Mindmap Preview
//               </h3>
//               <div className="max-h-[150px] overflow-y-auto p-3 bg-background/50 rounded border border-border/10 text-xs font-mono">
//                 {createdMindmap.markdown.substring(0, 300)}
//                 {createdMindmap.markdown.length > 300 && "..."}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { createMindmap } from "@/api/mindmap/api"
import { getClientSideCookie } from "@/lib/utils"
import { AlertCircle, Loader2, Sparkles, Zap, Network, ExternalLink, Plus, ActivityIcon } from "lucide-react"

import confetti from "canvas-confetti"

// Define Model interface
interface AIModel {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  characterLimit: number
}

// Define available models
const availableModels: AIModel[] = [
  {
    id: "gemini:flash",
    name: "Gemini 2.0 Flash",
    icon: Zap,
    characterLimit: 34000,
  },
  {
    id: "groq:llama-3.3",
    name: "LLaMA 3.3 70B",
    icon: Network,
    characterLimit: 23000,
  },
]

interface MindmapResult {
  markdown: string
  id: string
  title: string
}

export default function MindmapCreator() {
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")
  const [selectedModelId, setSelectedModelId] = useState<string>(availableModels[0].id)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdMindmap, setCreatedMindmap] = useState<MindmapResult | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const charCount = text.length
  const selectedModel = availableModels.find((model) => model.id === selectedModelId) ?? availableModels[0]

  // Confetti effect on successful creation
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

  // Memoized conversion handler
  const handleConvertToMarkdown = useCallback(async () => {
    setError(null)

    if (!text.trim()) {
      setError("Please paste or type content into the text area to generate a mindmap.")
      textareaRef.current?.focus()
      return
    }

    const currentLimit = selectedModel.characterLimit

    // Add character limit check
    if (text.length > currentLimit) {
      setError(
        `Whoa there, Shakespeare! Your masterpiece exceeds our ${currentLimit.toLocaleString()} character limit for ${selectedModel.name}. Maybe save the novel for later?`,
      )
      toast({
        title: "Character Limit Exceeded",
        description: `Whoa there, Shakespeare! Your masterpiece exceeds our ${currentLimit.toLocaleString()} character limit for ${selectedModel.name}. Maybe save the novel for later?`,
        variant: "destructive",
      })
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

      // Instead of redirecting, store the result
      setCreatedMindmap({
        markdown: mindmap.markdown,
        id: mindmap.id,
        title: title || mindmap.title,
      })

      toast({
        title: "Mindmap Created!",
        description: "Your mindmap is ready to be explored.",
        variant: "default",
      })

      // Trigger confetti animation
      triggerConfetti()

      setIsConverting(false)
    } catch (err: any) {
      // Extract the actual error message
      let errorMessage = "An unexpected error occurred."

      // First try to get the message directly from the error
      if (err.message) {
        errorMessage = err.message
      }

      // If the error response contains a message property, use that instead
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }

      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Mindmap Creation Failed",
        description: errorMessage,
      })
      setIsConverting(false)
    }
  }, [text, title, selectedModelId, selectedModel, toast, triggerConfetti])

  const handleReset = () => {
    setCreatedMindmap(null)
    setText("")
    setTitle("")
  }

  // Add this function after the handleReset function
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)

    const currentLimit = selectedModel.characterLimit

    // Clear any existing error if user reduces text below limit
    if (error && newText.length <= currentLimit) {
      setError(null)
    }

    // Show toast when exceeding limit while typing
    if (newText.length > currentLimit && text.length <= currentLimit) {
      toast({
        title: "Character Limit Exceeded",
        description: `Whoa there, Shakespeare! Your masterpiece exceeds our ${currentLimit.toLocaleString()} character limit for ${selectedModel.name}. Maybe save the novel for later?`,
        variant: "destructive",
      })
    }
  }
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isConverting && text.trim()) {
        handleConvertToMarkdown()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleConvertToMarkdown, isConverting, text])

  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!createdMindmap ? (
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
                <ActivityIcon className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-medium tracking-tight">Mindmap Creator</h1>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                Transform your ideas into beautifully structured visual mindmaps with our cutting-edge AI technology.
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

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="ai-engine" className="text-sm font-medium">
                  AI Engine:
                </label>
                <div className="relative">
                  <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                    <SelectTrigger
                      id="ai-engine"
                      className="w-[200px] text-sm h-10 border border-border/40 bg-background/80"
                      aria-label="Select AI model for mindmap generation"
                    >
                      <div className="flex items-center gap-2">
                        <selectedModel.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        <SelectValue placeholder="Select Model..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="min-w-[200px]">
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id} className="py-1.5">
                          <div className="flex items-center gap-2">
                            {/* <model.icon className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" /> */}
                            <span>{model.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-4">
              <Input
                id="mindmap-title"
                placeholder="Enter mindmap title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 text-base border-border/40 bg-background/80"
                aria-label="Mindmap title (optional)"
              />
            </div>

            {/* Content Textarea */}
            <div className="relative mb-4">
              <Textarea
                ref={textareaRef}
                id="mindmap-content"
                className={`w-full resize-none min-h-[320px] text-base p-4 border-border/40 bg-background/80 focus-visible:ring-1 ${
                  text.length > selectedModel.characterLimit ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                placeholder="Paste your notes, article summary, or brainstorm ideas here... Our AI will transform it into an interactive mindmap."
                value={text}
                onChange={handleTextChange}
                aria-label="Content to convert into a mindmap"
                aria-describedby="char-count"
                required
              />
              <div
                id="char-count"
                className={`absolute bottom-3 right-3 text-xs ${
                  text.length > selectedModel.characterLimit
                    ? "text-red-500 font-medium bg-red-50 dark:bg-red-950/30"
                    : text.length > selectedModel.characterLimit * 0.85
                      ? "text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/30"
                      : "text-muted-foreground bg-background/90"
                } px-2 py-0.5 rounded`}
              >
                {charCount} / {selectedModel.characterLimit.toLocaleString()} character{charCount !== 1 ? "s" : ""}
                {text.length > selectedModel.characterLimit && " (limit exceeded)"}
              </div>
            </div>

            <Button
              onClick={handleConvertToMarkdown}
              disabled={isConverting || !text.trim()}
              className="w-full h-11 text-base font-medium relative overflow-hidden bg-neutral-600 hover:bg-neutral-700"
              aria-label={isConverting ? "Generating Mindmap, please wait" : "Generate Mindmap from Text"}
              aria-live="polite"
              aria-busy={isConverting}
            >
              {isConverting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Transforming to Mindmap...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Transform to Mindmap</span>
                </span>
              )}
            </Button>

            <div className="mt-2 text-center text-xs text-muted-foreground">
              <p className="mb-1">
                Press <kbd className="px-1 py-0.5 bg-muted rounded border border-border/40 mx-0.5">Ctrl</kbd> +{" "}
                <kbd className="px-1 py-0.5 bg-muted rounded border border-border/40 mx-0.5">Enter</kbd> to transform
              </p>
              <p>
                Input limit: {selectedModel.characterLimit.toLocaleString()} characters for {selectedModel.name}
              </p>
            </div>
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
                  <ActivityIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-medium tracking-tight">Mindmap Created</h1>
              </div>
              <p className="text-muted-foreground text-sm">Your neural connections have been mapped successfully</p>
            </div>

            <div className="mb-6 p-6 bg-muted/10 rounded-lg border border-border/30">
              <h2 className="text-xl font-medium mb-2">{createdMindmap.title}</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your mindmap has been created and is ready to explore.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 gap-2 h-10 bg-neutral-600 hover:bg-neutral-700" asChild>
                  <a href={`/mindmap/${createdMindmap.id}`}>
                    <Network className="h-4 w-4" />
                    View Mindmap
                    <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                  </a>
                </Button>

                <Button variant="outline" className="flex-1 gap-2 h-10 border-neutral-300" onClick={handleReset}>
                  <Plus className="h-4 w-4" />
                  Create New Mindmap
                </Button>
              </div>
            </div>

            <div className="bg-muted/5 p-4 rounded-lg border border-border/20">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Mindmap Preview
              </h3>
              <div className="max-h-[150px] overflow-y-auto p-3 bg-background/50 rounded border border-border/10 text-xs font-mono">
                {createdMindmap.markdown.substring(0, 300)}
                {createdMindmap.markdown.length > 300 && "..."}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
