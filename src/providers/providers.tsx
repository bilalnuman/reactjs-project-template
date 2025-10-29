"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppStoreProvider } from "@/app/store/useAppStore";
import ResponsiveToastContainer from "@/UI/components/ResponsiveToastContainer";

export default function QueryProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // 1m fresh
            gcTime: 300_000, // 5m cache
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 1 },
        },
      })
  );


  return (
    <QueryClientProvider client={queryClient}>
      <AppStoreProvider>{children}</AppStoreProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <QueryProviders>{children}</QueryProviders>
         <div className="relative"> <ResponsiveToastContainer/></div>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}



