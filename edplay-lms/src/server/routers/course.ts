import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { prisma } from '~/server/prisma';
import { nanoid } from 'nanoid';
import { TRPCError } from '@trpc/server';
import fs from 'fs';
import path from 'path';

const defaultImagesByGrade: Record<number, string> = {
  1: '/images/courses-bg/kls-1.png',
  2: '/images/courses-bg/kls-2.png',
  3: '/images/courses-bg/kls-3.png',
  4: '/images/courses-bg/kls-4.png',
  5: '/images/courses-bg/kls-5.png',
  6: '/images/courses-bg/kls-6.png',
  7: '/images/courses-bg/kls-7.png',
  8: '/images/courses-bg/kls-8.png',
  9: '/images/courses-bg/kls-9.png',
  10: '/images/courses-bg/kls-10.png',
  11: '/images/courses-bg/kls-11.png',
  12: '/images/courses-bg/kls-12.png',
};

function isCustomUpload(imageUrl: string | undefined) {
  return imageUrl?.startsWith('/uploads/');
}

// Improved input validation schema for course update
const courseUpdateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  educationLevel: z.enum(['SD', 'SMP', 'SMA']),
  grade: z.coerce.number(), // Use coerce to handle string inputs
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
});

// Improved input validation schema for course creation
const courseCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  educationLevel: z.enum(['SD', 'SMP', 'SMA']),
  grade: z.coerce.number(), // Use coerce to handle string inputs
  imageUrl: z.string().optional(),
  schoolId: z.number().optional(),
});

export const courseRouter = router({
  getByUserRole: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const includeExtras = {
      teacher: {
        select: { user_id: true, fullname: true },
      },
      assignments: {
        orderBy: { dueDate: 'desc' as const },
        take: 1,
        select: { dueDate: true },
      },
      modules: {
        orderBy: { createdAt: 'desc' as const },
        take: 1,
        select: { id: true },
      },
      quizzes: {
        where: { deadline: { gte: new Date() } },
        take: 1,
        select: { id: true },
      },
    };

    const mapCourse = (course: any) => {
      const assignment = course.assignments?.[0] ?? null;
      const deadline = assignment?.dueDate ? new Date(assignment.dueDate) : null;

      return {
        id: course.id,
        subject: course.name,
        description: course.description,
        educationLevel: course.educationLevel || 'SD', // Provide default value if undefined
        grade: typeof course.grade === 'number' ? course.grade : 1, // Ensure grade is a number
        class: `Kelas ${course.grade}`,
        token: course.enrollToken || '',
        imageUrl: course.imageUrl,
        teacher: course.teacher?.fullname ?? 'Tanpa Guru',
        isActive: course.isActive,
        hasNewMaterial: Array.isArray(course.modules) && course.modules.length > 0,
        hasExam: Array.isArray(course.quizzes) && course.quizzes.length > 0,
        taskDate: deadline?.toLocaleDateString('id-ID') ?? '',
        taskTime: deadline?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) ?? '',
        isEditable: user.role === 'teacher' || user.role === 'admin',
      };
    };

    if (user.role === 'teacher') {
      const courses = await prisma.course.findMany({
        where: { teacherId: user.userId },
        orderBy: { createdAt: 'desc' },
        include: includeExtras,
      });
      return courses.map(mapCourse);
    }

    if (user.role === 'student') {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.userId },
        include: {
          course: {
            include: includeExtras,
          },
        },
      });

      return enrollments.map((e) => mapCourse(e.course));
    }

    // Admin
    const courses = await prisma.course.findMany({
      include: includeExtras,
    });
    return courses.map(mapCourse);
  }),


  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const course = await prisma.course.findUnique({
        where: { id: input.id },
        include: {
          teacher: { select: { user_id: true, fullname: true } },
        },
      });
      if (!course) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Kelas tidak ditemukan' });
      }
      return course;
    }),

  create: protectedProcedure
    .input(courseCreateSchema)
    .mutation(({ input, ctx }) => {
      // Ensure grade is a number
      const grade = typeof input.grade === 'number' ? input.grade : 1;
      
      return prisma.course.create({
        data: {
          name: input.name,
          description: input.description,
          teacherId: ctx.user.userId,
          educationLevel: input.educationLevel,
          grade: grade,
          imageUrl: input.imageUrl || defaultImagesByGrade[grade],
          schoolId: input.schoolId || ctx.user.schoolId,
          enrollToken: nanoid(5),
          isActive: true,
        },
      });
    }),

  update: protectedProcedure
    .input(courseUpdateSchema)
    .mutation(async ({ input }) => {
      const course = await prisma.course.findUnique({ where: { id: input.id } });
      if (!course) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Kelas tidak ditemukan' });
      }

      if (isCustomUpload(course.imageUrl) && course.imageUrl !== input.imageUrl) {
        const oldImagePath = path.join(process.cwd(), 'public', course.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Ensure grade is a number
      const grade = typeof input.grade === 'number' ? input.grade : 1;

      return prisma.course.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          educationLevel: input.educationLevel,
          grade: grade,
          isActive: input.isActive,
          imageUrl: input.imageUrl ?? defaultImagesByGrade[grade],
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const course = await prisma.course.findUnique({ where: { id: input.id } });

      if (!course) throw new TRPCError({ code: 'NOT_FOUND', message: 'Kelas tidak ditemukan' });

      if (isCustomUpload(course.imageUrl)) {
        const imagePath = path.join(process.cwd(), 'public', course.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      return prisma.course.delete({ where: { id: input.id } });
    }),

  enroll: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const course = await prisma.course.findFirst({
        where: { enrollToken: input.token },
      });

      if (!course) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Token tidak ditemukan' });
      }

      const alreadyEnrolled = await prisma.enrollment.findFirst({
        where: {
          userId: ctx.user.userId,
          courseId: course.id,
        },
      });

      if (alreadyEnrolled) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Kamu sudah terdaftar di kelas ini',
        });
      }

      if (!ctx.user.schoolId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'School ID tidak ditemukan.',
        });
      }

      await prisma.enrollment.create({
        data: {
          userId: ctx.user.userId,
          courseId: course.id,
          schoolId: ctx.user.schoolId,
        },
      });

      return { success: true };
    }),
});