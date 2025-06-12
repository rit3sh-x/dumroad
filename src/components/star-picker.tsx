"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarPickerProps {
    value?: number;
    onChange?: (value: number) => void;
    disabled: boolean;
    className?: string;
}

export const StarPicker = ({ value = 0, onChange, disabled, className }: StarPickerProps) => {
    const [hoverValue, setHoverValue] = useState<number>(0);

    return (
        <div className={cn("flex items-center", className, disabled && "opacity-50 cursor-not-allowed")}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled}
                    className={cn("p-0.5 hover:scale-110 transition", !disabled && "cursor-pointer hover:scale-100")}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => setHoverValue(star)}
                    onMouseLeave={() => setHoverValue(0)}
                >
                    <StarIcon className={cn("size-5", (hoverValue || value) >= star ? "fill-black stroke-black" : "stroke-black")} />
                </button>
            ))}
        </div>
    )
}