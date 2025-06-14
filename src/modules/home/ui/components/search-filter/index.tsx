"use client";

import React from 'react'
import { SearchInput, SearchInputSkeleton } from './search-input'
import { Categories } from './categories'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation';
import { FALLBACK_COLOR } from '@/modules/home/constants';
import { BreadcrumbNavigation } from './breadcrumb-navigation';

export const SearchFilters = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
    const params = useParams();

    const category = params.category as string | undefined;
    const activeCategory = category || "all";
    const activeCategoryData = data.find((cat) => cat.slug === activeCategory);

    const activeColor = activeCategoryData?.color || FALLBACK_COLOR;
    const activeCategoryName = activeCategoryData?.name || null;

    const subcategory = params.subcategory as string | undefined;
    const activeSubcatgeoryName = activeCategoryData?.subcategories.find((sub) => sub.slug === subcategory)?.name || null;

    return (
        <div className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full' style={{ backgroundColor: activeColor }}>
            <SearchInput />
            <div className='hidden lg:block'>
                <Categories data={data} />
            </div>
            <BreadcrumbNavigation activeCategory={activeCategory} activeCategoryName={activeCategoryName} activeSubcategoryName={activeSubcatgeoryName} />
        </div>
    )
}

export const SearchFiltersSkeleton = () => {
    return (
        <div className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full' style={{ backgroundColor: "#F5F5F5" }}>
            <SearchInputSkeleton />
            <div className='hidden lg:block'>
                <div className='h-11' />
            </div>
        </div>
    )
}