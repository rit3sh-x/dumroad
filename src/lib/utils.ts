import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTenantURL(slug: string) {
  const isSubdomainEnabled = process.env.NEXT_PUBLIC_SUBDOMAIN_ROUTING_ENABLED === "true";
  if (!isSubdomainEnabled) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${slug}`
  }

  let protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  if (process.env.NODE_ENV === "development") {
    protocol = "http";
  }

  return `${protocol}://${slug}.${domain}`;
}

export function formatCurrency(price: string | number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(price))
}