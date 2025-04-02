import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { prisma } from '../prisma'
import { TRPCError } from '@trpc/server';

export const schoolRouter = router({
  getSchoolById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const school = await prisma.school.findUnique({
        where: { sch_id: input.id },
      });
      if (!school) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sekolah tidak ditemukan",
        });
      }
      return school;
    }),
  
    getSchools: publicProcedure
    .input(
      z.object({
        ed_level: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { ed_level, search } = input;
      const whereClause: Record<string, any> = {};

      if (ed_level) {
        whereClause.ed_level = ed_level;
      }

      if (search) {
        whereClause.sch_name = { contains: search, mode: "insensitive" };
      }

      const schools = await prisma.school.findMany({
        where: whereClause,
        orderBy: { sch_name: "asc" },
      });

      return schools;
    })

})