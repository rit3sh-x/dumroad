import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        hidden: ({ user }) => !isSuperAdmin(user),
        useAsTitle: "name"
      },
      access: {
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req }) => isSuperAdmin(req.user),
        read: () => true,
      },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            unique: true
        },
        {
            name: "products",
            type: "relationship",
            relationTo: "products",
            hasMany: true,
        }
    ],
}