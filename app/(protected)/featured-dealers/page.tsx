import { endOfYear, format, startOfYear } from "date-fns";

import { dateFormat } from "@/constants/date";
import { fetchInvoices } from "@/actions/fetch-invoices";
import { calculateSalesData, getEntitiesWithPercentage } from "@/lib/performance";
import LayoutHeader from "@/components/dashboard/header";
import { FeaturedPerformanceTable } from "@/components/dashboard/featured-performance-table";

export default async function FeaturedDealersPage() {
  const from = format(startOfYear(new Date()), dateFormat);
  const to = format(endOfYear(new Date()), dateFormat);

  const result = await fetchInvoices(from, to);
  const dealerSalesData = calculateSalesData(result, "dealerCode");
  const performanceRows = getEntitiesWithPercentage(dealerSalesData);

  return (
    <>
      <LayoutHeader
        heading="Featured Dealers"
        text="View sales performance for every dealer in the current reporting period."
      />
      <FeaturedPerformanceTable
        heading="All Dealers"
        description="Dealer performance sorted by total sales."
        entityLabel="Dealer Code"
        rows={performanceRows}
      />
    </>
  );
}
