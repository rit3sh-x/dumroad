import { ProductView } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
    params: Promise<{ productId: string, slug: string }>
}

const Page = async ({ params }: Props) => {
    const { productId, slug } = await params;
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug: slug }))
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductView productId={productId} slug={slug}/>
        </HydrationBoundary>
    )
}

export default Page;