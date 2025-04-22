"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MarkdownEditor } from "@/components/markmap/markdown-editor";
import { MarkmapViewer } from "@/components/markmap/markmap-viewer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileText, GitBranch, MessageSquare, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AIChatSheet } from "@/components/markmap/ai-chat-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { directUpdateMarkdown, generateAISuggestion, acceptAISuggestion } from "@/api/mindmap/api";
import { getClientSideCookie } from "@/lib/utils";

// Custom debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface MarkdownPlaygroundProps {
  initialMarkdown: string;
  originalText: string;
  projectId: string;
  selectedModel: string;
  isLoading?: boolean;
}
export function MarkdownPlayground({
  initialMarkdown,
  originalText,
  projectId,
  selectedModel,
  isLoading = false,
}: MarkdownPlaygroundProps) {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [activeTab, setActiveTab] = useState<"editor" | "mindmap" | "both" | "original">("both");
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [showAISuggestionDialog, setShowAISuggestionDialog] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<{ originalMarkdown: string; suggestedMarkdown: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Set default view to editor on mobile
  useEffect(() => {
    if (isMobile && activeTab === "both") {
      setActiveTab("editor");
    }
  }, [isMobile, activeTab]);

  // Debounced save to database
  const saveToDatabase = useCallback(
    async (markdownToSave: string) => {
      if (isLoading || markdownToSave === initialMarkdown) return;

      try {
        setSaveStatus("saving");
        const token = getClientSideCookie("jwtToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        await directUpdateMarkdown(projectId, markdownToSave, token);
        setSaveStatus("saved");
        toast({
          title: "Markdown Saved",
          description: "Your changes have been saved to the database.",
        });
      } catch (error: any) {
        setSaveStatus("saved");
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: error.message || "Failed to save markdown to database.",
        });
      }
    },
    [isLoading, initialMarkdown, projectId, toast]
  );

  const debouncedSave = useRef(debounce(saveToDatabase, 1000)).current; // Increased debounce time for better UX

  const handleMarkdownChange = useCallback(
    (value: string) => {
      setMarkdown(value);
      debouncedSave(value);
    },
    [debouncedSave]
  );

    // Callback to update markdown
  const updateMarkdown = useCallback((newMarkdown: string) => {
    setMarkdown(newMarkdown);
    debouncedSave(newMarkdown); // Trigger save to database
  }, [debouncedSave]);


  const handleAIPrompt = useCallback(
    async (prompt: string, selectedModelId: string) => {
      try {
        if (prompt.startsWith("APPLY_MARKDOWN:")) {
          const newMarkdown = prompt.substring("APPLY_MARKDOWN:".length);
          setMarkdown(newMarkdown);
          await directUpdateMarkdown(projectId, newMarkdown, getClientSideCookie("jwtToken") || "");
          toast({
            title: "Markdown Applied",
            description: "The AI-generated markdown has been applied and saved.",
          });
          return "Changes applied to the editor.";
        }

        const token = getClientSideCookie("jwtToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const suggestion = await generateAISuggestion(projectId, prompt, token, selectedModelId);
        if (suggestion.suggestedMarkdown) {
          setAISuggestion(suggestion);
          // setShowAISuggestionDialog(true);
        }

        return suggestion.suggestedMarkdown
          ? `AI suggestion generated. Please review the suggested markdown:\n\n\`\`\`markdown\n${suggestion.suggestedMarkdown}\n\`\`\`\n\nWould you like to apply these changes?`
          : "No markdown suggestions generated.";
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "AI Error",
          description: error.message || "Failed to generate AI response.",
        });
        throw new Error("Failed to generate AI response.");
      }
    },
    [projectId, toast]
  );

  const handleAcceptAISuggestion = useCallback(async () => {
    if (!aiSuggestion) return;

    try {
      const token = getClientSideCookie("jwtToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const updatedMarkdown = await acceptAISuggestion(projectId, aiSuggestion.suggestedMarkdown, token);
      setMarkdown(updatedMarkdown);
      // setShowAISuggestionDialog(false);
      setAISuggestion(null);
      toast({
        title: "AI Suggestion Accepted",
        description: "The AI-generated markdown has been applied and saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to accept AI suggestion.",
      });
    }
  }, [aiSuggestion, projectId, toast]);

  // const handleRejectAISuggestion = useCallback(() => {
  //   setShowAISuggestionDialog(false);
  //   setAISuggestion(null);
  //   toast({
  //     title: "AI Suggestion Rejected",
  //     description: "The current markdown remains unchanged.",
  //   });
  // }, [toast]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        });
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, [toast]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen" aria-busy="true" aria-label="Loading markdown playground">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-[300px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-[calc(100vh-200px)] w-full" />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <Skeleton className="h-[calc(100vh-200px)] w-full" />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border-b gap-2">
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="original" aria-label="View original text">
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Original Text</span>
                <span className="sm:hidden">Original</span>
              </TabsTrigger>
              <TabsTrigger value="editor" aria-label="View markdown editor">
                <FileText className="h-4 w-4 mr-2" />
                <span>Editor</span>
              </TabsTrigger>
              <TabsTrigger value="mindmap" aria-label="View mindmap visualization">
                <GitBranch className="h-4 w-4 mr-2" />
                <span>Mindmap</span>
              </TabsTrigger>
              <TabsTrigger
                value="both"
                aria-label="View editor and mindmap side by side"
                className="hidden sm:flex"
              >
                <FileText className="h-4 w-4 mr-2" />
                <GitBranch className="h-4 w-4 ml-2" />
                <span>Both</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Open AI chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Chat or Edit with AI</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={isMobile ? "bottom" : "right"} className="w-full sm:w-[50%] sm:max-w-none">
              <AIChatSheet
              onSubmit={handleAIPrompt}
              markdown={markdown}
              selectedModel={selectedModel}
              mindmapId={projectId}
              token={getClientSideCookie("jwtToken") || ""}
              updateMarkdown={updateMarkdown} // Pass the callback
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "original" ? (
          <div className="h-full p-3 sm:p-6 overflow-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Original Text</h2>
              <div className="p-4 border rounded-md bg-muted/30">
                <pre className="whitespace-pre-wrap">{originalText}</pre>
              </div>
            </div>
          </div>
        ) : activeTab === "both" ? (
          <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="h-full">
            <ResizablePanel defaultSize={50} minSize={30}>
              <MarkdownEditor value={markdown} onChange={handleMarkdownChange} saveStatus={saveStatus} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <MarkmapViewer markdown={markdown} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : activeTab === "editor" ? (
          <MarkdownEditor value={markdown} onChange={handleMarkdownChange} saveStatus={saveStatus} />
        ) : (
          <MarkmapViewer markdown={markdown} />
        )}
      </div>

      {/* <AlertDialog open={showAISuggestionDialog} onOpenChange={setShowAISuggestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review AI Suggestion</AlertDialogTitle>
            <AlertDialogDescription>
              The AI has generated a new markdown based on your prompt. Would you like to apply these changes?
              <div className="mt-4 p-4 bg-muted/30 rounded-md max-h-[300px] overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">{aiSuggestion?.suggestedMarkdown}</pre>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleRejectAISuggestion} aria-label="Cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptAISuggestion} aria-label="Apply changes">
              Apply Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}