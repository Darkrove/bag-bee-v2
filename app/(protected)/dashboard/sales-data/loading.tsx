import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function SalesDataLoading() {
  return (
    <>
      <DashboardHeader
        heading="Sales Data"
        text="Check and manage your latest sales."
      />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
