//show info card by fetchin todays data from fetch invoice action
import * as React from "react";
import { IndianRupee, PieChart, ChartLine } from "lucide-react";
import { endOfDay, format, startOfDay } from "date-fns";

import { dateFormat } from "@/constants/date";
import InfoCard from "@/components/dashboard/info-card";
import { fetchInvoices } from "@/actions/fetch-invoices";

export default async function Data() {
  const from = format(startOfDay(new Date()), dateFormat);
  const to = format(endOfDay(new Date()), dateFormat);
  const result = await fetchInvoices(from, to);

  const totalSales = result.totalSales || 0;
  const totalProfit = result.totalProfit || 0;
  const totalTransactions = result.data?.length || 0;
  const averageTransactionValue = totalTransactions
    ? parseFloat((totalSales / totalTransactions).toFixed(2))
    : 0;
  return (
    <>
      <InfoCard
        amount={totalSales}
        title="Total Sales"
        icon={<PieChart className="size-4 text-muted-foreground" />}
      />
      <InfoCard
        amount={totalProfit}
        title="Total Profit"
        icon={<IndianRupee className="size-4 text-muted-foreground" />}
      />
      <InfoCard
        amount={totalTransactions}
        title="Total Transactions"
        showCurrencySymbol={false}
        icon={<ChartLine className="size-4 text-muted-foreground" />}
      />
      <InfoCard
        amount={averageTransactionValue}
        title="Average Sales Value"
        icon={<IndianRupee className="size-4 text-muted-foreground" />}
      />
    </>
  );
}
