"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MarkdownPlayground } from "@/components/markmap/markdown-playground";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { getMindmap } from "@/api/mindmap/api";
import { getClientSideCookie } from '@/lib/utils';

export default function MarkdownProjectPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const projectId = params.projectId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [originalText, setOriginalText] = useState("");
    const [markdown, setMarkdown] = useState("");
    const [title, setTitle] = useState("");
    const [selectedModel, setSelectedModel] = useState("gpt-4o");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMindmap = async () => {
            try {
                const token = getClientSideCookie("jwtToken");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const mindmap = await getMindmap(projectId, token);
                setTitle(mindmap.title);
                setMarkdown(mindmap.markdown);
                // Original text isn't stored in the backend; for now, we'll leave it empty
                setOriginalText(mindmap.originalText || "");
                setIsLoading(false);
            } catch (error: any) {
                setError(error.message || "Failed to fetch mindmap");
                setIsLoading(false);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message || "Failed to fetch mindmap",
                });
            }
        };

        fetchMindmap();
    }, [projectId, toast]);

    const handleRetry = () => {
        setIsLoading(true);
        setError(null);
        router.refresh();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="flex space-x-4">
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Button onClick={handleRetry}>
                        <Loader2 className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-background flex flex-col">
            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <Loader2 className="h-12 w-12 animate-spin mb-4 mx-auto" />
                    <p className="text-lg mb-2">Loading mindmap...</p>
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Cancel and return home
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="flex-1">
                    <MarkdownPlayground
                        initialMarkdown={markdown}
                        originalText={originalText}
                        projectId={projectId}
                        selectedModel={selectedModel}
                    />
                </div>
            )}
        </div>
    );
}