// Fixed AIChatSheet.jsx with mobile scrolling fixes
"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Send, Eye, ArrowRight, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { saveAIChatMessage, getAIChatMessages, directUpdateMarkdown } from "@/api/mindmap/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useChatContext } from "@/context/chatContext";
import { Sparkles, Bot } from "lucide-react" // Adjusted icons

interface AIChatSheetProps {
  onSubmit: (prompt: string, selectedModelId: string) => Promise<string>;
  markdown: string;
  selectedModel: string;
  mindmapId: string;
  token: string;
  updateMarkdown?: (newMarkdown: string) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  markdownBlocks?: { id: string; content: string }[];
  explanation?: string;
  plaintext?: string;
}

interface AIModel {
  id: string;
  name: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Define available models
const availableModels: AIModel[] = [
  { id: "gemini:flash", name: "Gemini 2.0 Flash-lite", icon: Sparkles },
  { id: "groq:llama-3.3", name: "LLaMA 3.3 70B Versatile", icon: Bot },
];

export function AIChatSheet({
  onSubmit,
  markdown: currentMarkdown,
  selectedModel: initialModel,
  mindmapId,
  token,
  updateMarkdown,
}: AIChatSheetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(availableModels[0].id);
  const [error, setError] = useState<string | null>(null);
  const [previewMarkdown, setPreviewMarkdown] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingMarkdown, setPendingMarkdown] = useState<string | null>(null);
  const [isIdenticalContent, setIsIdenticalContent] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { getChat, setChat } = useChatContext();
  const { syncMessages } = useChatContext();

  // Find the selected model object
  const selectedModel = availableModels.find(model => model.id === selectedModelId) ?? availableModels[0];

  // Fetch chat history on mount
  useEffect(() => {
    const fetchMessages = async () => {
      const cachedMessages = getChat(mindmapId);
      if (cachedMessages) {
        setMessages(cachedMessages);
        return;
      }

      try {
        const fetchedMessages = await getAIChatMessages(mindmapId, token);
        const mappedMessages = fetchedMessages.map((msg: any) => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          ...parseStructuredContent(msg.content),
        }));

        setMessages(mappedMessages);
        setChat(mindmapId, mappedMessages);
      } catch (err) {
        setError("Failed to load chat history. Please try again.");
      }
    };

    fetchMessages();
  }, [mindmapId, token, getChat, setChat]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const parseStructuredContent = useCallback((content: string) => {
    const result: {
      markdownBlocks?: { id: string; content: string }[];
      explanation?: string;
      plaintext?: string;
    } = {};

    if (content.includes("<response>")) {
      const explanationMatch = content.match(/<explanation>([\s\S]*?)<\/explanation>/);
      if (explanationMatch) {
        result.explanation = explanationMatch[1].trim();
      }

      const markdownMatch = content.match(/<markdown>([\s\S]*?)<\/markdown>/);
      if (markdownMatch) {
        const markdownContent = markdownMatch[1].trim();
        result.markdownBlocks = [
          {
            id: `block-${Date.now()}`,
            content: markdownContent,
          },
        ];
      }

      const plaintextMatch = content.match(/<plaintext>([\s\S]*?)<\/plaintext>/);
      if (plaintextMatch) {
        result.plaintext = plaintextMatch[1].trim();
      }

      return result;
    } else {
      return { markdownBlocks: extractMarkdownBlocks(content) };
    }
  }, []);

  const extractMarkdownBlocks = useCallback((content: string) => {
    const blocks: { id: string; content: string }[] = [];
    const regex = /```(?:markdown)?\n([\s\S]*?)```/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
      blocks.push({
        id: `block-${Date.now()}-${blocks.length}`,
        content: match[1],
      });
    }

    return blocks;
  }, []);

  const handlePreviewMarkdown = useCallback((markdownContent: string) => {
    if (!markdownContent || markdownContent.trim() === "") {
      toast({
        variant: "destructive",
        title: "No Markdown Content",
        description: "There is no markdown content to preview.",
      });
      return;
    }

    setPreviewMarkdown(markdownContent);
    setShowPreviewModal(true);
  }, [toast]);

  const initiateApplyMarkdown = useCallback(
    (markdownContent: string) => {
      const isIdentical = markdownContent.trim() === currentMarkdown.trim();
      setIsIdenticalContent(isIdentical);
      setPendingMarkdown(markdownContent);
      setShowConfirmDialog(true);
    },
    [currentMarkdown]
  );

  const renderMessageContent = useCallback(
    (message: Message) => {
      if (message.explanation || message.plaintext) {
        return (
          <div>
            {message.plaintext && (
              <div className="whitespace-pre-wrap break-words">{message.plaintext}</div>
            )}
            {message.explanation && (
              <div className="whitespace-pre-wrap break-words mb-3">
                <h4 className="text-sm font-medium mb-1">Changes Made:</h4>
                {message.explanation}
              </div>
            )}
            {message.markdownBlocks &&
              message.markdownBlocks.length > 0 &&
              message.markdownBlocks.map((block, index) => (
                <div
                  key={block.id || `new-block-${index}`}
                  className="my-3 p-4 bg-muted/60 rounded-lg border border-border relative"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => handlePreviewMarkdown(block.content)}
                      aria-label="Preview markdown"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 px-2 text-xs"
                      onClick={() => initiateApplyMarkdown(block.content)}
                      aria-label="Apply markdown"
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Use It
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap mt-8">{block.content}</pre>
                </div>
              ))}
          </div>
        );
      }

      const markdownBlocks = message.markdownBlocks || [];
      const hasMarkdown = markdownBlocks.length > 0;

      if (!hasMarkdown) {
        return <div className="whitespace-pre-wrap break-words">{message.content}</div>;
      }

      const parts = [];
      let lastIndex = 0;
      const regex = /```(?:markdown)?\n([\s\S]*?)```/g;

      let match;
      let index = 0;
      while ((match = regex.exec(message.content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${index}`} className="whitespace-pre-wrap break-words">
              {message.content.substring(lastIndex, match.index)}
            </span>
          );
        }

        const blockContent = match[1];
        const blockId = `inline-block-${index}`;
        parts.push(
          <div key={blockId} className="my-3 p-4 bg-muted/60 rounded-lg border border-border relative">
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => handlePreviewMarkdown(blockContent)}
                aria-label="Preview markdown"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-7 px-2 text-xs"
                onClick={() => initiateApplyMarkdown(blockContent)}
                aria-label="Apply markdown"
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Use It
              </Button>
            </div>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap mt-8">{blockContent}</pre>
          </div>
        );

        lastIndex = match.index + match[0].length;
        index++;
      }

      if (lastIndex < message.content.length) {
        parts.push(
          <span key={`text-${index}`} className="whitespace-pre-wrap break-words">
            {message.content.substring(lastIndex)}
          </span>
        );
      }

      return <div>{parts}</div>;
    },
    [handlePreviewMarkdown, initiateApplyMarkdown]
  );

  const addMessage = (message: Message) => {
    setMessages((prev) => {
      const updated = [...prev, message];
      syncMessages(mindmapId, () => updated);
      return updated;
    });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
      };

      addMessage(userMessage);
      setInput("");
      setIsLoading(true);
      setError(null);
      setPreviewMarkdown(null);

      try {
        await saveAIChatMessage(mindmapId, "user", input, token);

        const response = await onSubmit(input, selectedModelId);
        const parsedContent = parseStructuredContent(response);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          ...parsedContent,
        };

        addMessage(assistantMessage);
        await saveAIChatMessage(mindmapId, "assistant", response, token);
        scrollToBottom();
      } catch (error) {
        setError("Failed to get a response. Please try again.");
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        };
        addMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, mindmapId, token, onSubmit, selectedModelId, parseStructuredContent, scrollToBottom]
  );

  const handleApplyMarkdown = useCallback(async () => {
    if (!pendingMarkdown) return;

    try {
      // Update the markdown editor's text
      if (updateMarkdown) {
        updateMarkdown(pendingMarkdown);
      }

      // Call the backend API to save the markdown
      await directUpdateMarkdown(mindmapId, pendingMarkdown, token);
      toast({
        title: "Mind Map Updated",
        description: "Your mind map has been updated successfully.",
      });
      setShowConfirmDialog(false);
      setShowPreviewModal(false);
      setPendingMarkdown(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update mind map. Please try again.",
      });
    }
  }, [pendingMarkdown, mindmapId, token, toast, updateMarkdown]);

  return (
    <div className="flex flex-col h-full bg-background w-full max-w-3xl mx-auto">
      <SheetHeader className="px-6 py-4 border-b">
        <SheetTitle className="text-xl font-semibold">AI Assistant</SheetTitle>
        <SheetDescription className="text-sm text-muted-foreground">
          Chat with AI to refine your mind map or get suggestions.
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-row items-center justify-start px-6 py-3 gap-3 border-b">
        <div className="text-muted-foreground">
          <span className="font-normal">AI Model</span>
        </div>
        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
          <SelectTrigger
            className="w-auto sm:w-[240px] text-sm"
            aria-label="Select AI model for mindmap generation"
          >
            <div className="flex items-center gap-2">
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

      {error && (
        <Alert variant="destructive" className="mx-6 my-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main container - key fix here with flex structure and heights */}
      <div className="flex flex-col h-full relative">
        {/* Messages container - set absolute positioning and inset properties for mobile */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 absolute inset-0 top-0 bottom-20 w-full"
          style={{ touchAction: "pan-y" }}
          aria-live="polite"
        >
          <div className="py-4 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                        : "bg-muted/50"
                    }`}
                  >
                    {renderMessageContent(message)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted/50">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        {/* Input container - positioned absolute at bottom */}
        <div className="sticky bottom-0 left-0 right-0 bg-background border-t shadow-md z-10 mt-auto">
          <form onSubmit={handleSubmit} className="flex space-x-2 p-4">
            <Input
              placeholder="Ask for mind map suggestions or refinements..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 rounded-lg border-input focus-visible:ring-2 focus-visible:ring-primary h-10"
              aria-label="AI prompt input"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-primary hover:bg-primary/90 h-10 px-4 flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>

      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Markdown Preview</DialogTitle>
            <DialogDescription>Preview the markdown content.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <div className="bg-muted/20 rounded-md border p-4 min-h-[400px] max-h-[60vh] overflow-auto">
              {previewMarkdown ? (
                <pre className="text-xs whitespace-pre-wrap">{previewMarkdown}</pre>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-muted-foreground">No markdown content to display</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" aria-label="Close preview">
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={() => initiateApplyMarkdown(previewMarkdown || "")}
              aria-label="Apply markdown changes"
              disabled={!previewMarkdown}
            >
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isIdenticalContent ? "Content is Identical" : "Apply Changes to Mind Map?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isIdenticalContent ? (
                <div className="flex items-center text-amber-500 mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  The content is identical to your current mind map.
                </div>
              ) : (
                "This will update your mind map with the new content. This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel aria-label="Cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApplyMarkdown}
              disabled={isIdenticalContent}
              aria-label={isIdenticalContent ? "Content identical" : "Apply changes"}
            >
              {isIdenticalContent ? "Content Identical" : "Yes, Apply Changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}