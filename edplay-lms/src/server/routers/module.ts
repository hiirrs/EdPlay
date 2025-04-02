// src/server/api/routers/module.ts
import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { prisma } from "~/server/prisma"

export const moduleRouter = router({
    getByCourseId: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return prisma.module.findMany({
        where: { courseId: input.courseId },
        include: {
          contents: true, 
        },
      })
    }),
})
