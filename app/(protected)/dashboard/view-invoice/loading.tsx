import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

const SearchInvoiceSkeleton = () => {
    return (
        <>
            <DashboardHeader heading="Search Invoice" text="Enter the Bill ID to view the invoice" />
            <div className="flex h-full flex-col items-center justify-center p-4">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
            </div>
        </>
    );
};

export default SearchInvoiceSkeleton;