import { generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    id: string;
    name: string;
    imageUrl?: string | null;
    tenantSlug: string;
    tenantProfileUrl?: string | null;
    price: number;
    reviewsCount: number;
    rating: number;
}

export const ProductCard = ({
    id,
    name,
    imageUrl,
    tenantSlug,
    tenantProfileUrl,
    price,
    reviewsCount,
    rating,
}: ProductCardProps) => {
    const router = useRouter();
    const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(generateTenantURL(tenantSlug))
    }

    return (
        <Link href={"/"}>
            <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square">
                    <Image alt={name} fill className="object-cover" src={imageUrl || "/placeholder.png"} />
                </div>
                <div className="p-4 border-y flex flex-col gap-3 flex-1">
                    <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
                    <div className="flex items-center gap-2" onClick={handleUserClick}>
                        {tenantProfileUrl && (
                            <Image alt={tenantSlug} src={tenantProfileUrl} className="rounded-full border shrink-0 size-[16px]" width={16} height={16} />
                        )}
                        <p className="text-sm underline font-medium">{tenantSlug}</p>
                    </div>
                    {reviewsCount > 0 && (
                        <div className="flex items-center gap-1">
                            <StarIcon className="size-3.5 fill-black" />
                            <p className="text-sm font-medium">
                                {rating} ({reviewsCount})
                            </p>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="relative px-2 py-1 border bg-pink-500 w-fit">
                        <p className="text-sm font-medium">
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0
                            }).format(Number(price))}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export const ProductCardSkeleton = () => {
    return (
        <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border border-black/50 rounded-md bg-white overflow-hidden h-full flex flex-col animate-pulse">
            <div className="relative aspect-square bg-neutral-200" />
            <div className="p-4 border-y border-black/50 flex flex-col gap-3 flex-1">
                <div className="space-y-1">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 rounded w-full" />
                    <div className="h-4 bg-neutral-200 rounded w-5/6" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-neutral-200 size-4" />
                    <div className="h-3 w-24 bg-neutral-200 rounded" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 bg-neutral-200 rounded" />
                    <div className="h-3 w-16 bg-neutral-200 rounded" />
                </div>
            </div>
            <div className="p-4">
                <div className="px-2 py-1 bg-neutral-200 w-20 h-5 rounded border border-black/50" />
            </div>
        </div>
    )
}