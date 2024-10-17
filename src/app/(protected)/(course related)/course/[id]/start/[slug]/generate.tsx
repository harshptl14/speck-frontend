"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState, useCallback } from "react";
import { fetchProgress, generateSubtopicContent } from "@/api/roadmap/api";
import { getAuthorizationToken } from "@/lib/utils";

interface GenerateProps {
  subtopicId: string;
  roadmapId: string;
}

interface State {
  loading: boolean;
  progress: number;
}

const Generate: React.FC<GenerateProps> = ({ subtopicId, roadmapId }) => {
  const POLLING_INTERVAL = 3000;
  const jobId = `${subtopicId}:${roadmapId}`;
  const [state, setState] = useState<State>({ loading: false, progress: 0 });
  const token = getAuthorizationToken();

  // Restore progress from session storage if exists
  useEffect(() => {
    const savedState = sessionStorage.getItem(`generateState_${jobId}`);
    if (savedState) {
      const { loading, progress } = JSON.parse(savedState);
      setState({ loading, progress });
    }
  }, [jobId]);

  const handleProgressPolling = useCallback(async () => {
    if (!state.loading || !token) return;

    try {
      const { progress } = await fetchProgress(jobId, token);
      setState((prevState) => ({ ...prevState, progress }));

      sessionStorage.setItem(
        `generateState_${jobId}`,
        JSON.stringify({ loading: true, progress })
      );

      if (progress === 100) {
        clearPolling();
        setState({ loading: false, progress: 100 });
        sessionStorage.removeItem(`generateState_${jobId}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, [jobId, state.loading, token]);

  // Poll for progress at defined intervals
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (state.loading) {
      interval = setInterval(handleProgressPolling, POLLING_INTERVAL);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.loading, handleProgressPolling]);

  const handleGenerateClick = useCallback(async () => {
    setState({ loading: true, progress: 0 });
    sessionStorage.setItem(
      `generateState_${jobId}`,
      JSON.stringify({ loading: true, progress: 0 })
    );

    try {
      if (token) {
        await generateSubtopicContent(subtopicId, roadmapId, jobId, token);
      } else {
        throw new Error("Authorization token missing");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setState({ loading: false, progress: 0 });
      sessionStorage.removeItem(`generateState_${jobId}`);
    }
  }, [jobId, subtopicId, roadmapId, token]);

  const clearPolling = useCallback(() => {
    setState((prevState) => ({ ...prevState, loading: false }));
    sessionStorage.removeItem(`generateState_${jobId}`);
  }, [jobId]);

  return (
    <div className="flex flex-col items-center">
      {state.loading ? (
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Generating content...
            </span>
            <span className="text-sm font-medium text-gray-700">
              {state.progress}%
            </span>
          </div>
          <Progress value={state.progress} className="w-full h-2" />
          <p className="mt-4 text-sm text-gray-500 text-center">
            This may take a few seconds. You can safely navigate or refresh the
            page.
          </p>
        </div>
      ) : (
        <Button
          onClick={handleGenerateClick}
          className="flex items-center space-x-2"
        >
          <span>Generate Content</span>
        </Button>
      )}
    </div>
  );
};

export default Generate;
