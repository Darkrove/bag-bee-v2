import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ViewCustomerDataLoading() {
  return (
    <>
      <DashboardHeader heading="Customer" text="Customer Data" />
      <Skeleton className="mt-6 size-full rounded-lg" />
    </>
  );
}
