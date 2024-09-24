import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CTASection: React.FC = () => (
    <section className="text-center space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Ready to Start Learning?</h2>
        <p className="text-muted-foreground">
            Explore our AI-powered roadmaps and accelerate your learning journey.
        </p>
        <Button size="lg" className="mt-4">
            <Link href="/create">Create Roadmap</Link><ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    </section>
);

export default CTASection;