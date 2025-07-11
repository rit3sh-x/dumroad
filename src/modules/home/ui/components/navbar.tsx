"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { NavbarSidebar } from "./navbar-sidebar";
import { MenuIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const poppins = Poppins({ subsets: ['latin'], weight: ['700'] });

const NavbarItem = ({ children, href, isActive }: { children: React.ReactNode; href: string; isActive: boolean }) => {
    return (
        <Button
            asChild
            variant="outline"
            className={cn(
                "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
                isActive && "bg-black text-white hover:bg-black hover:text-white",
            )}
        >
            <Link href={href}>
                {children}
            </Link>
        </Button>
    );
}

const navbarItems = [
    { children: "Home", href: "/" },
    { children: "About", href: "/about" },
    { children: "Features", href: "/features" },
    { children: "Pricing", href: "/pricing" },
    { children: "Contact", href: "/contact" },
]

export const Navbar = () => {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const trpc = useTRPC();
    const session = useQuery(trpc.auth.session.queryOptions());

    return (
        <nav className="h-20 flex border-b justify-between font-medium bg-white">
            <Link href="/" className="pl-6 flex items-center">
                <span>
                    <h1 className={cn("text-5xl font-semibold", poppins.className)}>dumroad</h1>
                </span>
            </Link>

            <NavbarSidebar items={navbarItems} open={sidebarOpen} onOpenChange={setSidebarOpen} />

            <div className="items-center gap-4 hidden lg:flex">
                {navbarItems.map((item) => (
                    <NavbarItem key={item.children} href={item.href} isActive={pathname === item.href}>
                        {item.children}
                    </NavbarItem>
                ))}
            </div>

            {session.data?.user ? (
                <div className="hidden lg:flex">
                    <Button
                        asChild
                        variant="secondary"
                        className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg">
                        <Link href="/admin" className="text-lg font-semibold">Dashboard</Link>
                    </Button>
                </div>
            ) : (
                <div className="hidden lg:flex">
                    <Button
                        asChild
                        variant="secondary"
                        className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg">
                        <Link prefetch href="/sign-in" className="text-lg font-semibold">Login</Link>
                    </Button>
                    <Button
                        asChild
                        variant="secondary"
                        className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg">
                        <Link prefetch href="/sign-up" className="text-lg font-semibold">Start Selling</Link>
                    </Button>
                </div>
            )}


            <div className="flex lg:hidden items-center justify-center">
                <Button variant="ghost" className="size-12 border-transparent bg-white hover:bg-white" onClick={() => setSidebarOpen(true)}>
                    <MenuIcon className="size-6" />
                </Button>
            </div>
        </nav>
    )
}