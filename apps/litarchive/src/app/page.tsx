import { Metadata } from "next";
import Hero from "@/components/Hero";
import { Suspense } from "react";
import RecommendedBooks from "@/components/RecommendedBooks";
import RecommendedArticles from "@/components/RecommendedArticles";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Home - Community-Driven Storytelling Platform",
  description:
    "Discover, write, and monetize stories on LitArchive. Join thousands of creators in real-time collaboration, publish instantly, and earn from your literary work. Start your storytelling journey today.",
  keywords: [
    "storytelling platform",
    "write stories online",
    "collaborative writing",
    "publish stories",
    "monetize writing",
    "community books",
    "real-time editing",
    "digital storytelling",
  ],
  openGraph: {
    title: "LitArchive - Where Stories Come Alive",
    description:
      "Join a vibrant community of creators who write, collaborate, and monetize their stories. Experience the future of digital storytelling.",
    url: "https://litarchive.com",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LitArchive - Community-Driven Storytelling Platform",
      },
    ],
  },
  twitter: {
    title: "LitArchive - Where Stories Come Alive",
    description:
      "Join a vibrant community of creators who write, collaborate, and monetize their stories.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="relative flex h-max w-full flex-col">
      <Hero />
      <div className="flex w-full max-w-[1200px] flex-col space-y-16 self-center px-4 py-16 lg:px-10">
        <Suspense
          fallback={
            <div className="flex h-32 w-full items-center justify-center">
              <Loader2 className="animate-spin" size={40} />
            </div>
          }
        >
          <RecommendedBooks />
        </Suspense>

        <Suspense
          fallback={
            <div className="flex h-32 w-full items-center justify-center">
              <Loader2 className="animate-spin" size={40} />
            </div>
          }
        >
          <RecommendedArticles />
        </Suspense>
      </div>
    </div>
  );
}
