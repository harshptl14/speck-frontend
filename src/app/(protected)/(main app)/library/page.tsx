import React from "react";
import RoadmapList from "./RoadmapList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
};

const MyRoadmaps = () => {
  return (
    <div>
      <RoadmapList />
    </div>
  );
};

export default MyRoadmaps;
