"use client"

import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { RichText } from "@payloadcms/richtext-lexical/react";

const CartButton = dynamic(
    () => import("../components/cart-button").then(
        (mod) => mod.CartButton,
    ),
    {
        ssr: false,
        loading: () => (
            <Button className="flex-1 bg-pink-500" disabled>
                Add to cart
            </Button>
        )
    }
)

interface ProductViewProps {
    productId: string;
    slug: string;
}

export const ProductView = ({ productId, slug }: ProductViewProps) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({
        id: productId,
    }))
    const [isCopied, setIsCopied] = useState<boolean>(false);

    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border rounded-sm bg-white overflow-hidden">
                <div className="relative aspect-[4.5] border-b">
                    <Image src={data.cover?.url || "/placeholder.png"} alt={data.name} fill className="object-cover" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="col-span-4">
                        <div className="p-6">
                            <h1 className="text-4xl font-medium">
                                {data.name}
                            </h1>
                        </div>
                        <div className="border-y flex">
                            <div className="px-6 py-4 flex items-center justify-center border-r">
                                <div className="px-2 py-1 border bg-pink-400 w-fit">
                                    <p className="text-base font-medium">{formatCurrency(data.price)}</p>
                                </div>
                            </div>
                            <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                                <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
                                    {data.tenant.image?.url && (
                                        <Image src={data.tenant.image.url} alt={data.tenant.name} width={32} height={32} className="rounded-full border shrink-0 size-[32px]" />
                                    )}
                                    <p className="text-base underline font-medium">
                                        {data.tenant.name}
                                    </p>
                                </Link>
                            </div>
                            <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                                <div className="flex items-center gap-2">
                                    <StarRating rating={data.reviewRating} iconClassName="size-4" />
                                    <p className="text-base font-medium">
                                        {data.reviewCount} ratings
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
                            <div className="flex items-center gap-2">
                                <StarRating rating={data.reviewRating} iconClassName="size-4" />
                                <p className="text-base font-medium">
                                    {data.reviewCount} ratings
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            {data.description ? (
                                <RichText data={data.description} />
                            ) : (
                                <p className="font-medium text-muted-foreground italic">
                                    No description provided
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="border-t lg:border-t-0 lg:border-l h-full">
                            <div className="flex flex-col gap-4 p-6 border-b">
                                <div className="flex flex-row items-center gap-2">
                                    <CartButton productId={productId} tenantSlug={slug} isPurchased={data.isPurchased} id={data.id} />
                                    <Button
                                        variant={"elevated"}
                                        className="size-12"
                                        onClick={() => {
                                            setIsCopied(true);
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success("Copied to clipboard");
                                            setTimeout(() => {
                                                setIsCopied(false);
                                            }, 1000);
                                        }}
                                        disabled={isCopied}
                                    >
                                        {isCopied ? <CheckIcon /> : <LinkIcon />}
                                    </Button>
                                </div>
                                <p className="text-center font-medium">
                                    {data.refundPolicy === "No Refunds" ? "No Refunds" : `${data.refundPolicy} money back guaranteed`}
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-medium">
                                        Ratings
                                    </h3>
                                    <div className="flex items-center gap-x-1 font-medium">
                                        <StarIcon className="size-4 fill-black" />
                                        <p>({data.reviewRating})</p>
                                        <p className="text-base">{data.reviewCount} ratings</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <Fragment key={stars}>
                                            <div className="font-medium">
                                                {stars} {stars === 1 ? "star" : "stars"}
                                            </div>
                                            <Progress value={data.ratingDistribution[stars]} className="h-[1lh]" />
                                            <div className="font-medium">
                                                {data.ratingDistribution[stars]}%
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ProductViewSkeleton = () => {
    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border border-opacity-50 rounded-sm bg-white overflow-hidden">
                <div className="relative aspect-[4.5] border-b border-opacity-50">
                    <Skeleton className="h-full w-full" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="col-span-4">
                        <div className="p-6">
                            <Skeleton className="h-10 w-4/5 mb-2" />
                        </div>

                        <div className="border-y border-opacity-50 flex">
                            <div className="px-6 py-4 flex items-center justify-center border-r border-opacity-50">
                                <Skeleton className="h-8 w-20" />
                            </div>
                            <div className="px-6 py-4 flex items-center justify-center lg:border-r border-opacity-50">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                            </div>
                            <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </div>

                        <div className="block lg:hidden px-6 py-4 items-center justify-center border-b border-opacity-50">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>

                        <div className="p-6">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-4/5 mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="border-t border-opacity-50 lg:border-t-0 lg:border-l border-opacity-50 h-full">
                            <div className="flex flex-col gap-4 p-6 border-b border-opacity-50">
                                <div className="flex flex-row items-center gap-2">
                                    <Skeleton className="h-10 flex-1" />
                                    <Skeleton className="h-10 w-10" />
                                </div>
                                <Skeleton className="h-5 w-3/4 mx-auto" />
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-7 w-24" />
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Fragment key={i}>
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-5 w-full" />
                                            <Skeleton className="h-5 w-12" />
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};