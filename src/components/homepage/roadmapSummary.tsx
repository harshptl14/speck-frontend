import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Star, CheckCircle } from "lucide-react";
import Link from 'next/link';

interface RoadmapSummaryProps {
    total: number;
    completed: number;
    favorite: number;
}

const RoadmapSummary: React.FC<RoadmapSummaryProps> = ({ total, completed, favorite }) => (
    <section className="grid gap-6 md:grid-cols-3">
        <RoadmapCard title="Total Roadmaps" count={total} icon={<BookOpen className="h-4 w-4 text-muted-foreground" />} />
        <RoadmapCard title="Completed Roadmaps" count={completed} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
        <RoadmapCard title="Favorite Roadmaps" count={favorite} icon={<Star className="h-4 w-4 text-muted-foreground" />} />
    </section>
);

const RoadmapCard: React.FC<{ title: string, count: number, icon: React.ReactNode }> = ({ title, count, icon }) => (
    <Link href="/library" passHref>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{count}</div>
            </CardContent>
        </Card>
    </Link>
);

export default RoadmapSummary;