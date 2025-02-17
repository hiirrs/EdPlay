import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const courseRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.course.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        instructorId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.course.create({
        data: input,
      });
    }),
});
