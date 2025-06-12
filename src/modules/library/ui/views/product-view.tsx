"use client";

import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ReviewSidebar } from "../components/review-sidebar";
import { RichText } from "@payloadcms/richtext-lexical/react"
import { Suspense } from "react";
import { ReviewFormSkeleton } from "../components/review-form";

interface Props {
    productId: string;
}

export const ProductView = ({ productId }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.library.getOne.queryOptions({ productId }));

    return (
        <div className="min-h-screen bg-white">
            <nav className="p-4 bg-[#F4F4F0] w-full border-b">
                <Link href={"/library"} prefetch className="flex items-center gap-2">
                    <ArrowLeftIcon className="size-4" />
                    <span className="text font-medium">
                        Back to library
                    </span>
                </Link>
            </nav>
            <header className="bg-[#F4F4F0] py-8 border-b">
                <div className="max-w-(--breakpoint-2xl) mx-auto px-4 lg:px-12">
                    <h1 className="text-[40px] font-medium">{data.name}</h1>
                </div>
            </header>
            <section className="max-w-(--breakpoint-2xl) mx-auto px-4 lg:px-12 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                    <div className="lg:col-span-2">
                        <div className="p-4 bg-white rounded-md border gap-4">
                            <Suspense fallback={<ReviewFormSkeleton />}>
                                <ReviewSidebar productId={productId} />
                            </Suspense>
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        {data.content ? (
                            <RichText data={data.content} />
                        ) : (
                            <p className="font-medium italic text-muted-foreground">No special content</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export const ProductViewSkeleton = () => {
    return (
        <div className="min-h-screen bg-white">
            <nav className="p-4 bg-[#F4F4F0] w-full border-b">
                <div className="flex items-center gap-2 opacity-50">
                    <ArrowLeftIcon className="size-4" />
                    <span className="text font-medium">
                        Back to library
                    </span>
                </div>
            </nav>
            <header className="bg-[#F4F4F0] py-8 border-b">
                <div className="max-w-(--breakpoint-2xl) mx-auto px-4 lg:px-12">
                    <div className="h-[40px] bg-gray-200 w-2/3 rounded-md animate-pulse" />
                </div>
            </header>
            <section className="max-w-(--breakpoint-2xl) mx-auto px-4 lg:px-12 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                    <div className="lg:col-span-2">
                        <div className="p-4 bg-white rounded-md border gap-4">
                            <ReviewFormSkeleton />
                        </div>
                    </div>
                    <div className="lg:col-span-5 opacity-50">
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 w-full rounded-md animate-pulse" />
                            <div className="h-6 bg-gray-200 w-5/6 rounded-md animate-pulse" />
                            <div className="h-6 bg-gray-200 w-4/6 rounded-md animate-pulse" />
                            <div className="h-6 bg-gray-200 w-full rounded-md animate-pulse" />
                            <div className="h-6 bg-gray-200 w-3/6 rounded-md animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};