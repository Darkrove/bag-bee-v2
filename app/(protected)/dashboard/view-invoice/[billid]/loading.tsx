import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ViewInvoiceLoading() {
  return (
    <>
    <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
    <Skeleton className="invoice min-h-full w-full flex-col justify-between rounded-none border-t-[12px] border-primary bg-white p-4 dark:bg-secondary sm:p-10" />
    </div>  
    </>
  );
}
