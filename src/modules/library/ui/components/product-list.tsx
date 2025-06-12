"use client";

import { useTRPC } from "@/trpc/client"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { DEFAULT_TAG_MAX_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";

export const ProductList = () => {
    const trpc = useTRPC();
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(trpc.library.getMany.infiniteQueryOptions(
        {
            limit: DEFAULT_TAG_MAX_LIMIT
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            }
        }
    ));

    if (data.pages?.[0]?.docs.length === 0) {
        return (
            <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                <InboxIcon />
                <p className="text-base font-medium">No products found</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {data.pages.flatMap((page) => page.docs).map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        imageUrl={product.image?.url}
                        tenantSlug={product.tenant?.slug}
                        tenantProfileUrl={product.tenant.image?.url}
                        reviewsCount={product.reviewCount}
                        rating={product.reviewRating}
                    />
                ))}
            </div>
            <div className="flex justify-center pt-8">
                {hasNextPage && (
                    <Button variant={"elevated"} disabled={isFetchingNextPage} onClick={() => fetchNextPage()} className="font-medium disabled:opacity-50 text-base bg-white">
                        Load more
                    </Button>
                )}
            </div>
        </>
    )
}

interface Props {
    narrowView?: boolean
}

export const ProductListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: DEFAULT_TAG_MAX_LIMIT }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    )
}