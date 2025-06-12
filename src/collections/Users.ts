import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields"
import { isSuperAdmin } from '@/lib/access'

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true;
      return req.user?.id === id;
    },
    unlock: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    hidden: ({ user }) => !isSuperAdmin(user),
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: "username",
      required: true,
      unique: true,
      type: "text"
    },
    {
      admin: {
        position: "sidebar"
      },
      name: "roles",
      type: "select",
      defaultValue: "user",
      hasMany: true,
      options: ["user", "super-admin"],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      }
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar"
      },
    },
  ],
}