import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';

interface Course {
    id: number;
    name: string;
    progress: number;
}

interface CourseProgressProps {
    courses: Course[];
}

const CourseProgress: React.FC<CourseProgressProps> = ({ courses }) => (
    <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Your Course Progress</h2>
        <div className="grid gap-4">
            {courses.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`} passHref>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{course.name}</CardTitle>
                            <div className="text-sm text-muted-foreground">{course.progress}%</div>
                        </CardHeader>
                        <CardContent>
                            <Progress value={course.progress} className="w-full" />
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </section>
);

export default CourseProgress;