import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
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
            }
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            admin: {
                description: "Your store's storefornt.",
            }
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "stripeAccountId",
            type: "text",
            required: true,
            admin: {
                readOnly: true,
            }
        },
        {
            name: "stripeDetailsSubmitted",
            type: "checkbox",
            admin: {
                readOnly: true,
                description: "You cannot create products until you have submitted your stripe details."
            }
        }
    ],
}