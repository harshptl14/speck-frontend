// import React from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";

// const CTASection: React.FC = () => (
//   <section className="text-center space-y-2">
//     <h2 className="text-2xl font-normal tracking-tight">
//       What do you want to learn?
//     </h2>
//     {/* <p className="text-muted-foreground">
//       Explore our AI-powered roadmaps and accelerate your learning journey.
//     </p> */}
//     <Button size="lg" className="mt-4">
//       <Link href="/create" className="text-sm sm:text-md md:text-md">
//         Create Roadmap
//       </Link>
//       <ArrowRight className="ml-2 h-4 w-4" />
//     </Button>
//   </section>
// );

// export default CTASection;


import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const CTASection: React.FC = () => (
  <motion.section
    className="py-8 text-center space-y-4 bg-card/50 rounded-lg border border-muted/20 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
      Ready to Expand Your Learning?
    </h2>
    <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
      Create personalized roadmaps or visualize ideas with AI-powered mindmaps.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" asChild>
        <Link href="/create/roadmap" className="flex items-center gap-2">
          Create Roadmap <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" asChild>
        <Link href="/create/mindmap" className="flex items-center gap-2">
          Create Mindmap <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  </motion.section>
)

export default CTASection