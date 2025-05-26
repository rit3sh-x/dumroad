import type { CollectionConfig } from "payload"

export const Products: CollectionConfig = {
    slug: "products",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "text"
        },
        {
            name: "price",
            type: "number",
            required: true,
            admin: {
                description: "Price in USD"
            }
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: false
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: false
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "refundPollicy",
            type: "select",
            options: ["30 Day", "14 Day", "7 Day", "3 Day", "1 Day", "No Refunds"],
            defaultValue: "30 Day"
        }
    ]
}