import Link from "next/link";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavbarItem {
    children: React.ReactNode;
    href: string;
}

interface Props {
    items: NavbarItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: Props) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="p-0 transition-none" aria-describedby={undefined}>
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center">Menu</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {items.map((item) => (
                        <Link onClick={() => onOpenChange(false)} key={item.href} href={item.href} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                            {item.children}
                        </Link>
                    ))}
                    <div className="border-t ">
                        <Link onClick={() => onOpenChange(false)} href="/sign-in" className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                            Login
                        </Link>
                        <Link onClick={() => onOpenChange(false)} href="/sign-up" className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                            Start Selling
                        </Link>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}