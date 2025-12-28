"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Inisialisasi QueryClient di dalam useState adalah best practice di Next.js
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 menit data dianggap fresh
            gcTime: 1000 * 60 * 60 * 24, // Cache tahan 24 jam (opsional)
            retry: 1,
            refetchOnWindowFocus: false, // Biar gak gampang fetching ulang pas pindah tab
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools sangat membantu untuk debug kenapa data tidak auto-update */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
