import { ReviewsGetOneOutput } from "@/modules/reviews/types";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormMessage, FormItem } from "@/components/ui/form";
import { StarPicker } from "@/components/star-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
    productId: string;
    initialData?: ReviewsGetOneOutput
}

const formSchema = z.object({
    rating: z.number().min(1, { message: "Rating is required." }).max(5),
    description: z.string().min(3, { message: "A description is needed." }),
})


export const ReviewForm = ({ productId, initialData }: Props) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const createReview = useMutation(trpc.reviews.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId
            }));
            setIsPreview(true);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    }));
    const updateReview = useMutation(trpc.reviews.update.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId
            }));
            setIsPreview(true);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    }));

    const [isPreview, setIsPreview] = useState<boolean>(!!initialData);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: initialData?.rating ?? 0,
            description: initialData?.description ?? "",
        }
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (initialData) {
            updateReview.mutate({
                reviewId: initialData.id,
                rating: values.rating,
                description: values.description
            })
        }
        else {
            createReview.mutate({
                productId,
                rating: values.rating,
                description: values.description
            })
        }
    }

    return (
        <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <p className="font-medium">{isPreview ? "Your rating" : "Liked it? Give a review"}</p>
                <FormField control={form.control} name="rating" render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <StarPicker value={field.value} onChange={field.onChange} disabled={isPreview} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Textarea placeholder="Want to leave a review?" disabled={isPreview} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                {!isPreview && (
                    <Button variant={"elevated"} disabled={false} type={"submit"} size={"lg"} className="bg-black text-white hover:bg-pink-500 hover:text-primary w-fit">
                        {initialData ? "Update review" : "Post review"}
                    </Button>
                )}
            </form>
            {isPreview && (
                <Button
                    onClick={() => setIsPreview(false)}
                    variant={"elevated"}
                    disabled={createReview.isPending || updateReview.isPending}
                    type={"button"}
                    size={"lg"}
                    className="w-fit mt-4"
                >
                    Edit
                </Button>
            )}
        </Form>
    )
}

export const ReviewFormSkeleton = () => {
    return (
        <div className="opacity-50">
            <div className="flex flex-col gap-y-4">
                <p className="font-medium">Liked it? Give a review</p>
                <div>
                    <StarPicker value={0} onChange={() => { }} disabled={true} />
                </div>
                <Textarea
                    placeholder="Want to leave a review?"
                    disabled={true}
                    value=""
                    className="bg-gray-50"
                />
                <Button
                    variant={"elevated"}
                    disabled={true}
                    type={"button"}
                    size={"lg"}
                    className="bg-black text-white w-fit"
                >
                    Post review
                </Button>
            </div>
        </div>
    );
};