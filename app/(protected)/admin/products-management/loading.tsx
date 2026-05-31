import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function OrdersLoading() {
    return (
        <>
            <DashboardHeader
                heading="Manage Products"
                text="Add, edit, or delete product categories."
            />
            <Skeleton className="size-full rounded-lg" />
        </>
    );
}   
