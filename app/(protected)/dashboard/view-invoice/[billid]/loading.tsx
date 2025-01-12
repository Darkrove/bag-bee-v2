import { Skeleton } from "@/components/ui/skeleton";

export default function ViewInvoiceLoading() {
  return (
    <section className="grid items-center gap-6">
      <div className="mx-auto w-full max-w-[85rem] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex flex-col space-y-4 sm:w-11/12 lg:w-3/4">
          <Skeleton className="size-full h-28 rounded-xl" />
          <Skeleton className="size-full h-[600px] rounded-xl border-t-[12px] border-primary" />
          <Skeleton className="size-full h-28 rounded-xl" />
        </div>
      </div>
    </section>
  );
}
