"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Mindmap {
  id: number;
  title: string;
  createdAt: Date;
}

interface RecentMindmapsProps {
  mindmaps: Mindmap[];
  total: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const RecentMindmaps: React.FC<RecentMindmapsProps> = ({ mindmaps, total }) => {
  // Store formatted dates in state to render on client only
  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  // Format dates on client side
  useEffect(() => {
    const dates = mindmaps.map((mindmap) =>
      new Date(mindmap.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    setFormattedDates(dates);
  }, [mindmaps]);

  return (
    <motion.section className="space-y-4" variants={container} initial="hidden" animate="show">
      <div className="flex justify-between items-center">
        <motion.h2 className="text-2xl font-semibold tracking-tight" variants={item}>
          Your Mindmaps
        </motion.h2>
        <motion.div variants={item}>
          <Link href="/allmaps">
            <Button variant="ghost" size="sm" className="gap-1">
              View all ({total}) <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {mindmaps.map((mindmap, index) => (
          <motion.div key={mindmap.id} variants={item}>
            <Link href={`/mindmap/${mindmap.id}`}>
              <Card className="hover:shadow-md transition-all duration-300 cursor-pointer border hover:border-primary/10 h-full bg-card/50 p-1">
                <CardHeader className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-full bg-background/80">
                      <Network className="h-4 w-4 text-primary/80" />
                    </div>
                    <CardTitle className="text-sm font-medium line-clamp-1">{mindmap.title}</CardTitle>
                  </div>
                  <CardDescription className="text-[10px]">
                    {formattedDates[index] || "Loading..."}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}

        <motion.div variants={item}>
          <Link href="/newmap">
            <Card className="hover:shadow-md transition-all duration-300 cursor-pointer border border-dashed hover:border-primary/10 h-full flex items-center justify-center bg-card/30 p-3">
              <CardContent className="flex flex-col items-center justify-center p-0 text-center">
                <div className="p-1.5 rounded-full bg-background/80 mb-1">
                  <Plus className="h-3 w-3 text-primary/80" />
                </div>
                <p className="text-xs font-medium">New</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RecentMindmaps;