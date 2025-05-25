"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.auth.session.queryOptions())
    return (
        <div className="w-full">
            {JSON.stringify(data?.user, null , 2)}
        </div>
    );
}