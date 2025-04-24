"use client"

import type React from "react"
import { Network, BookOpen } from 'lucide-react'
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface FeatureCardsProps {
  compact?: boolean
  showOnly?: "roadmap" | "mindmap"
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ compact = false, showOnly }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const shouldShowRoadmap = !showOnly || showOnly === "roadmap"
  const shouldShowMindmap = !showOnly || showOnly === "mindmap"

  return (
    <motion.section className={`py-8 max-w-5xl mx-auto ${compact ? "py-4" : ""}`} variants={container} initial="hidden" animate="show">
      <div className={`${shouldShowRoadmap && shouldShowMindmap ? "grid md:grid-cols-2 gap-8" : "max-w-2xl mx-auto"}`}>
        {shouldShowMindmap && (
          <motion.div variants={item}>
            <Link href="/newmap" passHref>
            <div className="relative h-[400px] rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="absolute inset-0">
                <Image
                  src="/text-to-mindmap.png"
                  alt="Mindmap Generator"
                  fill
                  className="object-cover opacity-90"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/70 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl">
                    <Network className="h-8 w-8 text-zinc-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">Instant Mindmaps</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      Convert text into clear, interactive mindmaps to grasp ideas faster.
                    </p>
                  </div>
                </div>
              </div>
              </div>
              </Link>
          </motion.div>
        )}

        {shouldShowRoadmap && (
          <motion.div variants={item}>
                        <Link href="/create" passHref>

            <div className="relative h-[400px] rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="absolute inset-0">
                <Image
                  src="/text-to-roadmap.png"
                  alt="Roadmap Generator"
                  fill
                  className="object-cover opacity-90"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/70 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl">
                    <BookOpen className="h-8 w-8 text-zinc-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">Personalized Roadmaps</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      Build step-by-step learning plans tailored to your goals with just one click.
                    </p>
                  </div>
                </div>
              </div>
              </div>
              </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default FeatureCards
