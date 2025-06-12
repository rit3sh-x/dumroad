import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    id: string;
    name: string;
    imageUrl?: string | null;
    tenantSlug: string;
    tenantProfileUrl?: string | null;
    reviewsCount: number;
    rating: number;
}

export const ProductCard = ({
    id,
    name,
    imageUrl,
    tenantSlug,
    tenantProfileUrl,
    reviewsCount,
    rating,
}: ProductCardProps) => {
    return (
        <Link prefetch href={`library/${id}`}>
            <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square">
                    <Image alt={name} fill className="object-cover" src={imageUrl || "/placeholder.png"} />
                </div>
                <div className="p-4 border-y flex flex-col gap-3 flex-1">
                    <h2 className="text-lg font-medium line-clamp-4">{name}</h2>
                    <div className="flex items-center gap-2">
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
        </div>
    )
}