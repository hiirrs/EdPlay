/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v11/router
 * @see https://trpc.io/docs/v11/procedures
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { transformer } from '~/utils/transformer';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/v11/data-transformers
   */
  transformer,
  /**
   * @see https://trpc.io/docs/v11/error-formatting
   */
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Create a router
 * @see https://trpc.io/docs/v11/router
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v11/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * Middleware untuk memeriksa autentikasi
 */
const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Anda harus login terlebih dahulu',
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * Merge multiple routers together
 * @see https://trpc.io/docs/v11/merging-routers
 */
export const mergeRouters = t.mergeRouters;

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/v11/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Create a protected procedure that requires authentication
 */
export const protectedProcedure = t.procedure.use(isAuthenticated);

/**
 * Middleware dan procedure untuk role admin
 */
export const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Anda harus login terlebih dahulu',
    });
  }
  
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Hanya admin yang diizinkan',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const adminProcedure = t.procedure.use(isAdmin);

/**
 * Middleware dan procedure untuk role guru
 */
export const isTeacher = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Anda harus login terlebih dahulu',
    });
  }
  
  if (ctx.user.role !== 'teacher' && ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Hanya guru yang diizinkan',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const teacherProcedure = t.procedure.use(isTeacher);

/**
 * Middleware dan procedure untuk role siswa
 */
export const isStudent = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Anda harus login terlebih dahulu',
    });
  }
  
  if (ctx.user.role !== 'student' && ctx.user.role !== 'teacher' && ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Akses tidak diizinkan',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const studentProcedure = t.procedure.use(isStudent);