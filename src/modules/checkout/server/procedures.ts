import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { PLATFORM_FREE_PERCENTAGE } from "@/constants";
import { generateTenantURL } from "@/lib/utils";

export const checkoutRouter = createTRPCRouter({
    verify: protectedProcedure
        .mutation(async ({ ctx }) => {
            const user = await ctx.db.findByID({
                collection: "users",
                id: ctx.session.user.id,
                depth: 0
            })

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                })
            }

            const tenantId = user.tenants?.[0]?.tenant as string;

            const tenant = await ctx.db.findByID({
                collection: "tenants",
                id: tenantId
            })

            if (!tenant) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Tenant not found",
                })
            }
            
            const accountLink = await stripe.accountLinks.create({
                account: tenant.stripeAccountId,
                refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
                type: "account_onboarding"
            })

            if (!accountLink.url) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to create verification URL.",
                })
            }

            return { url: accountLink.url }
        }),
    purchase: protectedProcedure
        .input(
            z.object({
                productIds: z.array(z.string()).min(1),
                tenantSlug: z.string().min(3)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const products = await ctx.db.find({
                collection: "products",
                depth: 2,
                select: {
                    content: false
                },
                where: {
                    and: [
                        {
                            id: {
                                in: input.productIds
                            }
                        },
                        {
                            "tenant.slug": {
                                equals: input.tenantSlug
                            }
                        },
                        {
                            isArchived: {
                                not_equals: true
                            }
                        }
                    ]
                }
            })

            if (products.totalDocs !== input.productIds.length) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Products not found." })
            }

            const tenantData = await ctx.db.find({
                collection: "tenants",
                limit: 1,
                pagination: false,
                where: {
                    slug: {
                        equals: input.tenantSlug
                    }
                }
            })

            const tenant = tenantData.docs[0];

            if (!tenant) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Incorrect vendor." })
            }

            if (!tenant.stripeDetailsSubmitted) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Tenant not allowed." })
            }

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
                products.docs.map((product) => ({
                    quantity: 1,
                    price_data: {
                        currency: 'inr',
                        unit_amount: product.price * 100,
                        product_data: {
                            name: product.name,
                            metadata: {
                                stripeAccountId: tenant.stripeAccountId,
                                name: product.name,
                                id: product.id,
                                price: product.price
                            } as ProductMetadata
                        }
                    }
                }));

            const totalAmout = products.docs.reduce((acc, item) => acc + item.price * 100, 0);

            const platformFree = Math.round((totalAmout * PLATFORM_FREE_PERCENTAGE) / 100);

            const domain = generateTenantURL(input.tenantSlug);

            const checkout = await stripe.checkout.sessions.create({
                customer_email: ctx.session.user.email,
                success_url: `${domain}/checkout?success=true`,
                cancel_url: `${domain}/checkout?success=false`,
                mode: "payment",
                line_items: lineItems,
                invoice_creation: {
                    enabled: true
                },
                metadata: {
                    userId: ctx.session.user.id
                } as CheckoutMetadata,
                payment_intent_data: {
                    application_fee_amount: platformFree
                }
            }, {
                stripeAccount: tenant.stripeAccountId
            })

            if (!checkout.url) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create checkout session." })
            }

            return { url: checkout.url }
        }),

    getProducts: baseProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.find({
                collection: "products",
                depth: 2,
                select: {
                    content: false
                },
                where: {
                    and: [
                        {
                            id: {
                                in: input.ids
                            }
                        },
                        {
                            isArchived: {
                                not_equals: true
                            }
                        }
                    ],
                }
            })

            if (data.totalDocs !== input.ids.length) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
            }

            const totalPrice = data.docs.reduce((acc, product) => {
                const price = Number(product.price);
                return acc + (!isNaN(price) ? price : 0)
            }, 0)

            return {
                ...data,
                totalPrice: totalPrice,
                docs: data.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & { image: Media | null }
                }))
            };
        })
})