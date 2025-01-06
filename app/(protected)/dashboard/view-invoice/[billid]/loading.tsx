import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ViewInvoiceLoading() {
  return (
    <div>
      <div className="flex-col space-y-5">
        <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex flex-col space-y-4 sm:w-11/12 lg:w-3/4">
            <div className="w-full rounded-lg bg-white p-10 shadow-md dark:bg-secondary">
              <div className="flex items-center justify-between">
                <div className="flex w-full items-center justify-between space-x-2 md:w-auto md:justify-start">
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="hidden space-x-2 md:block">
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            <div className="invoice flex min-h-full w-full flex-col justify-between rounded-none border-t-[12px] border-primary bg-white p-4 dark:bg-secondary sm:p-10">
              <div>
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="mb-2 h-10 w-24" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="mt-2 h-4 w-36" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="mt-1 h-6 w-24" />
                    <Skeleton className="mt-4 h-4 w-48" />
                  </div>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="mt-2 h-6 w-48" />
                    <Skeleton className="mt-1 h-4 w-36" />
                  </div>
                  <div className="space-y-2 sm:text-right">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="mt-1 h-6 w-48" />
                    <Skeleton className="mt-1 h-4 w-36" />
                  </div>
                </div>
                <div className="mt-8 flex sm:justify-end">
                  <div className="w-full max-w-2xl space-y-2 sm:text-right">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="mt-1 h-6 w-24" />
                    <Skeleton className="mt-1 h-6 w-24" />
                    <Skeleton className="mt-1 h-6 w-24" />
                  </div>
                </div>
                <div className="mt-8 justify-end sm:mt-12">
                  <div className="mt-8 flex w-full flex-col items-center justify-between sm:flex-row">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="mt-1 h-6 w-24" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full rounded-lg bg-white p-6 shadow-md dark:bg-secondary">
              <div className="flex w-full flex-col items-center justify-center text-center">
                <Skeleton className="mb-2 h-4 w-48" />
                <Skeleton className="mb-2 h-4 w-48" />
                <Skeleton className="mb-2 h-4 w-48" />
                <Skeleton className="mb-2 h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};