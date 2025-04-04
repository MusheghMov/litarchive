"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import JotaiProvider from "./JotaiProvider";
import ModalProvider from "./ModalProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="blue"
            enableSystem
            disableTransitionOnChange
            themes={["violet", "blue", "green", "dark", "light"]}
          >
            <JotaiProvider>{children}</JotaiProvider>
          </ThemeProvider>
        </ModalProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
