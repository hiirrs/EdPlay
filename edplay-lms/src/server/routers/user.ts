
// import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
// import type { Prisma } from "@prisma/client";
import { prisma } from '~/server/prisma';
import { router, publicProcedure } from "../trpc";
import { TRPCError } from '@trpc/server';
import { createJWT, createCookie } from '~/utils/jwt';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const userRouter = router({
    register: publicProcedure
        .input(
            z.object({
                username: z.string().min(3, 'username minimal terdiri dari 3 karakter'),
                fullname: z.string().min(3, 'nama lengkap minimal terdiri dari 3 karakter'),
                password: z.string().min(6, 'password minimal terdiri dari 6 karakter'),
                schoolId: z.number(),
                grade: z.number(),
            }),
        )
        .mutation(async ({ input }) => {
            const existingUser = await prisma.user.findUnique({
                where: { username: input.username },
            });

            if (existingUser) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'username ini sudah terdaftar',
                })
            }

            const hashedPass = await bcrypt.hash(input.password, 10);

            const user = await prisma.user.create({
                data: {
                    username: input.username,
                    fullname: input.fullname,
                    password: hashedPass,
                    schoolId: input.schoolId,
                    grade: input.grade,
                },
            });

            const token = jwt.sign(
                { userId: user.user_id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '3h' },
            );
            return { token, user };
        }),

    login: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            // const user = await prisma.user.findUnique({
            //     where: { username: input.username },
            // });
            const { res } = ctx;

            const user = await prisma.user.findUnique({
                where: { username: input.username },
              });
          
              if (!user) {
                throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: 'Username ini belum terdaftar',
                });
              }

            const isValid = await bcrypt.compare(input.password, user.password);
            if (!isValid) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'perikasa kembali kredensial anda',
                });
            }

            // const token = createJWT({ userId: user.user_id, role: user.role });
            const token = createJWT({ userId: user.user_id, role: user.role });

            if (!res) {
                throw new Error('Response object tidak tersedia di context!');
              }
              res.setHeader('Set-Cookie', createCookie(token));

            return { user: user };
        }),

    me: publicProcedure.query(async ({ ctx }) => {
        // Ensure the user is authenticated (ctx.user should be set by your auth middleware)
        if (!ctx.user) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Not authenticated',
            });
        }
        const user = await prisma.user.findUnique({
            where: { user_id: ctx.user.userId },
        });
        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        return user;
    }),

    logout: publicProcedure.mutation(({ ctx }) => {
        ctx.res.setHeader('Set-Cookie', 'token=; Path=/; Max-Age=0');
        return { success: true };
      }),
});