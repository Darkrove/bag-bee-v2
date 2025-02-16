import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function SalesDataLoading() {
  return (
    <>
      <DashboardHeader
        heading="Invoices"
        text="Check and manage invoices."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
