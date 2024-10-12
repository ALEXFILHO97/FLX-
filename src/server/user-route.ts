import { prisma } from "@/app/api/prisma";
import trpc from "@/utils/trpc-server";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";

const userRouter = trpc.router({
  create: trpc.procedure
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
        email: z.string(),
        status: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await prisma.user.create({
        data: {
          password_hash: await bcrypt.hash(input.password, 12),
          email: input.email,
          name: input.name,
          status: input.status,
        },
      });

      return res;
    }),

  getMany: trpc.procedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional(),
          cursor: z.number().optional(),
          name: z.string().optional(),
          email: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor;

      const items = await prisma.user.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          created_at: "desc",
        },
        where: {
          name: input?.name
            ? { contains: input.name, mode: "insensitive" }
            : undefined,
          email: input?.email
            ? { contains: input.email, mode: "insensitive" }
            : undefined,
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
    const count = await prisma.user.count();

    return count;
  }),

  get: trpc.procedure.input(z.number()).query(async ({ input }) => {
    const res = await prisma.user.findUnique({
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
          name: z.string().optional(),
          email: z.string().optional(),
          status: z.boolean().optional(),
          password_hash: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input: { id, data } }) => {
      const res = await prisma.user.update({ where: { id }, data });
      return res;
    }),

  delete: trpc.procedure.input(z.number()).mutation(async ({ input }) => {
    const res = await prisma.user.delete({ where: { id: input } });
    return res;
  }),
});

export default userRouter;
