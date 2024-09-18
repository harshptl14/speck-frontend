"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoData {
  id: number;
  link: string;
  name: string;
  duration: number;
  thumbnail: string;
  videoType: "SHORTS" | "VIDEO";
  transcript?: string;
}

interface VideoViewProps {
  videoData: VideoData[];
}

const VideoView: React.FC<VideoViewProps> = ({ videoData }) => {
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Video Gallery</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {videoData.slice(0, 3).map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => setSelectedVideo(video)}
          />
        ))}
      </div>
      <Collapsible open={showAllVideos} onOpenChange={setShowAllVideos}>
        <CollapsibleContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {videoData.slice(3).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        </CollapsibleContent>
        {videoData.length > 3 && (
          <div className="flex mt-8">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="lg" className="group">
                {showAllVideos ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                    Show All
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        )}
      </Collapsible>
      <DetailedView
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo}
      />
    </div>
  );
};

interface VideoCardProps {
  video: VideoData;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="relative">
          <Image
            src={video.thumbnail}
            alt={video.name}
            width={320}
            height={180}
            className="rounded-lg w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <PlayCircle className="w-16 h-16 text-white" />
          </div>
        </div>
        <h3 className="mt-4 mb-2 text-lg font-semibold line-clamp-2">
          {video.name}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Tag className="mr-1 h-4 w-4" />
            {video.videoType}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {formatDuration(video.duration)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DetailedViewProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoData | null;
}

const DetailedView: React.FC<DetailedViewProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [showTranscript, setShowTranscript] = useState(true);

  if (!video) return null;

  const formattedTranscript = video.transcript
    ?.split(/\[(\d+:\d+)\]/)
    .filter(Boolean)
    .map((part, index) => {
      if (index % 2 === 0) {
        const [minutes, seconds] = part.split(":").map(Number);
        const timeInSeconds = minutes * 60 + seconds;
        return (
          <button
            key={index}
            className="text-primary hover:text-primary-dark transition-colors font-semibold"
            onClick={() => {
              if (videoRef.current && videoRef.current.contentWindow) {
                videoRef.current.contentWindow.postMessage(
                  JSON.stringify({
                    event: "command",
                    func: "seekTo",
                    args: [timeInSeconds, true],
                  }),
                  "*"
                );
              }
            }}
          >
            [{part}]
          </button>
        );
      }
      return (
        <span key={index} className="mb-4 inline-block">
          {part}
        </span>
      );
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{video.name}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-between mt-2">
              <span className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                {video.videoType}
              </span>
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {formatDuration(video.duration)}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col lg:flex-row gap-4">
          <div className={`${showTranscript ? "lg:w-2/3" : "w-full"}`}>
            <div className="relative aspect-video">
              <iframe
                ref={videoRef}
                src={`https://www.youtube.com/embed/${video.link}?enablejsapi=1`}
                title={video.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              />
            </div>
          </div>
          {video.videoType === "VIDEO" && video.transcript && (
            <div className={`${showTranscript ? "lg:w-1/3" : "hidden"}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">Transcript</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTranscript(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[60vh] rounded-md border p-4">
                <div className="space-y-2 text-sm">{formattedTranscript}</div>
              </ScrollArea>
            </div>
          )}
        </div>
        {video.videoType === "VIDEO" && video.transcript && !showTranscript && (
          <div className="mt-4">
            <Button onClick={() => setShowTranscript(true)}>
              Show Transcript
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Helper function to format duration from seconds to HH:MM:SS
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [
    hours > 0 ? hours.toString().padStart(2, "0") : null,
    minutes.toString().padStart(2, "0"),
    remainingSeconds.toString().padStart(2, "0"),
  ].filter(Boolean);

  return parts.join(":");
};

export default VideoView;
