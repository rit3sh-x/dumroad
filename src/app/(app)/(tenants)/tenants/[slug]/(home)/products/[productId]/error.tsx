"use client";
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ProductNotFound() {
    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="bg-white p-8 border-4 border-black text-center">
                <AlertTriangle className="mx-auto mb-4" size={48} strokeWidth={2} color="black" />
                <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                <p className="text-lg mb-6">
                    We couldn’t find the product you’re looking for.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors"
                >
                    Go back Home
                </Link>
            </div>
        </div>
    );
}