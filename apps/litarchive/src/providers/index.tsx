"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import JotaiProvider from "./JotaiProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="blue"
        enableSystem
        disableTransitionOnChange
        themes={["violet", "blue", "green", "zink", "light", "slate"]}
      >
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>{children}</JotaiProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
