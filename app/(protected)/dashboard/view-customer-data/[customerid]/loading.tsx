import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ViewCustomerDataLoading() {
  return (
    <>
      <DashboardHeader heading="Customer" text="Customer Data" />
      <Skeleton className="size-full rounded-lg mt-6" />
    </>
  );
}
