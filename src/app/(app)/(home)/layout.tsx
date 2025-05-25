import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Navbar } from "@/modules/home/ui/components/navbar";
import { Footer } from "@/modules/home/ui/components/footer";
import { SearchFilters, SearchFiltersSkeleton } from "@/modules/home/ui/components/search-filter";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from 'react';

interface Props {
    children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.categories.getMany.queryOptions(),
    );

    const dehydratedState = dehydrate(queryClient);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <HydrationBoundary state={dehydratedState}>
                <Suspense fallback={<SearchFiltersSkeleton />}>
                    <SearchFilters />
                </Suspense>
            </HydrationBoundary>
            <div className="flex-1 bg-[#f4f4f0]">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;