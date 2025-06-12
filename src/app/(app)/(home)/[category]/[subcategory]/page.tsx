import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import type { SearchParams } from 'nuqs/server';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react'
import { DEFAULT_TAG_MAX_LIMIT } from '@/constants';

interface Props {
    params: Promise<{
        subcategory: string;
    }>
    searchParams: Promise<SearchParams>
}

const Subcategory = async ({ params, searchParams }: Props) => {
    const { subcategory } = await params;
    const queryClient = getQueryClient();
    const filters = await loadProductFilters(searchParams);

    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        category: subcategory,
        ...filters,
        limit: DEFAULT_TAG_MAX_LIMIT
    }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={subcategory} />
        </HydrationBoundary>
    )
}

export default Subcategory