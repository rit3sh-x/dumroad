import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { Media, Tenant } from "@/payload-types";
import { DEFAULT_TAG_MAX_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";

export const libraryRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(
            z.object({
                productId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.find({
                collection: "orders",
                depth: 0,
                where: {
                    and: [
                        {
                            product: {
                                equals: input.productId
                            },
                            user: {
                                equals: ctx.session.user.id
                            }
                        }
                    ]
                },
                pagination: false,
                limit: 1
            })

            const order = data.docs[0];

            if (!order) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Order not found",
                })
            }

            const productData = await ctx.db.findByID({
                collection: "products",
                id: input.productId
            });

            if (!productData) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found",
                })
            }

            return productData
        }),
    getMany: protectedProcedure
        .input(
            z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_TAG_MAX_LIMIT),
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.find({
                collection: "orders",
                depth: 0,
                where: {
                    user: {
                        equals: ctx.session.user.id
                    }
                },
                page: input.cursor,
                limit: input.limit
            })

            const productIds = data.docs.map((order) => order.product)

            const productData = await ctx.db.find({
                collection: "products",
                depth: 2,
                pagination: false,
                where: {
                    id: {
                        in: productIds,
                    }
                }
            })

            const dataWithSummarizedReviews = await Promise.all(
                productData.docs.map(async (doc) => {
                    const review = await ctx.db.find({
                        collection: "reviews",
                        pagination: false,
                        where: {
                            product: {
                                equals: doc.id
                            }
                        }
                    })
                    return {
                        ...doc,
                        reviewCount: review.totalDocs,
                        reviewRating:
                            review.docs.length === 0
                                ? 0
                                : review.docs.reduce((acc, rev) => acc + rev.rating, 0) / review.totalDocs
                    }
                })
            )

            return {
                ...productData,
                docs: dataWithSummarizedReviews.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & { image: Media | null }
                }))
            };
        })
})