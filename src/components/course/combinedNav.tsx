"use client";

import React, { useState } from "react";
import { CourseSideNav } from "./courseSideNav";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  Archive,
  ChevronDown,
  Gift,
  Mail,
  Menu,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import AppIcon from "../appIcon";

interface CourseNavProps {
  courseData: {
    topics: {
      name: string;
      id: number;
      subtopics: {
        id: number;
        name: string;
      }[];
    }[];
  };
  roadmapName: string;
  currentTopic?: string;
  currentSubTopic?: string;
  children: React.ReactNode;
}

const CombinedNav: React.FC<CourseNavProps> = ({
  courseData,
  currentSubTopic,
  currentTopic,
  children,
  roadmapName,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log("combine nav", roadmapName);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <nav className="flex items-center justify-between px-4 py-2 border-b bg-background sticky top-0 z-10 h-16">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70 p-0">
              <CourseSideNav
                courseData={courseData}
                currentTopic={currentTopic}
                currentSubTopic={currentSubTopic}
                className="p-4 mt-5"
              />
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-2xl font-bold">
            {/* Speck */}
            <span>
              <AppIcon className="h-9 w-9" />
            </span>
          </Link>
          <h1
            className="text-lg font-semibold hidden md:block truncate max-w-[200px]"
            title={roadmapName}
          >
            {roadmapName}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden md:flex"
                >
                  {sidebarOpen ? (
                    <PanelLeftClose className="h-4 w-4" />
                  ) : (
                    <PanelLeftOpen className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <span>Your progress</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View progress</DropdownMenuItem>
              <DropdownMenuItem>Reset progress</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Share</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" /> Favorite this course
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" /> Archive this course
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Gift className="mr-2 h-4 w-4" /> Gift this course
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" /> New announcement emails
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" /> Promotional emails
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for medium and larger screens */}
        <aside
          className={`hidden md:block border-r transition-all duration-300 flex-wrap  ${
            sidebarOpen ? "w-70" : "w-0"
          }`}
        >
          {sidebarOpen && (
            <CourseSideNav
              courseData={courseData}
              currentTopic={currentTopic}
              currentSubTopic={currentSubTopic}
            />
          )}
        </aside>
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            sidebarOpen ? "md:ml-54" : ""
          }`}
        >
          <div
            className={`mx-auto px-4 py-6 sm:px-6 lg:px-8 ${
              !sidebarOpen ? "lg:px-64" : ""
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CombinedNav;
