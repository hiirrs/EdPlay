import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "~/server/prisma";

export const assignmentRouter = router({
  getByCourseId: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return prisma.assignment.findMany({
        where: { courseId: input.courseId },
        include: { contents: true },
        orderBy: { createdAt: "asc" },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return prisma.assignment.findUnique({
        where: { id: input.id },
        include: {
          contents: {
            select: {
              id: true,
              contentType: true,
              contentData: true,
              filePath: true,
              contentTitle: true,
            },
          },
        },
      });
    }),
  getSubmissionsByAssignmentId: publicProcedure
    .input(z.object({ assignmentId: z.number() }))
    .query(async ({ input }) => {
      return prisma.assignmentSubmission.findMany({
        where: { assignmentId: input.assignmentId },
        include: { user: true },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        contents: z.array(
          z.object({
            contentTitle: z.string(),
            contentType: z.enum(["TEXT", "FILE", "LINK", "VIDEO"]),
            contentData: z.string(),
            filePath: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.assignment.create({
        data: {
          courseId: input.courseId,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          contents: {
            create: input.contents.map((c) => ({
              contentTitle: c.contentTitle,
              contentType: c.contentType,
              contentData: c.contentData,
              filePath: c.filePath,
            })),
          },
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        contents: z.array(
          z.object({
            contentTitle: z.string(),
            contentType: z.enum(["TEXT", "FILE", "LINK", "VIDEO"]),
            contentData: z.string(),
            filePath: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.assignmentContent.deleteMany({ where: { assignmentId: input.id } });
      return prisma.assignment.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          contents: {
            createMany: {
              data: input.contents.map((c) => ({
                contentTitle: c.contentTitle,
                contentType: c.contentType,
                contentData: c.contentData,
                filePath: c.filePath,
              })),
            },
          },
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await prisma.assignmentContent.deleteMany({ where: { assignmentId: input.id } });
      return prisma.assignment.delete({ where: { id: input.id } });
    }),
});

