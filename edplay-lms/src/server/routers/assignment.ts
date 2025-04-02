import { z } from "zod"
import { prisma } from '../prisma'
import { router, publicProcedure } from "../trpc"

export const assignmentRouter = router({
  getByCourseId: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.assignment.findMany({
        where: { courseId: input.courseId },
        orderBy: { dueDate: "asc" },
      })
    }),
})
