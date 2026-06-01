import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function OrdersLoading() {
    return (
        <>
            <DashboardHeader
                heading="Manage Dealers"
                text="Add, edit, or delete dealer information."
            />
            <Skeleton className="size-full rounded-lg" />
        </>
    );
}
