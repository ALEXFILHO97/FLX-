import userRouter from "@/server/user-route";
import waybillRouter from "@/server/waybill-route";
import trpc from "@/utils/trpc-server";

export const appRouter = trpc.router({
  users: userRouter,
  waybill: waybillRouter,
});

export type AppRouter = typeof appRouter;
