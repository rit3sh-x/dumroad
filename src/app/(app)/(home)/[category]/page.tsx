import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react'
import type { SearchParams } from 'nuqs/server';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { DEFAULT_TAG_MAX_LIMIT } from '@/constants';

interface Props {
    params: Promise<{
        category: string;
    }>
    searchParams: Promise<SearchParams>
}

const Category = async ({ params, searchParams }: Props) => {
    const { category } = await params;
    const queryClient = getQueryClient();
    const filters = await loadProductFilters(searchParams);

    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        category: category,
        ...filters,
        limit: DEFAULT_TAG_MAX_LIMIT
    }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={category} />
        </HydrationBoundary>
    )
}

export default Category;