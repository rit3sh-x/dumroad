"use client";

import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    minPrice?: string | null;
    maxPrice?: string | null;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
}

export const formatAsCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    const formattedVlaue = parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");

    if (!formattedVlaue) return "";

    const parsedValue = parseFloat(formattedVlaue);
    if (isNaN(parsedValue)) return "";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    }).format(parsedValue);
}

export const PriceFilter = ({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: Props) => {
    const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9.]/g, "");
        onMinPriceChange(numericValue);
    }

    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9.]/g, "");
        onMaxPriceChange(numericValue);
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <Label className="font-medium text-base">
                    Minimum price
                </Label>
                <Input type="text" placeholder="₹0" value={minPrice ? formatAsCurrency(minPrice) : ""} onChange={handleMinPriceChange} className="" />
            </div>
            <div className="flex flex-col gap-2">
                <Label className="font-medium text-base">
                    Maximum price
                </Label>
                <Input type="text" placeholder="₹10000" value={maxPrice ? formatAsCurrency(maxPrice) : ""} onChange={handleMaxPriceChange} className="" />
            </div>
        </div>
    )
}