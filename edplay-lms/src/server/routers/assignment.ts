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
  // create: publicProcedure
  //   .input(
  //     z.object({
  //       courseId: z.number(),
  //       title: z.string(),
  //       description: z.string().optional(),
  //       dueDate: z.date(),
  //       contents: z.array(
  //         z.object({
  //           contentType: z.enum(["text", "file", "link", "video"]),
  //           contentData: z.string(),
  //           filePath: z.string().optional(),
  //         }),
  //       ),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const newAssignment = await prisma.assignment.create({
  //       data: {
  //         courseId: input.courseId,
  //         title: input.title,
  //         description: input.description,
  //         dueDate: input.dueDate,
  //         contents: {
  //           create: input.contents.map((c) => ({
  //             contentType: c.contentType,
  //             contentData:
  //               c.contentType === "text" ? sanitize(c.contentData) : c.contentData, // ✅ Sanitize hanya untuk text
  //             filePath: c.filePath,
  //           })),
  //         },
  //       },
  //     })
  //     return newAssignment
  //   }),
  delete: publicProcedure
    .input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      return await prisma.assignment.delete({
        where: { id: input.id },
      })
    }),
})
