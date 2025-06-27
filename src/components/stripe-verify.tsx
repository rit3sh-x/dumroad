'use client';

import { Button, Link } from "@payloadcms/ui";
import { useAuth } from "@payloadcms/ui";

interface TenantRelation {
    tenant: {
        id: string;
        stripeAccountId?: string;
        stripeDetailsSubmitted?: boolean;
        name: string;
        slug: string;
    };
}

export const StripeVerify = () => {
    const { user } = useAuth();

    if (!user) return null;

    const hasUnverifiedStripeAccount = user.tenants?.some((tenantRelation: TenantRelation) => {
        const tenant = tenantRelation.tenant;
        return tenant?.stripeAccountId && !tenant?.stripeDetailsSubmitted;
    });

    if (!hasUnverifiedStripeAccount) {
        return null;
    }

    return (
        <Link href="/stripe-verify">
            <Button>
                Verify Stripe Account
            </Button>
        </Link>
    )
}