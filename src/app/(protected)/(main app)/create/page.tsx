import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import UserInput from "./UserInput";

const CreateRaodmapPage = () => {
  return (
    <div
      className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      x-chunk="dashboard-02-chunk-1"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <UserInput />
      </div>
    </div>
  );
};

export default CreateRaodmapPage;
