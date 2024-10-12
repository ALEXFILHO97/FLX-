"use server";

import { AppRouter } from "@/app/api/trpc/trpc-route";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { apiUrl } from "./constants";

export const proxyClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiUrl + "/api/trpc",
      transformer: superjson,
    }),
  ],
});
