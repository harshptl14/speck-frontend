// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import Link from 'next/link';

// interface Course {
//     id: number;
//     name: string;
//     progress: number;
// }

// interface CourseProgressProps {
//     courses: Course[];
// }

// const CourseProgress: React.FC<CourseProgressProps> = ({ courses }) => (
//     <section className="space-y-6">
//         <h2 className="text-2xl font-semibold tracking-tight">Your Course Progress</h2>
//         <div className="grid gap-4">
//             {courses.map((course) => (
//                 <Link key={course.id} href={`/course/${course.id}`} passHref>
//                     <Card className="hover:shadow-lg transition-shadow cursor-pointer">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                             <CardTitle className="text-sm font-medium">{course.name}</CardTitle>
//                             <div className="text-sm text-muted-foreground">{course.progress}%</div>
//                         </CardHeader>
//                         <CardContent>
//                             <Progress value={course.progress} className="w-full" />
//                         </CardContent>
//                     </Card>
//                 </Link>
//             ))}
//         </div>
//     </section>
// );

// export default CourseProgress;

"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

interface Course {
  id: number
  name: string
  progress: number
}

interface CourseProgressProps {
  courses: Course[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const CourseProgress: React.FC<CourseProgressProps> = ({ courses }) => (
  <motion.section className="space-y-4" variants={container} initial="hidden" animate="show">
    <motion.h2 className="text-2xl font-semibold tracking-tight" variants={item}>
      Your Course Progress
    </motion.h2>
    <div className="grid gap-3">
      {courses.map((course, index) => (
        <motion.div key={course.id} variants={item}>
          <Link href={`/course/${course.id}`} passHref>
            <Card className="hover:shadow-md transition-all duration-300 cursor-pointer border hover:border-primary/10 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-background/80">
                    <BookOpen className="h-4 w-4 text-primary/80" />
                  </div>
                  <CardTitle className="text-sm font-medium">{course.name}</CardTitle>
                </div>
                <div className="text-xs font-medium">
                  {course.progress < 100 ? (
                    <span className="text-muted-foreground">{course.progress}%</span>
                  ) : (
                    <span className="text-green-500/80">Completed</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-5">
                <Progress
                  value={course.progress}
                  className={`w-full h-1.5 ${
                    course.progress === 100 ? "progress-completed" : "progress-ongoing"
                  }`}
                />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  </motion.section>
)

export default CourseProgress
