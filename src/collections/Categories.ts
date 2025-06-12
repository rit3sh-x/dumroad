import { isSuperAdmin } from "@/lib/access"
import type { CollectionConfig } from "payload"

export const Categories: CollectionConfig = {
  slug: "categories",
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
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true
    },
    {
      name: "color",
      type: "text"
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false
    },
    {
      name: "subcategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true
    }
  ],
}