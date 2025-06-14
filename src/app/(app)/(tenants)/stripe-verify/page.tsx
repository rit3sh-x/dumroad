"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";

const Page = () => {
    const trpc = useTRPC();
    const { mutate: verify } = useMutation(trpc.checkout.verify.mutationOptions({
        onSuccess: (data) => {
            console.log(data);
            window.location.href = data.url;
        },
        onError: (error) => {
            console.log(error)
            window.location.href = "/";
        },
    }));

    useEffect(() => {
        verify();
    }, [verify])

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center space-y-6 border border-border">
                <h1 className="text-2xl font-bold text-foreground">Verifying Your Account</h1>
                
                <div className="flex justify-center py-4">
                    <LoaderIcon className="h-12 w-12 animate-spin text-primary" />
                </div>
                
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        We&#39;re connecting to Stripe to verify your account details.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        You&#39;ll be redirected automatically. Please don&#39;t close this window.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;