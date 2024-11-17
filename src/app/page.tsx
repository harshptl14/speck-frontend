import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Zap, Brain, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Speck - Learn Something New Every Day",
  description:
    "Make learning a natural part of your day with bite-sized lessons that fit your schedule.",
};

const features = [
  {
    icon: Clock,
    title: "Quick & Easy",
    description: "Learn in just 5 minutes a day, perfect for coffee breaks",
  },
  {
    icon: Zap,
    title: "Made for You",
    description: "Lessons that match your interests and learning style",
  },
  {
    icon: Brain,
    title: "Learn Anything",
    description: "From coding to cooking, discover what interests you",
  },
  {
    icon: BarChart,
    title: "See Your Growth",
    description: "Watch your knowledge grow day by day",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-full bg-zinc-100/70 px-6 py-3 backdrop-blur-md max-w-xl mx-auto">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-zinc-900" aria-hidden="true" />
              <span className="text-xl font-semibold text-zinc-900">Speck</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="#features"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Features
              </Link>
              <Link href={"/auth"}>
                <Button variant="outline" className="h-9">
                  Sign in
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-28">
        <section className="py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-zinc-900 mb-6">
            Learn Something New,
            <br />
            Five Minutes at a Time
          </h1>
          <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
            Stop saying "I wish I had time to learn that." With Speck, you can
            learn anything in bite-sized lessons that fit naturally into your
            day.
          </p>
          <Link href={"/auth"}>
            <Button
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
            >
              Start Learning for Free
            </Button>
          </Link>
        </section>

        <section id="features" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900">
            Why You'll Love Speck
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white/50 backdrop-blur-sm p-6"
              >
                <feature.icon
                  className="h-8 w-8 mb-4 text-zinc-700"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-semibold mb-2 text-zinc-900">
                  {feature.title}
                </h3>
                <p className="text-zinc-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t mt-20 bg-zinc-50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-zinc-600">
          <p>© {new Date().getFullYear()} Speck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
