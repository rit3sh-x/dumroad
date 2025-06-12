import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson"
import { headers as getHeaders } from 'next/headers';

export const createTRPCContext = cache(async () => {
    return { userId: 'user_123' };
});

const t = initTRPC.create({
    transformer: superjson
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
    const payload = await getPayload({
        config: configPromise,
    })
    return next({ ctx: { db: payload } });
});
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });

    if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User not logged in." })
    }
    return next({
        ctx: {
            ...ctx,
            session: {
                ...session,
                user: session.user
            }
        }
    })
});