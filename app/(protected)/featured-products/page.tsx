import { endOfYear, format } from "date-fns";

import { dateFormat } from "@/constants/date";
import { fetchInvoices } from "@/actions/fetch-invoices";
import { calculateSalesData, getEntitiesWithPercentage } from "@/lib/performance";
import LayoutHeader from "@/components/dashboard/header";
import { FeaturedPerformanceTable } from "@/components/dashboard/featured-performance-table";

export default async function FeaturedProductsPage() {
  const from = format(new Date("2023-01-01"), dateFormat);
  const to = format(endOfYear(new Date()), dateFormat);

  const result = await fetchInvoices(from, to);
  const categorySalesData = calculateSalesData(result, "productCategory");
  const performanceRows = getEntitiesWithPercentage(categorySalesData);

  return (
    <>
      <LayoutHeader
        heading="Featured Products"
        text="View performance metrics for all product categories."
      />
      <FeaturedPerformanceTable
        heading="All Product Categories"
        description="Sales performance for every product category in the current reporting period."
        entityLabel="Product Category"
        rows={performanceRows}
      />
    </>
  );
}
