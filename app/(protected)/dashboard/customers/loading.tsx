import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function CustomersLoading() {
  return (
    <>
      <DashboardHeader heading="Customers" text="Check and manage customers." />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
