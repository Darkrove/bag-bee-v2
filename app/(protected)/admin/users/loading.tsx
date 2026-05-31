import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function CustomersLoading() {
  return (
    <>
      <DashboardHeader heading="Users Management"
        text="Manage all registered users and their roles."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
