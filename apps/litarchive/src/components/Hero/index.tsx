"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Users, DollarSign, BookOpen, Edit3, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/10 text-primary">
            Community-Driven Storytelling Platform
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Create Your
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Literary World</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Write, collaborate, and monetize your stories on the modern platform built for creators. 
            Join a community where every voice matters and every chapter can earn.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!isSignedIn ? (
              <>
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/studio/create">Start Writing</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/books">Browse Books</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/studio/create">Create New Book</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/studio">My Studio</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg border bg-background/50 p-6 text-center backdrop-blur-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Write & Publish</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your own books with our intuitive editor. Publish instantly to reach readers worldwide.
              </p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg border bg-background/50 p-6 text-center backdrop-blur-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Collaborate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Invite co-authors and editors. Work together in real-time with our collaborative editing tools.
              </p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg border bg-background/50 p-6 text-center backdrop-blur-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Monetize</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Earn revenue by selling your chapters. Set your own prices and build a sustainable writing career.
              </p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg border bg-background/50 p-6 text-center backdrop-blur-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Discover Stories</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore books from creators worldwide. Find your next favorite read in our community library.
              </p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg border bg-background/50 p-6 text-center backdrop-blur-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Edit3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Real-time Editing</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Experience seamless collaborative writing with live editing, comments, and version control.
              </p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg border bg-background/50 p-6 text-center backdrop-blur-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Modern Platform</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Built for the next generation of storytellers with cutting-edge technology and intuitive design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
