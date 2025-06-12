import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    access: {
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req }) => isSuperAdmin(req.user),
    },
    admin: {
        useAsTitle: 'slug',
    },
    fields: [
        {
            name: "name",
            required: true,
            type: "text",
            label: "Store Name",
            admin: {
                description: "Your store's description.",
            },
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            admin: {
                description: "Your store's storefront.",
            },
            access: {
                update: ({ req }) => isSuperAdmin(req.user),
            },
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
        },
        {
            name: "stripeAccountId",
            type: "text",
            required: true,
            access: {
                update: ({ req }) => isSuperAdmin(req.user),
            },
            admin: {
                description: "Stripe account ID related to your shop.",
            },
        },
        {
            name: "stripeDetailsSubmitted",
            type: "checkbox",
            access: {
                update: ({ req }) => isSuperAdmin(req.user),
            },
            admin: {
                description:
                    "You cannot create products until you have submitted your stripe details.",
            },
        },
    ],
}