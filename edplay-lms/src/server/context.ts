import type * as trpcNext from '@trpc/server/adapters/next';
import { verifyJWT } from '../utils/jwt';
import { parse } from 'cookie';
import { prisma } from './prisma';

/**
 * Tipe payload token JWT yang kita harapkan.
 */
export interface DecodedToken {
  userId: number;
  role: 'admin' | 'teacher' | 'student';
  schoolId: number; 
}

/**
 * Digunakan saat testing atau untuk membuat context secara manual.
 */
interface CreateContextOptions {
  req: trpcNext.CreateNextContextOptions['req'];
  res: trpcNext.CreateNextContextOptions['res'];
}

/**
 * Fungsi utama untuk membuat context, dipanggil dari tRPC handler.
 */
export async function createContextInner({ req, res }: CreateContextOptions) {
  let user: DecodedToken | undefined = undefined;

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (token) {
    try {
      const decoded = verifyJWT(token) as DecodedToken;
      user = { userId: decoded.userId, role: decoded.role, schoolId: decoded.schoolId };
    } catch (error) {
      console.error('[JWT ERROR]', error);
      // Token tidak valid, hapus cookie
      res.setHeader('Set-Cookie', 'token=; Path=/; Max-Age=0');
    }
  }

  return {
    req,
    res,
    user,
    db: prisma,
  };
}

/**
 * Fungsi ini akan dipanggil langsung oleh `createNextApiHandler`
 */
export function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  return createContextInner({ req: opts.req, res: opts.res });
}

/**
 * Type context global yang bisa digunakan di seluruh router tRPC.
 */
export type Context = Awaited<ReturnType<typeof createContextInner>>;
