import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        password: z.string().min(6),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.create({
        data: input,
      });
    }),
});
