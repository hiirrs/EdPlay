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
})
