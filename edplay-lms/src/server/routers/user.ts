import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { router, publicProcedure } from "../trpc";
import { TRPCError } from '@trpc/server';
import { createJWT, createCookie } from '~/utils/jwt';
import bcrypt from 'bcryptjs';

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
        .mutation(async ({ input, ctx }) => {
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

            const token = createJWT({ 
                userId: user.user_id, 
                role: user.role, 
                schoolId: user.schoolId 
            });
            
            // Set cookie pada response
            if (ctx.res) {
                ctx.res.setHeader('Set-Cookie', createCookie(token));
            }
            
            return { 
                user: {
                    user_id: user.user_id,
                    fullname: user.fullname,
                    role: user.role,
                    schoolId: user.schoolId
                } 
            };
        }),

    login: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user.findUnique({ where: { username: input.username } });

            if (!user || !(await bcrypt.compare(input.password, user.password))) {
                throw new TRPCError({ 
                    code: 'UNAUTHORIZED', 
                    message: 'Username atau password salah' 
                });
            }

            const token = createJWT({ 
                userId: user.user_id, 
                role: user.role, 
                schoolId: user.schoolId 
            });

            if (ctx.res) {
                ctx.res.setHeader('Set-Cookie', createCookie(token));
            }

            return { 
                user: {
                    user_id: user.user_id,
                    fullname: user.fullname,
                    role: user.role,
                    schoolId: user.schoolId
                } 
            };
        }),

    me: publicProcedure.query(async ({ ctx }) => {
        console.log('Context user in me procedure:', ctx.user);
        
        if (!ctx.user) {
            throw new TRPCError({ 
                code: 'UNAUTHORIZED',
                message: 'User tidak terautentikasi' 
            });
        }
        
        const user = await prisma.user.findUnique({
            where: { user_id: ctx.user.userId },
            select: { 
                user_id: true, 
                role: true, 
                fullname: true, 
                schoolId: true 
            },
        });
        
        if (!user) {
            throw new TRPCError({ 
                code: 'NOT_FOUND',
                message: 'User tidak ditemukan' 
            });
        }
        
        return user;
    }),

    logout: publicProcedure.mutation(({ ctx }) => {
        if (ctx.res) {
            ctx.res.setHeader('Set-Cookie', 'token=; Path=/; Max-Age=0');
        }
        return { success: true };
    }),
});