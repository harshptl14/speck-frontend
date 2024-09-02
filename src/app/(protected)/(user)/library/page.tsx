import React from "react";
import RoadmapList from "./RoadmapList";

const MyRoadmaps = () => {
  return (
    <div>
      {/* <div className="flex items-center">
        <h1
          className="text-lg font-semibold md:text-2xl"
          // className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0"
        >
          My Roadmap Library
        </h1>
      </div> */}
      <RoadmapList />
    </div>
  );
};

export default MyRoadmaps;
