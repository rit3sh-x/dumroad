import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import type { Sort, Where } from "payload";
import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "../search-params";
import { DEFAULT_TAG_MAX_LIMIT } from "@/constants";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";

export const productsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const headers = await getHeaders();
            const session = await ctx.db.auth({ headers });

            const product = await ctx.db.findByID({
                collection: "products",
                id: input.id,
                depth: 2,
                select: {
                    content: false
                }
            })

            if (!product) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
            }

            if (product.isArchived) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
            }

            let isPurchaned = false;

            if (session.user) {
                const orderData = await ctx.db.find({
                    collection: "orders",
                    pagination: false,
                    limit: 1,
                    where: {
                        and: [
                            {
                                product: {
                                    equals: input.id
                                }
                            },
                            {
                                user: {
                                    equals: session.user.id
                                }
                            }
                        ]
                    }
                })

                isPurchaned = !!orderData.docs[0];
            }

            const reviews = await ctx.db.find({
                collection: "reviews",
                pagination: false,
                where: {
                    product: {
                        equals: input.id
                    }
                }
            })

            const reviewRating = reviews.docs.length > 0 ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) : 0;

            const ratingDistribution: Record<number, number> = {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            }

            if (reviews.totalDocs > 0) {
                reviews.docs.forEach((review) => {
                    const rating = review.rating;
                    if (rating >= 1 && rating <= 5) ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
                });
                Object.keys(ratingDistribution).forEach((key) => {
                    const rating = Number(key);
                    const count = ratingDistribution[rating] || 0;
                    ratingDistribution[rating] = Math.round(count / reviews.totalDocs) * 100;
                })
            }

            return {
                ...product,
                reviewCount: reviews.totalDocs,
                reviewRating: reviewRating,
                ratingDistribution: ratingDistribution,
                isPurchased: isPurchaned,
                cover: product.cover as Media | null,
                image: product.image as Media | null,
                tenant: product.tenant as Tenant & { image: Media | null }
            }
        }),
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_TAG_MAX_LIMIT),
                category: z.string().nullable().optional(),
                minPrice: z.string().nullable().optional(),
                maxPrice: z.string().nullable().optional(),
                search: z.string().nullable().optional(),
                tags: z.array(z.string()).nullable().optional(),
                sort: z.enum(sortValues).nullable().optional(),
                tenantSlug: z.string().nullable().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: Where = {
                isArchived: {
                    not_equals: true
                }
            };
            let sort: Sort = "-createdAt";

            if (input.sort === "curated") sort = "-createdAt";
            if (input.sort === "trending") sort = "+createdAt";
            if (input.sort === "hot_and_new") sort = "-createdAt";

            if (input.minPrice && input.maxPrice) {
                where.price = {
                    less_than_equal: input.maxPrice,
                    greater_than_equal: input.minPrice
                }
            }
            else if (input.maxPrice) {
                where.price = {
                    less_than_equal: input.maxPrice
                }
            }
            else if (input.minPrice) {
                where.price = {
                    greater_than_equal: input.minPrice
                }
            }

            if (input.tenantSlug) {
                where["tenant.slug"] = {
                    equals: input.tenantSlug
                }
            } else {
                where["isPrivate"] = {
                    not_equals: true
                }
            }

            if (input.category) {
                const categoryData = await ctx.db.find({
                    collection: "categories",
                    limit: 1,
                    depth: 1,
                    pagination: false,
                    where: {
                        slug: {
                            equals: input.category
                        }
                    }
                })

                const formattedData = categoryData.docs.map((doc) => ({
                    ...doc,
                    subcategories: (doc.subcategories?.docs ?? []).map((subDoc) => ({
                        ...(subDoc as Category),
                        subcategories: undefined,
                    }))
                }))

                const subcategories = [];
                const parentCategory = formattedData[0];
                if (parentCategory) {
                    subcategories.push(...parentCategory.subcategories.map((sub) => sub.slug));
                    where["category.slug"] = {
                        in: [parentCategory.slug, ...subcategories]
                    }
                }
            }

            if (input.tags && input.tags.length) {
                where["tags.name"] = {
                    in: input.tags
                }
            }

            if (input.search) {
                where["name"] = {
                    like: input.search
                }
            }

            const data = await ctx.db.find({
                collection: "products",
                depth: 2,
                where,
                sort,
                page: input.cursor,
                limit: input.limit,
                select: {
                    content: false
                }
            })

            const dataWithSummarizedReviews = await Promise.all(
                data.docs.map(async (doc) => {
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
                ...data,
                docs: dataWithSummarizedReviews.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & { image: Media | null }
                }))
            };
        })
})