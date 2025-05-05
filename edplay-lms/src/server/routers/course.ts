import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '~/server/prisma';
import { nanoid } from 'nanoid';
import { TRPCError } from '@trpc/server';

export const courseRouter = router({
  getByUserRole: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    if (user.role === 'teacher') {
      return prisma.course.findMany({
        where: { teacherId: user.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: {
            select: {
              user_id: true,
              fullname: true,
            },
          },
        },
      });
    } else if (user.role === 'student') {
      return prisma.enrollment.findMany({
        where: { userId: user.userId },
        include: {
          course: {
            include: {
              teacher: {
                select: {
                  user_id: true,
                  fullname: true,
                },
              },
            },
          },
        },
      }).then((data) => data.map((d) => d.course));
    } else {
      return prisma.course.findMany({
        include: {
          teacher: {
            select: {
              user_id: true,
              fullname: true,
            },
          },
        },
      });
    }
  }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      educationLevel: z.enum(['SD', 'SMP', 'SMA']),
      grade: z.number(),
      imageUrl: z.string().optional(),
    }))
    .mutation(({ input, ctx }) => {
      return prisma.course.create({
        data: {
          name: input.name,
          description: input.description,
          teacherId: ctx.user.userId,
          educationLevel: input.educationLevel,
          grade: input.grade,
          imageUrl: input.imageUrl ?? '/images/bgs/bg-class1.png',
          enrollToken: nanoid(10),
          isActive: true, // default aktif
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().optional(),
      educationLevel: z.enum(['SD', 'SMP', 'SMA']),
      grade: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(({ input }) => {
      return prisma.course.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          educationLevel: input.educationLevel,
          grade: input.grade,
          isActive: input.isActive,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      return prisma.course.delete({ where: { id: input.id } });
    }),

  enroll: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const course = await prisma.course.findUnique({
        where: { enrollToken: input.token },
      });

      if (!course) throw new Error('Token tidak valid');

      const alreadyEnrolled = await prisma.enrollment.findFirst({
        where: {
          courseId: course.id,
          userId: ctx.user.userId,
        },
      });

      if (alreadyEnrolled) throw new Error('Sudah terdaftar di kelas ini');

      return prisma.enrollment.create({
        data: {
          userId: ctx.user.userId,
          courseId: course.id,
          schoolId: ctx.user.schoolId,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const course = await prisma.course.findUnique({
        where: { id: input.id },
        include: {
          teacher: {
            select: {
              user_id: true,
              fullname: true,
            },
          },
        },
      });
      if (!course) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Kelas dengan ID ${input.id} tidak ditemukan`,
        });
      }
  
      return course;
    }),

});
