"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Star, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface RoadmapSummaryProps {
  total: number
  completed: number
  favorite: number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const RoadmapSummary: React.FC<RoadmapSummaryProps> = ({ total, completed, favorite }) => (
  <motion.section className="space-y-4" initial="hidden" animate="show" variants={container}>
    <div className="flex justify-between items-center">
      <motion.h2 className="text-2xl font-semibold tracking-tight" variants={item}>
        Your Roadmaps
      </motion.h2>
      <motion.div variants={item}>
        <Link href="/roadmaps" passHref>
          <Button variant="ghost" size="sm" className="gap-1">
            View all ({total}) <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <RoadmapCard
        title="Total Roadmaps"
        count={total}
        icon={<BookOpen className="h-4 w-4 text-primary/80" />}
        variants={item}
      />
      <RoadmapCard
        title="Completed Roadmaps"
        count={completed}
        icon={<CheckCircle className="h-4 w-4" />}
        variants={item}
      />
      <RoadmapCard
        title="Favorite Roadmaps"
        count={favorite}
        icon={<Star className="h-4 w-4" />}
        variants={item}
      />
    </div>
  </motion.section>
)

const RoadmapCard: React.FC<{
  title: string
  count: number
  icon: React.ReactNode
  variants: any
}> = ({ title, count, icon, variants }) => (
  <motion.div variants={variants}>
    <Link href="/roadmaps" passHref>
      <Card className="hover:shadow-md transition-all duration-300 cursor-pointer border hover:border-primary/10 h-full bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="p-1.5 rounded-full bg-background/80">{icon}</div>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="text-2xl font-bold">{count}</div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
)

export default RoadmapSummary
