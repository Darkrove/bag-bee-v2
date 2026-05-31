import { endOfYear, format, startOfYear } from "date-fns";

import { dateFormat } from "@/constants/date";
import { fetchInvoices } from "@/actions/fetch-invoices";
import { getEntityMonthlyPerformance } from "@/lib/performance";
import LayoutHeader from "@/components/dashboard/header";
import { FeaturedPerformanceCards } from "@/components/dashboard/featured-performance-cards";

export default async function FeaturedDealersAdminPage() {
  const from = format(startOfYear(new Date()), dateFormat);
  const to = format(endOfYear(new Date()), dateFormat);

  const result = await fetchInvoices(from, to);
  const rows = getEntityMonthlyPerformance(result, "dealerCode");

  return (
    <>
      <LayoutHeader
        heading="Featured Dealers"
        text="View month-by-month performance for all dealers."
      />
      <FeaturedPerformanceCards entityLabel="Dealer Code" rows={rows} />
    </>
  );
}
