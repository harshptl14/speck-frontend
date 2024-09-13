"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import { Button } from "../ui/button";

interface VideoViewProps {
  videoData: {
    id: number; // or string, depending on your schema
    link: string;
    name: string;
    duration: number; // or string, depending on how the duration is stored
    thumbnail: string;
    videoType: string;
  }[];
}

const VideoView: React.FC<VideoViewProps> = ({ videoData }) => {
  const [showAllVideos, setShowAllVideos] = useState(false);
  return (
    <div>
      {/* Video section */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {videoData
          .slice(0, showAllVideos ? videoData.length : 3)
          .map((video, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Image
                  src={video.thumbnail}
                  alt={video.name}
                  width={320}
                  height={180}
                  className="mb-4 rounded-lg w-full"
                />
                <h3 className="mb-2 text-lg font-semibold">{video.name}</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  {video?.videoType}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <PlayCircle className="mr-1 h-4 w-4" />
                  {video.duration}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      {videoData.length > 3 && (
        <Button
          onClick={() => setShowAllVideos(!showAllVideos)}
          className="mt-4"
          variant="outline"
        >
          {showAllVideos ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show All
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default VideoView;
