import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    hidden: ({ user }) => isSuperAdmin(user),
    enableRichTextLink: true,
    enableRichTextRelationship: true
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}