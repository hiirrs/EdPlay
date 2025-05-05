import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '~/server/prisma';
import { TRPCError } from '@trpc/server';

export const postRouter = router({
  // Ambil semua post berdasarkan courseId
  getByCourseId: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return prisma.post.findMany({
        where: { courseId: input.courseId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          text: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),

  // Buat post baru
  create: publicProcedure
    .input(z.object({
      courseId: z.number(),
      title: z.string().min(1),
      text: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return prisma.post.create({
        data: {
          title: input.title,
          text: input.text,
          courseId: input.courseId,
        },
        select: {
          id: true,
          title: true,
          text: true,
          createdAt: true,
          updatedAt: true,
          courseId: true,
        },
      });
    }),

  // Hapus post berdasarkan ID
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const post = await prisma.post.findUnique({
        where: { id: input.id },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post tidak ditemukan',
        });
      }

      await prisma.post.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
