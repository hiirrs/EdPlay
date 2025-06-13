import jwt from 'jsonwebtoken';
// import { serialize } from 'cookie';


export const createJWT = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '3h' }
);

export const verifyJWT = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const createCookie = (token: string) => {
  // return serialize('token', token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   path: '/course',
  //   maxAge: 24 * 60 * 60,
  //   sameSite: 'lax',
  // });
  return `token=${token}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`; 
};

export const getUserFromToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
  } catch {
    return null;
  }
};
