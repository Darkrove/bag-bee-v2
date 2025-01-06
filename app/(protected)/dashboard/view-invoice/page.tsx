'use client'

import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export default function SearchInvoicePage() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const billId = inputRef.current?.value;
        if (billId) {
            router.push(`/dashboard/view-invoice/${billId}`);
        }
    };

    return (
        <>
            <DashboardHeader heading="Search Invoice" text="Enter the Bill ID to view the invoice" />
            <EmptyPlaceholder>
            <EmptyPlaceholder.Icon  name="search" />
            <form onSubmit={handleSearch} className="flex w-full flex-col items-center space-y-4 rounded-lg p-6 shadow-md">
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Enter Bill ID"
                        className="w-full rounded-md border p-3 focus:outline-none"
                    />
                    <Button type="submit" className="w-full rounded-md p-3 text-white focus:outline-none">
                        Search
                    </Button>
                </form>
            </EmptyPlaceholder>
        </>
    );
}