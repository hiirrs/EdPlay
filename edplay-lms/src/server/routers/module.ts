import { ContentType } from "@prisma/client";
import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { prisma } from "~/server/prisma"
import { sanitize } from '~/utils/sanitize'

export const moduleRouter = router({
  getByCourseId: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return prisma.module.findMany({
        where: { courseId: input.courseId },
        include: {
          contents: true,
        },
      });
    }),

  getByModuleId: publicProcedure
    .input(z.object({ id: z.number() })).query(async ({ input }) => {
      return prisma.module.findUnique({
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

  create: publicProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        contents: z.array(
          z.object({
            contentTitle: z.string(),
            contentType: z.enum(["TEXT", "FILE", "LINK", "VIDEO"]),
            contentData: z.string(),
            filePath: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const newModule = await prisma.module.create({
        data: {
          courseId: input.courseId,
          title: input.title,
          description: input.description,
          contents: {
            create: input.contents.map((c) => ({
              contentTitle: c.contentTitle,
              contentType: ContentType[c.contentType.toUpperCase() as keyof typeof ContentType],
              contentData: c.contentType === "TEXT" ? sanitize(c.contentData) : c.contentData,
              filePath: c.filePath,
            })),
          },
        },
      });

      return newModule;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await prisma.moduleContent.deleteMany({
        where: { moduleId: input.id },
      });

      return prisma.module.delete({
        where: { id: input.id },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string().optional(),
        contents: z.array(
          z.object({
            contentTitle: z.string(),
            contentType: z.enum(['TEXT', 'FILE', 'LINK', 'VIDEO']),
            contentData: z.string(),
            filePath: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.moduleContent.deleteMany({ where: { moduleId: input.id } })
      return prisma.module.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          contents: {
            createMany: {
              data: input.contents.map((c) => ({
                contentTitle: c.contentTitle,
                contentType: ContentType[c.contentType.toUpperCase() as keyof typeof ContentType],
                contentData: c.contentData,
                filePath: c.filePath,
              })),
            },
          },
        },
      })
    }),
});
