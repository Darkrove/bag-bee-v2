import { endOfYear, format, formatDistance, startOfYear } from "date-fns";

import { fetchInvoices } from "@/actions/fetch-invoices";
import { dateFormat } from "@/constants/date";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { columns } from "@/components/sales/columns"
import { DataTable } from "@/components/sales/data-table"
import { DataTableMobile } from "@/components/sales/data-table-mobile";

export const metadata = constructMetadata({
  title: "Sales Data | Famous Bag",
  description: "Check and manage your latest sales.",
});

export default async function SalesDataPage() {
  // const user = await getCurrentUser();
  // if (!user || user.role !== "ADMIN") redirect("/login");
  const from = format(startOfYear(new Date()), dateFormat);
    const to = format(endOfYear(new Date()), dateFormat);
    const result = await fetchInvoices(from, to);

  return (
    <>
      <DashboardHeader
        heading="Invoices"
        text="Check and manage invoices."
      />
      {(result?.data?.length ?? 0) === 0 && (
        <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="package" />
        <EmptyPlaceholder.Title>No sales data found</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
        There are no sales data available for the selected date range.
        </EmptyPlaceholder.Description>
        <Button>Buy Products</Button>
      </EmptyPlaceholder>
      )}
      <div className="mx-auto w-full">
        <DataTable columns={columns} data={result?.data ?? []} />
        <DataTableMobile data={result?.data ?? []}/>
      </div>
    </>
  );
}
