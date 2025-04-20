import React from "react";
import { endOfYear, format, formatDistance, startOfYear } from "date-fns";

import { fetchCustomers } from "@/actions/fetch-customers";
import { dateFormat } from "@/constants/date";
import { DashboardHeader } from "@/components/dashboard/header";
import { DataTable } from "@/components/customers/data-table";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { columns } from "@/components/customers/columns";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTableMobile } from "@/components/customers/data-table-mobile";

export const metadata = constructMetadata({
  title: "Customer Data | Famous Bag",
  description: "Check and manage customers.",
});

export default async function CustomersDataPage() {
  const from = format(startOfYear(new Date()), dateFormat);
  const to = format(endOfYear(new Date()), dateFormat);
  const result = await fetchCustomers(from, to);

  result.data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  
  return (
    <>
      <DashboardHeader heading="Customers" text="Check and manage customers." />
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
        <DataTableMobile data={result?.data ?? []} />
      </div>
    </>
  );
}
