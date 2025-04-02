/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from 'jsonwebtoken';
import type * as trpcNext from '@trpc/server/adapters/next';

interface CreateContextOptions {
  req: trpcNext.CreateNextContextOptions['req'];
  // session: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner({ req }: CreateContextOptions) {
  let user = undefined;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET!);
      user = { userId: (decode as any).userId, role: (decode as any).role };
    } catch (error) {

    }
  }
  return { user };
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

  return await createContextInner({ req: opts.req });
}
