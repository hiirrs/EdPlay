import { z } from "zod"
import { prisma } from "../prisma"
import { router, publicProcedure } from "../trpc"

export const quizRouter = router({
  getByCourseId: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.quiz.findMany({
        where: { courseId: input.courseId },
        orderBy: { createdAt: "asc" },
      })
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      return await prisma.quiz.delete({
        where: { id: input.id },
      })
    }),
})
