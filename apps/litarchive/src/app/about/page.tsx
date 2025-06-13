import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Litarchive | Community-Driven Storytelling Platform",
  description:
    "Discover Litarchive - the modern platform where creators write, collaborate, and monetize their stories. Join our community of storytellers and start your literary journey today.",
};

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenTool,
  Users,
  DollarSign,
  Edit3,
  Zap,
  Globe,
  TrendingUp,
  Award,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="from-background via-background to-accent/10 absolute inset-0 bg-gradient-to-br"></div>
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>

      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="text-center">
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 text-primary mb-6"
              >
                Next-Generation Storytelling Platform
              </Badge>

              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Where Stories
                <span className="from-primary via-accent to-primary bg-gradient-to-r bg-clip-text text-transparent">
                  {" "}
                  Come Alive
                </span>
              </h1>

              <p className="text-muted-foreground mx-auto mb-12 max-w-4xl text-xl leading-relaxed md:text-2xl">
                Join a vibrant community of creators who write, collaborate, and
                monetize their stories. Experience the future of digital
                storytelling with real-time collaboration and revenue
                opportunities.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" className="px-8 py-6 text-lg" asChild>
                  <Link href="/studio/create">Start Your Story</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/books">Explore Community</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="bg-primary/10 absolute top-20 left-10 h-20 w-20 rounded-full blur-xl"></div>
          <div className="bg-accent/10 absolute right-10 bottom-20 h-32 w-32 rounded-full blur-xl"></div>
          <div className="bg-primary/5 absolute top-1/2 right-1/4 h-16 w-16 rounded-full blur-lg"></div>
        </section>

        {/* Mission Statement */}
        <section className="relative py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="from-foreground to-foreground/80 mb-8 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                Empowering Creative Expression
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed md:text-2xl">
                We believe every story deserves to be told and every creator
                deserves to thrive. Litarchive is more than a platform—it's a
                movement that transforms how stories are created, shared, and
                valued in the digital age.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Why Creators Choose Litarchive
              </h2>
              <p className="text-muted-foreground text-xl">
                Powerful tools designed for modern storytellers
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards */}
              <Card className="group bg-background/50 relative overflow-hidden border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent"></div>
                <CardHeader className="relative">
                  <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                    <PenTool className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">
                    Intuitive Writing Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Professional-grade editor with rich formatting, auto-save,
                    and distraction-free writing modes to help you focus on your
                    craft.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-background/50 relative overflow-hidden border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="from-accent/5 absolute inset-0 bg-gradient-to-br to-transparent"></div>
                <CardHeader className="relative">
                  <div className="bg-accent/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                    <Users className="text-accent h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">
                    Real-Time Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Invite co-authors and editors to work together seamlessly.
                    See changes in real-time with our advanced collaborative
                    editing system.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-background/50 relative overflow-hidden border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 transition-transform duration-300 group-hover:scale-110">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Monetize Your Work</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Earn revenue by selling individual chapters or complete
                    books. Set your own prices and build a sustainable writing
                    career.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-background/50 relative overflow-hidden border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 transition-transform duration-300 group-hover:scale-110">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Global Community</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with readers and writers worldwide. Build your
                    audience and discover new voices in our diverse creative
                    community.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-background/50 relative overflow-hidden border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 transition-transform duration-300 group-hover:scale-110">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Instant Publishing</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Publish your work instantly to reach readers immediately. No
                    gatekeepers, no delays—just your story meeting its audience.
                  </p>
                </CardContent>
              </Card>

              <Card className="group bg-background/50 relative overflow-hidden border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 transition-transform duration-300 group-hover:scale-110">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Creator Recognition</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Get discovered through our recommendation system. Quality
                    content rises to the top in our merit-based community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-24">
          <div className="from-primary/5 via-accent/5 to-primary/5 absolute inset-0 bg-gradient-to-r"></div>
          <div className="relative container mx-auto px-4">
            <div className="grid gap-8 text-center md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-primary text-4xl font-bold md:text-5xl">
                  ∞
                </div>
                <div className="text-xl font-semibold">Stories Possible</div>
                <div className="text-muted-foreground">
                  Unlimited creative potential
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-accent text-4xl font-bold md:text-5xl">
                  24/7
                </div>
                <div className="text-xl font-semibold">Always Available</div>
                <div className="text-muted-foreground">
                  Write whenever inspiration strikes
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600 md:text-5xl">
                  100%
                </div>
                <div className="text-xl font-semibold">Creator Owned</div>
                <div className="text-muted-foreground">
                  You retain full rights to your work
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Your Journey Starts Here
              </h2>
              <p className="text-muted-foreground text-xl">
                Three simple steps to begin your storytelling adventure
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group text-center">
                <div className="bg-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                  <Edit3 className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">
                  1. Create Your Story
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Start writing with our intuitive editor. Add chapters, format
                  text, and bring your vision to life with professional tools.
                </p>
              </div>

              <div className="group text-center">
                <div className="bg-accent/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                  <Users className="text-accent h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">
                  2. Collaborate & Refine
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Invite collaborators to help refine your work. Get feedback,
                  co-write, and perfect your story together in real-time.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 transition-transform duration-300 group-hover:scale-110">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">
                  3. Publish & Earn
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Release your story to the world. Build an audience, receive
                  feedback, and start earning from your creative work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative py-24">
          <div className="from-primary/10 via-accent/10 to-primary/10 absolute inset-0 bg-gradient-to-br"></div>
          <div className="relative container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl">
                Ready to Transform Your Ideas Into Stories?
              </h2>
              <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
                Join thousands of creators who are already building their
                literary legacy on Litarchive. Your audience is waiting for your
                unique voice.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" className="px-8 py-6 text-lg" asChild>
                  <Link href="/studio/create">Create Your First Book</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/books">Explore the Community</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
