// import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { prisma } from '../prisma'
import { TRPCError } from '@trpc/server';

export const courseRouter = router({
  getAllCourse: publicProcedure
    .query(async () => {
      const courses = await prisma.course.findMany({
        include: {
            teacher: true,
          },
      });
      if (!courses) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sekolah tidak ditemukan",
        });
      }
      return courses;
    }),
})