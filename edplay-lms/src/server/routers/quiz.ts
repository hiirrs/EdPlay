import { z } from "zod"
import { prisma } from "../prisma"
import { router, publicProcedure, protectedProcedure } from "../trpc"

export const quizRouter = router({
  getByCourseId: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.quiz.findMany({
        where: { courseId: input.courseId },
        orderBy: { createdAt: "asc" },
      })
    }),

    getMeta: publicProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.quiz.findUnique({
        where: { id: input.quizId },
        include: {
          questions: {
            include: {
              answerOptions: true,
            },
            orderBy: { id: 'asc' },
          },
        },
      });
    }),
  

  getQuestions: protectedProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input }) => {
      const questions = await prisma.question.findMany({
        where: { quizId: input.quizId },
        include: {
          answerOptions: {
            select: {
              id: true,
              text: true,
              isCorrect: true,
            },
          },
        },
        orderBy: { id: 'asc' },
      });

      return questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        imageUrl: q.imageUrl ?? null,
        options:
          q.questionType !== 'short_answer' && q.answerOptions
            ? q.answerOptions.map((opt) => ({
              id: opt.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
            }))
            : undefined,
      }));
    }),


  submitAnswers: protectedProcedure
    .input(
      z.object({
        quizId: z.number(),
        answers: z.array(
          z.object({
            questionId: z.number(),
            answer: z.union([z.string(), z.array(z.number())]),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.userId;
      if (!userId) throw new Error("Unauthorized");

      const submissions = input.answers.map((a) => ({
        questionId: a.questionId,
        studentId: userId,
        answerText: Array.isArray(a.answer)
          ? a.answer.join(',')
          : a.answer,
      }));

      await prisma.answer.createMany({
        data: submissions,
        skipDuplicates: true,
      });

      return { success: true };
    }),

  create: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      title: z.string(),
      description: z.string().optional(),
      questions: z.array(
        z.object({
          questionText: z.string(),
          questionType: z.enum(["multiple_choice", "short_answer", "true_false"]),
          answerOptions: z.array(
            z.object({
              text: z.string(),
              isCorrect: z.boolean(),
            })
          ).optional(),
        }).superRefine((q, ctx) => {
          if (q.questionType === 'short_answer' && q.answerOptions) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Pertanyaan bertipe "short_answer" tidak boleh memiliki opsi',
              path: ['answerOptions'],
            });
          }

          if (
            q.questionType !== 'short_answer' &&
            (!q.answerOptions || q.answerOptions.length === 0)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Pertanyaan bertipe pilihan harus memiliki minimal satu opsi',
              path: ['answerOptions'],
            });
          }
        })
      ),
    }))
    .mutation(async ({ input }) => {
      console.log('🔥 Payload diterima di backend:');
      console.dir(input, { depth: null });

      try {
        // First, create the quiz
        const quiz = await prisma.quiz.create({
          data: {
            courseId: input.courseId,
            title: input.title,
            description: input.description,
          },
        });

        // Process each question
        for (const q of input.questions) {
          // Create the question
          const question = await prisma.question.create({
            data: {
              quizId: quiz.id,
              questionText: q.questionText,
              questionType: q.questionType,
            },
          });


          if (q.questionType !== 'short_answer' && q.answerOptions && q.answerOptions.length > 0) {
            for (const option of q.answerOptions) {
              await prisma.$executeRaw`
                INSERT INTO "AnswerOption" ("questionId", "text", "isCorrect") 
                VALUES (${question.id}, ${option.text}, ${option.isCorrect})
              `;
            }
          }
        }

        return quiz;
      } catch (error) {
        console.error('Error creating quiz:', error);
        throw error;
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.quiz.delete({
        where: { id: input.id },
      })
    }),
  update: protectedProcedure
    .input(z.object({
      quizId: z.number(),
      title: z.string(),
      description: z.string().optional(),
      questions: z.array(
        z.object({
          questionText: z.string(),
          questionType: z.enum(["multiple_choice", "short_answer", "true_false", "checkbox_multiple"]),
          imageUrl: z.string().optional(),
          answerOptions: z.array(
            z.object({
              text: z.string(),
              isCorrect: z.boolean(),
            })
          ).optional(),
        })
      ),
    }))
    .mutation(async ({ input }) => {
      const { quizId, title, description, questions } = input;

      await prisma.quiz.update({
        where: { id: quizId },
        data: {
          title,
          description,
        },
      });

      const oldQuestions = await prisma.question.findMany({
        where: { quizId },
      });

      for (const q of oldQuestions) {
        await prisma.answerOption.deleteMany({ where: { questionId: q.id } });
      }
      await prisma.question.deleteMany({ where: { quizId } });

      for (const q of questions) {
        const newQuestion = await prisma.question.create({
          data: {
            quizId,
            questionText: q.questionText,
            questionType: q.questionType,
            imageUrl: q.imageUrl || null,
          },
        });

        if (
          q.questionType !== 'short_answer' &&
          q.answerOptions &&
          q.answerOptions.length > 0
        ) {
          await prisma.answerOption.createMany({
            data: q.answerOptions.map((opt) => ({
              questionId: newQuestion.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          });
        }
      }

      return { success: true };
    }),

});