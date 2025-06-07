import { useCart } from "../../hooks/use-cart";
import { Button } from "@/components/ui/button";
import { cn, generateTenantURL } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

interface CheckoutButtonProps {
    className?: string;
    hideIfEmpty?: boolean;
    tenantSlug: string;
}

export const CheckouButton = ({ className, hideIfEmpty, tenantSlug }: CheckoutButtonProps) => {
    const cart = useCart(tenantSlug);

    if (hideIfEmpty && cart.totalItems == 0) return null;

    return (
        <Button variant={"elevated"} asChild className={cn("bg-white", className)}>
            <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
                <ShoppingCartIcon /> {cart.totalItems > 0 ? cart.totalItems : ""}
            </Link>
        </Button>
    )
}