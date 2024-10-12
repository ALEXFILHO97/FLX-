import { prisma } from "@/app/api/prisma";
import trpc from "@/utils/trpc-server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const waybillRouter = trpc.router({
  getMany: trpc.procedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional(),
          cursor: z.number().optional(),
          name: z.string().optional(),
          nameUser: z.string().optional(),
          licence: z.string().optional(),
          id: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor;

      const items = await prisma.waybill.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
        where: {
          id: input?.id ? +input.id : undefined,
          license_plate: input?.licence
            ? { contains: input.licence, mode: "insensitive" }
            : undefined,
          driver: {
            name: input?.name
              ? { contains: input.name, mode: "insensitive" }
              : undefined,
          },
          user: {
            name: input?.nameUser
              ? { contains: input.nameUser, mode: "insensitive" }
              : undefined,
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          driver: {
            select: {
              name: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  count: trpc.procedure.query(async () => {
    const count = await prisma.waybill.count();

    return count;
  }),

  get: trpc.procedure.input(z.number()).query(async ({ input }) => {
    const res = await prisma.waybill.findUnique({
      where: {
        id: input,
      },
    });

    if (res == null) throw new TRPCError({ code: "NOT_FOUND" });

    return res;
  }),

  update: trpc.procedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          licence_place: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input: { id, data } }) => {
      const res = "ok";
      return res;
    }),
});

export default waybillRouter;
