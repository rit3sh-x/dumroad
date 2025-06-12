import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
    tenantSlug: string;
    productId: string;
    isPurchased?: boolean;
    id: string
}

export const CartButton = ({ tenantSlug, productId, isPurchased, id }: Props) => {
    const cart = useCart(tenantSlug);

    if (isPurchased) {
        return (
            <Button variant={"elevated"} asChild className="flex-1 font-medium bg-white">
                <Link prefetch href={`/library/${id}`}>
                    View in Library
                </Link>
            </Button>
        )
    }

    return (
        <Button variant={"elevated"} className={cn("flex-1 bg-pink-500", cart.isProductInCart(productId) && "bg-white")} onClick={() => cart.toggleProduct(productId)}>
            {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
        </Button>
    )
}