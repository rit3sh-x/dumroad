"use client";

import { CategoryDropdown } from "./category-dropdown"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useParams } from "next/navigation";

interface Props {
    data: CategoriesGetManyOutput
}

export const Categories = ({ data }: Props) => {
    const params = useParams();
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLDivElement>(null);

    const [visibleCount, setVisibleCount] = useState<number>(0);
    const [isAnyHovered, setIsAnyHovered] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const category = params.category as string | undefined;
    const activeCategory = category || "all";
    const activeCategoryIndex = data.findIndex((cat: CategoriesGetManyOutput[1]) => cat.slug === activeCategory);
    const isActiveCategoryHidden = (activeCategoryIndex >= visibleCount) && activeCategoryIndex != -1;

    useEffect(() => {
        const calculateVisible = () => {
            if (!containerRef.current || !measureRef.current || !viewAllRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const viewAllWidth = viewAllRef.current.offsetWidth;
            const availableWidth = containerWidth - viewAllWidth;

            const items = Array.from(measureRef.current.children);
            let totalWidth = 0;
            let visible = 0;

            for (const item of items) {
                const width = item.getBoundingClientRect().width;

                if (totalWidth + width > availableWidth) break;
                totalWidth += width
                visible++;
            }
            setVisibleCount(visible);
        }

        const resizeObserver = new ResizeObserver(calculateVisible);
        resizeObserver.observe(containerRef.current!)

        return () => resizeObserver.disconnect();
    }, [data.length]);

    return (
        <div className="relative w-full">
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
            {/* invisible items for clac*/}
            <div ref={measureRef} className="absolute opacity-0 pointer-events-none flex" style={{ position: "fixed", top: -9999, left: -9999 }}>
                {data.map((category: CategoriesGetManyOutput[1]) => (
                    <div key={category.id}>
                        <CategoryDropdown category={category} isActive={activeCategory === category.slug} isNavigationHovered={false} />
                    </div>
                ))}
            </div>
            {/* visible items for show*/}
            <div ref={containerRef} className="flex flex-nowrap items-center" onMouseEnter={() => setIsAnyHovered(true)} onMouseLeave={() => setIsAnyHovered(false)}>
                {data.slice(0, visibleCount).map((category: CategoriesGetManyOutput[1]) => (
                    <div key={category.id}>
                        <CategoryDropdown category={category} isActive={activeCategory === category.slug} isNavigationHovered={isAnyHovered} />
                    </div>
                ))}
                <div ref={viewAllRef} className={cn(
                    "shrink-0",
                    visibleCount >= data.length ? "opacity-0 pointer-events-none" : "opacity-100"
                )}>
                    <Button variant={"elevated"} onClick={() => setIsSidebarOpen(true)} className={cn(
                        "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
                        (isActiveCategoryHidden) && !isAnyHovered && "bg-white border-primary"
                    )}>
                        View All
                        <ListFilterIcon className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}