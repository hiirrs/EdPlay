import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET!;

export const createJWT = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '3h' });
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const createCookie = (token: string) => {
  return serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 1 * 60 * 60, 
    sameSite: 'lax',
  });
};
