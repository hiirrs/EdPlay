/* eslint-disable @typescript-eslint/no-unused-vars */
// import jwt from 'jsonwebtoken';
import type * as trpcNext from '@trpc/server/adapters/next';
import { verifyJWT } from '../utils/jwt';
import { parse } from 'cookie';

interface CreateContextOptions {
  req: trpcNext.CreateNextContextOptions['req'];
  res: trpcNext.CreateNextContextOptions['res'];
  // session: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner({ req, res }: CreateContextOptions) {
  let user = undefined;
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (token) {
    try {
      const decode = verifyJWT(token);
      user = { userId: (decode as any).userId, role: (decode as any).role };
    } catch (err) {
      console.error('JWT error:', err);
    }
  }

  return { user, res };
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;

/**
 * Creates context for an incoming request
 * @see https://trpc.io/docs/v11/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/v11/caching

  return await createContextInner({ req: opts.req, res:opts.res });
}
