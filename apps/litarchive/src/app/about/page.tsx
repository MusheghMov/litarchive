import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Litarchive | Community-Driven Storytelling Platform",
  description: "Discover Litarchive - the modern platform where creators write, collaborate, and monetize their stories. Join our community of storytellers and start your literary journey today.",
};

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  PenTool, 
  Users, 
  DollarSign, 
  BookOpen, 
  Edit3, 
  Zap,
  Globe,
  Heart,
  TrendingUp,
  Clock,
  Award,
  Lightbulb
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10"></div>
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      
      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="text-center">
              <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/10 text-primary">
                Next-Generation Storytelling Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Where Stories
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"> Come Alive</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
                Join a vibrant community of creators who write, collaborate, and monetize their stories. 
                Experience the future of digital storytelling with real-time collaboration and revenue opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 py-6 text-lg" asChild>
                  <Link href="/studio/create">Start Your Story</Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                  <Link href="/books">Explore Community</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary/5 rounded-full blur-lg"></div>
        </section>

        {/* Mission Statement */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Empowering Creative Expression
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                We believe every story deserves to be told and every creator deserves to thrive. 
                Litarchive is more than a platform—it's a movement that transforms how stories are created, 
                shared, and valued in the digital age.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Creators Choose Litarchive</h2>
              <p className="text-xl text-muted-foreground">Powerful tools designed for modern storytellers</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards */}
              <Card className="group relative overflow-hidden border-0 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <PenTool className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Intuitive Writing Tools</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Professional-grade editor with rich formatting, auto-save, and distraction-free writing modes to help you focus on your craft.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Real-Time Collaboration</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Invite co-authors and editors to work together seamlessly. See changes in real-time with our advanced collaborative editing system.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Monetize Your Work</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Earn revenue by selling individual chapters or complete books. Set your own prices and build a sustainable writing career.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Global Community</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with readers and writers worldwide. Build your audience and discover new voices in our diverse creative community.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Instant Publishing</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Publish your work instantly to reach readers immediately. No gatekeepers, no delays—just your story meeting its audience.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Creator Recognition</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    Get discovered through our recommendation system. Quality content rises to the top in our merit-based community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">∞</div>
                <div className="text-xl font-semibold">Stories Possible</div>
                <div className="text-muted-foreground">Unlimited creative potential</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-accent">24/7</div>
                <div className="text-xl font-semibold">Always Available</div>
                <div className="text-muted-foreground">Write whenever inspiration strikes</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-green-600">100%</div>
                <div className="text-xl font-semibold">Creator Owned</div>
                <div className="text-muted-foreground">You retain full rights to your work</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Journey Starts Here</h2>
              <p className="text-xl text-muted-foreground">Three simple steps to begin your storytelling adventure</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Edit3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">1. Create Your Story</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Start writing with our intuitive editor. Add chapters, format text, and bring your vision to life with professional tools.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4">2. Collaborate & Refine</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Invite collaborators to help refine your work. Get feedback, co-write, and perfect your story together in real-time.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">3. Publish & Earn</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Release your story to the world. Build an audience, receive feedback, and start earning from your creative work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Ideas Into Stories?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join thousands of creators who are already building their literary legacy on Litarchive. 
                Your audience is waiting for your unique voice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 py-6 text-lg" asChild>
                  <Link href="/studio/create">Create Your First Book</Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
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
