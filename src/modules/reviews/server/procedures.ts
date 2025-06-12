import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { DEFAULT_TAG_MAX_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(
            z.object({
                productId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.findByID({
                collection: "products",
                id: input.productId
            })

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found."
                })
            }

            const reviewData = await ctx.db.find({
                collection: "reviews",
                limit: 1,
                where: {
                    and: [
                        {
                            product: {
                                equals: data.id
                            },
                            user: {
                                equals: ctx.session.user.id
                            }
                        }
                    ]
                }
            });

            const review = reviewData.docs[0];

            if (!review) {
                return null;
            }

            return review;
        }),
        
    create: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                rating: z.number().min(1, { message: "Rating is required." }).max(5),
                description: z.string().min(3, { message: "A description is needed." }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const data = await ctx.db.findByID({
                collection: "products",
                id: input.productId
            })

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found."
                })
            }

            const reviewData = await ctx.db.find({
                collection: "reviews",
                limit: 1,
                where: {
                    and: [
                        {
                            product: {
                                equals: data.id
                            },
                            user: {
                                equals: ctx.session.user.id
                            }
                        }
                    ]
                }
            });

            if (reviewData.docs.length > 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You've already reviewd the product",
                })
            }

            const review = await ctx.db.create({
                collection: "reviews",
                data: {
                    user: ctx.session.user.id,
                    product: data.id,
                    description: input.description,
                    rating: input.rating
                }
            })
            return review;
        }),

    update: protectedProcedure
        .input(
            z.object({
                reviewId: z.string(),
                rating: z.number().min(1, { message: "Rating is required." }).max(5),
                description: z.string().min(3, { message: "A description is needed." }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const data = await ctx.db.findByID({
                collection: "reviews",
                id: input.reviewId,
                depth: 0
            })

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Review not found."
                })
            }

            if (data.user !== ctx.session.user.id) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You're not allowed."
                })
            }

            const review = await ctx.db.update({
                collection: "reviews",
                id: input.reviewId,
                data: {
                    description: input.description,
                    rating: input.rating
                }
            })
            return review;
        }),
})