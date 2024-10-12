"use client";

import { trpc } from "@/utils/trpc";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { ReactNode, useMemo } from "react";
import superjson from "superjson";
import theme from "./styles/theme";

export type ProvidersProps = {
  children?: ReactNode | ReactNode[];
};
export default function Providers({ children }: ProvidersProps) {
  const apiUrl = "http://localhost:3000";
  console.log(apiUrl);

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: apiUrl + "/api/trpc",
            transformer: superjson,
          }),
        ],
      }),

    [],
  );

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
    [],
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
