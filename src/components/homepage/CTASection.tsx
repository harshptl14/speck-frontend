import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CTASection: React.FC = () => (
  <section className="text-center space-y-2">
    <h2 className="text-2xl font-normal tracking-tight">
      What do you want to learn?
    </h2>
    {/* <p className="text-muted-foreground">
      Explore our AI-powered roadmaps and accelerate your learning journey.
    </p> */}
    <Button size="lg" className="mt-4">
      <Link href="/create" className="text-sm sm:text-md md:text-md">
        Create Roadmap
      </Link>
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </section>
);

export default CTASection;
