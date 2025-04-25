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

  create: publicProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        contents: z.array(
          z.object({
            contentType: z.enum(["text", "file", "link", "video"]),
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
              contentType: c.contentType,
              contentData: c.contentType === "text" ? sanitize(c.contentData) : c.contentData, // ✅ Sanitize hanya untuk text
              filePath: c.filePath,
            })),
          },
        },
      });

      return newModule;
    }),
    delete: publicProcedure
    .input(z.object({ id: z.number() }))    .mutation(async ({ input }) => {
      return prisma.module.delete({
        where: { id: input.id },
      });
    }),
});
