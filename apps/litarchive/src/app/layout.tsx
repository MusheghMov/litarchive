import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@smastrom/react-rating/style.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: {
		default: "LitArchive - Create, Collaborate & Monetize Your Stories",
		template: "%s | LitArchive",
	},
	description:
		"Join the leading community-driven storytelling platform. Write, collaborate in real-time, and monetize your stories. Start your literary journey with thousands of creators worldwide.",
	keywords: [
		"online writing platform",
		"collaborative writing tool",
		"publish books online",
		"community storytelling",
		"monetize writing",
		"real-time collaboration",
		"digital publishing",
		"story creation",
		"writer community",
		"self publishing",
	],
	authors: [{ name: "LitArchive Team" }],
	creator: "LitArchive",
	publisher: "LitArchive",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://litarchive.com"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://litarchive.com",
		title: "LitArchive - Create, Collaborate & Monetize Your Stories",
		description:
			"Join the leading community-driven storytelling platform. Write, collaborate in real-time, and monetize your stories. Start your literary journey with thousands of creators worldwide.",
		siteName: "LitArchive",
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
		card: "summary_large_image",
		title: "LitArchive - Create, Collaborate & Monetize Your Stories",
		description:
			"Join the leading community-driven storytelling platform. Write, collaborate in real-time, and monetize your stories.",
		site: "@LitArchive",
		creator: "@Mushegh_M",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "LitArchive - Community-Driven Storytelling Platform",
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: process.env.GOOGLE_SITE_VERIFICATION,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "LitArchive",
		url: "https://litarchive.com",
		logo: "https://litarchive.com/og-image.png",
		description:
			"Community-driven storytelling platform where creators write, collaborate, and monetize their stories",
		foundingDate: "2024",
		sameAs: ["https://twitter.com/LitArchive"],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			availableLanguage: "English",
		},
		knowsAbout: [
			"Creative Writing",
			"Digital Publishing",
			"Collaborative Writing",
			"Story Creation",
			"Independent Authors",
			"Community Building",
		],
	};

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<StructuredData data={organizationSchema} />
			</head>
			<body
				className={cn(
					"relative flex h-full min-h-screen w-full flex-col pb-8",
					poppins.className,
				)}
			>
				<ClerkProvider dynamic>
					<Providers>
						<Header />
						{children}
						<Analytics />
						<Toaster
							position="top-right"
							closeButton={true}
							toastOptions={{
								classNames: {
									success: "",
									closeButton:
										"!text-foreground hover:!text-background hover:!bg-foreground",
								},
							}}
						/>
						<SpeedInsights />
					</Providers>
				</ClerkProvider>
			</body>
		</html>
	);
}
