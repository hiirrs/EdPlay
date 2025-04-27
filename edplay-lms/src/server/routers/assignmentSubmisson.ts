import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "~/server/prisma";

export const assignmentSubmissionRouter = router({
  submit: publicProcedure
    .input(z.object({
      assignmentId: z.number(),
      answerText: z.string().optional(),
      filePath: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.userId;
      if (!userId) throw new Error("Not authenticated");

      const existing = await prisma.assignmentSubmission.findFirst({
        where: {
          assignmentId: input.assignmentId,
          userId: userId,
        },
      });

      if (existing) {
        return prisma.assignmentSubmission.update({
          where: { id: existing.id },
          data: {
            answerText: input.answerText,
            answerFile: input.filePath,
            submittedAt: new Date(),
          },
        });
      } else {
        return prisma.assignmentSubmission.create({
          data: {
            assignmentId: input.assignmentId,
            userId: userId,
            answerText: input.answerText,
            answerFile: input.filePath,
          },
        });
      }
    }),

  cancel: publicProcedure
    .input(z.object({
      assignmentId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.userId;
      if (!userId) throw new Error("Not authenticated");

      const existing = await prisma.assignmentSubmission.findFirst({
        where: {
          assignmentId: input.assignmentId,
          userId: userId,
        },
      });

      if (existing) {
        return prisma.assignmentSubmission.update({
          where: { id: existing.id },
          data: {
            answerText: null,
            answerFile: null,
            submittedAt: '',
          },
        });
      } else {
        throw new Error("No existing submission found");
      }
    }),
});
