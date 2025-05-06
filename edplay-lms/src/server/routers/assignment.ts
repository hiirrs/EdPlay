import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
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

  getMyAssignments: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.userId;
    if (!userId) throw new Error("Unauthorized");

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true, course: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    const assignments = await prisma.assignment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: true,
        submissions: {
          where: { userId },
          select: {
            answerText: true,
            filesJson: true,
            submittedAt: true,
            score: true,
          },
        },
      },
      orderBy: { dueDate: 'desc' },
    });

    return assignments.map((a) => {
      const submission = a.submissions[0];
      let status: 'Unanswered' | 'Answered' | 'Submitted' = 'Unanswered';
      if (submission?.submittedAt) status = 'Submitted';
      else if (submission?.answerText || submission?.filesJson) status = 'Answered';

      return {
        id: a.id,
        courseId: a.courseId,
        courseCode: a.course?.id?.toString() ?? '-',
        courseName: a.course?.name ?? '',
        title: a.title,
        startDate: a.createdAt.toISOString(),
        endDate: a.dueDate?.toISOString() ?? '',
        score: submission.score ?? 0,
        status,
      };
    });
  }),
  getEnrolledStudentsWithSubmission: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        assignmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const enrolledStudents = await ctx.db.user.findMany({
        where: {
          enrollments: {
            some: {
              courseId: input.courseId,
            },
          },
          role: 'student',
        },
        select: {
          user_id: true,
          fullname: true,
          grade: true,
          submissions: {
            where: {
              assignmentId: input.assignmentId,
            },
            select: {
              submittedAt: true,
              answerText: true,
              filesJson: true,
            },
          },
        },
      });

      return enrolledStudents.map((student) => ({
        id: student.user_id,
        name: student.fullname ?? '',
        grade: student.grade ?? 0,
        status:
          student.submissions.length > 0 &&
            (student.submissions[0].answerText || student.submissions[0].filesJson)
            ? 'Sudah'
            : 'Belum',
      }));
    }),

});

