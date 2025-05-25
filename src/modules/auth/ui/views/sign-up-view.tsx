"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import z from "zod";
import { Poppins } from "next/font/google";
import { registerSchema } from "../../schemas";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const poppins = Poppins({ subsets: ['latin'], weight: ['700'] });

export const SignUpView = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const register = useMutation(trpc.auth.register.mutationOptions({
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
            router.push("/");
        }
    }));

    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: ""
        }
    });

    const username = form.watch("username");
    const usernameError = form.formState.errors.username;

    const showPreview = username && !usernameError;

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        register.mutate(values);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 lg:p-16">
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/">
                                <span className={cn("text-3xl font-semibold", poppins.className)}>
                                    dumroad
                                </span>
                            </Link>
                            <Button asChild variant={"ghost"} size={"sm"} className="text-base border-none underline">
                                <Link prefetch href="/sign-in">
                                    Sign in
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-4xl font-medium">
                            Join thousands of creators making revenue on Dumroad.
                        </h1>
                        <FormField name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription className={cn("hidden", showPreview && "block")}>
                                    Your store will be available at&nbsp;
                                    <strong>
                                        {username}
                                    </strong>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button disabled={register.isPending} size={"lg"} type="submit" variant={"elevated"} className="bg-black text-white hover:bg-pink-500 hover:text-primary">
                            Create Account
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="h-screen w-full lg:col-span-2 hidden lg:block"
                style={{
                    backgroundImage: "url('/auth-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />
        </div>
    )
}