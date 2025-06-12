import { isSuperAdmin } from "@/lib/access"
import { Tenant } from "@/payload-types";
import { defaultEditorFeatures, lexicalEditor, UploadFeature } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload"

export const Products: CollectionConfig = {
    slug: "products",
    access: {
        create: ({ req }) => {
            if (isSuperAdmin(req.user)) return true;
            const tenant = req.user?.tenants?.[0]?.tenant as Tenant;
            return Boolean(tenant?.stripeDetailsSubmitted)
        },
        delete: ({ req }) => isSuperAdmin(req.user),
    },
    admin: {
        useAsTitle: "name",
        description: "Account must be verified to create products."
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "richText"
        },
        {
            name: "price",
            type: "number",
            required: true,
            admin: {
                description: "Price in INR"
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
            name: "cover",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "refundPolicy",
            type: "select",
            options: ["30 Day", "14 Day", "7 Day", "3 Day", "1 Day", "No Refunds"],
            defaultValue: "30 Day"
        },
        {
            name: "content",
            type: "richText",
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                    ...defaultFeatures,
                    UploadFeature({
                        collections: {
                            media: {
                                fields: [
                                    {
                                        name: "name",
                                        type: "text"
                                    }
                                ]
                            }
                        }
                    })
                ]
            }),
            admin: {
                description: "Protected content visible when purchased. Add all necessary doccuments required in this. (Supports markdown formatting)"
            }
        },
        {
            name: "isArchived",
            label: "Archive",
            type: "checkbox",
            defaultValue: false,
            admin: {
                description: "Enable this to archive the product."
            }
        },
        {
            name: "isPrivate",
            label: "Private",
            type: "checkbox",
            defaultValue: false,
            admin: {
                description: "Enable this to hide product from general listing and only show it in your store."
            }
        }
    ]
}