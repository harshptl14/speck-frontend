import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Network, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppIcon from "@/components/appIcon";

export const metadata: Metadata = {
  title: "Speck - Turn Text into Visual Clarity",
  description: "Effortlessly transform complex text into clear mindmaps and personalized learning paths with AI.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-full bg-zinc-100/70 px-6 py-3 backdrop-blur-md max-w-xl mx-auto">
            <Link href="/" className="flex items-center space-x-2">
              <AppIcon className="h-8 w-8 text-zinc-900" />
              <span className="text-xl font-semibold text-zinc-900">Speck</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href={"/auth"}>
                <Button variant="outline" className="h-9 rounded-full hover:bg-zinc-100 transition-all duration-200">
                  Sign In
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-28">
        {/* Hero Section - Sharper messaging */}
        <section className="py-16 text-center">
  <div className="inline-flex items-center rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-800 mb-6">
    <Sparkles className="h-4 w-4 mr-2" />
    <span>AI-Powered Knowledge Structuring</span>
  </div>
  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-zinc-900 mb-6">
    From Text to <br className="hidden sm:inline" /> Clarity & Progress
  </h1>
  <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
    Speck transforms your notes, articles, or learning goals into visual mindmaps and guided roadmaps — helping you learn faster and stay organized.
  </p>
  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
    <Link href={"/auth"}>
      <Button
        size="lg"
        className="bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-200 rounded-full px-8 shadow-sm hover:shadow"
      >
        Start here!
      </Button>
    </Link>
    {/* <Button variant="outline" size="lg" className="rounded-full px-8 border-zinc-200 hover:bg-zinc-50">
      Watch a Demo
    </Button> */}
  </div>
</section>


        {/* Feature Cards - Focused and benefit-driven */}
        <section id="features" className="py-16 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mindmap Generator Card */}
            <div className="relative h-[400px] rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50 shadow-sm overflow-hidden">
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
                    <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">
                      Instant Mindmaps
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      Convert text into clear, interactive mindmaps to grasp ideas faster.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50 shadow-sm overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="/text-to-roadmap.png"
                  alt="Mindmap Generator"
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
                    <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">
                     Personalized Roadmaps
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      Build step-by-step learning plans tailored to your goals with just one click.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            

  </div>
</section>


        {/* How It Works - Concise and action-oriented */}
        <section className="py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900">Get Started in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-zinc-200 p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-zinc-900">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2 text-zinc-900">Add Your Text</h3>
              <p className="text-zinc-600">Paste text or describe your topic.</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-zinc-900">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2 text-zinc-900">Let AI Work</h3>
              <p className="text-zinc-600">Our AI organizes and visualizes your content.</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-zinc-900">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2 text-zinc-900">Explore & Learn</h3>
              <p className="text-zinc-600">Interact with your mindmap or roadmap instantly.</p>
            </div>
          </div>
        </section>

        {/* Call to Action - More urgent and benefit-focused */}
 <section className="py-16 max-w-3xl mx-auto text-center">
  <div className="rounded-2xl bg-zinc-900 p-10 text-white shadow-xl">
    <h2 className="text-3xl font-bold mb-4">Master Anything, One Map at a Time</h2>
    <p className="text-zinc-300 mb-8 max-w-xl mx-auto">
      Whether you're tackling a tricky topic or planning your next learning goal, Speck turns your ideas into clear mindmaps and guided roadmaps—fast.
    </p>
    <Link href={"/auth"}>
      <Button className="bg-white text-zinc-900 hover:bg-zinc-100 transition-all duration-200 rounded-full px-8 shadow-sm hover:shadow">
        Start Now!
      </Button>
    </Link>
  </div>
</section>

      </main>

      <footer className="border-t border-zinc-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <AppIcon className="h-6 w-6 text-zinc-900" />
              <span className="text-sm font-medium text-zinc-900">Speck</span>
            </div>
            <p className="text-sm text-zinc-500 mt-4 md:mt-0">© {new Date().getFullYear()} Speck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}