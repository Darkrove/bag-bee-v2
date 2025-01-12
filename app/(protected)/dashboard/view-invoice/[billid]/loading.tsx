import { Skeleton } from "@/components/ui/skeleton";

export default function ViewInvoiceLoading() {
  return (
    <div className="mx-auto max-w-[85rem] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col space-y-4 sm:w-11/12 lg:w-3/4">
        <Skeleton className="size-full h-10 rounded-xl" />
        <Skeleton className="size-full rounded-xl border-t-[12px] border-primary" />
      </div>
    </div>
  );
}
