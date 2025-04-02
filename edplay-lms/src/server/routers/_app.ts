/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { assignmentRouter } from './assignment';
import { courseRouter } from './course';
import { moduleRouter } from './module';
import { postRouter } from './post';
import { quizRouter } from './quiz';
import { schoolRouter } from './school';
import { userRouter } from './user';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,
  user: userRouter,
  school: schoolRouter,
  course: courseRouter,
  module: moduleRouter,
  assignment: assignmentRouter,
  quiz: quizRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
