import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://litarchive.com",
    title: "Literature Archive",
    description: "Literature Archive",
    images: [
      {
        url: "./og-image.png",
        width: 1200,
        height: 630,
        alt: "Literature Archive",
      },
    ],
  },
  twitter: {
    title: "Literature Archive",
    description: "Literature Archive",
    card: "summary_large_image",
    siteId: "https://twitter.com/Mushegh_M",
    creator: "Mushegh Movsisyan",
    creatorId: "@Mushegh_M",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Literature Archive",
      },
    ],
  },
  title: "Literature Archive",
  description: "Literature Archive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative flex h-full min-h-screen w-full flex-col pb-8",
          poppins.className
        )}
      >
        <ClerkProvider dynamic>
          <Providers>
            <Header />
            {children}
            <Analytics />
            <SpeedInsights />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
