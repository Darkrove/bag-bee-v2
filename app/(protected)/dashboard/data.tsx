//show info card by fetchin todays data from fetch invoice action
import * as React from "react";
import { IndianRupee, PieChart, ChartLine } from "lucide-react";
import { endOfDay, format, startOfDay, subDays } from "date-fns";

import { dateFormat } from "@/constants/date";
import InfoCard from "@/components/dashboard/info-card";
import { fetchInvoices } from "@/actions/fetch-invoices";

export default async function Data() {
  // Today
  const todayFrom = format(startOfDay(new Date()), dateFormat);
  const todayTo = format(endOfDay(new Date()), dateFormat);
  const todayResult = await fetchInvoices(todayFrom, todayTo);
  const todaySales = todayResult.totalSales || 0;
  const todayProfit = todayResult.totalProfit || 0;
  const todayTransactions = todayResult.data?.length || 0;
  const todayAvg =
    todayTransactions > 0
      ? parseFloat((todaySales / todayTransactions).toFixed(2))
      : 0;

  // Yesterday
  const yesterday = subDays(new Date(), 1);
  const yesterdayFrom = format(startOfDay(yesterday), dateFormat);
  const yesterdayTo = format(endOfDay(yesterday), dateFormat);
  const yesterdayResult = await fetchInvoices(yesterdayFrom, yesterdayTo);
  const yesterdaySales = yesterdayResult.totalSales || 0;
  const yesterdayProfit = yesterdayResult.totalProfit || 0;
  const yesterdayTransactions = yesterdayResult.data?.length || 0;
  const yesterdayAvg =
    yesterdayTransactions > 0
      ? parseFloat((yesterdaySales / yesterdayTransactions).toFixed(2))
      : 0;

  // Percentage changes
  const salesChange =
    yesterdaySales === 0
      ? 100
      : ((todaySales - yesterdaySales) / yesterdaySales) * 100;

  const profitChange =
    yesterdayProfit === 0
      ? 100
      : ((todayProfit - yesterdayProfit) / yesterdayProfit) * 100;

  const transactionsChange =
    yesterdayTransactions === 0
      ? 100
      : ((todayTransactions - yesterdayTransactions) / yesterdayTransactions) *
        100;

  const avgChange =
    yesterdayAvg === 0 ? 100 : ((todayAvg - yesterdayAvg) / yesterdayAvg) * 100;

  return (
    <>
      <InfoCard
        amount={todaySales}
        title="Total Sales"
        trend={salesChange}
        icon={<PieChart className="size-4 text-muted-foreground" />}
        footerTitle={`${salesChange >= 0 ? "Up" : "Down"} ${Math.abs(
          salesChange,
        ).toFixed(1)}% today`}
        footerSubtitle={salesChange >= 0 ? "Sales growing" : "Sales declined"}
      />

      <InfoCard
        amount={todayProfit}
        title="Total Profit"
        trend={profitChange}
        icon={<IndianRupee className="size-4 text-muted-foreground" />}
        footerTitle={`Profit ${profitChange >= 0 ? "up" : "down"} ${Math.abs(
          profitChange,
        ).toFixed(1)}% today`}
        footerSubtitle={
          profitChange >= 0 ? "Margins improving" : "Margins shrinking"
        }
      />

      <InfoCard
        amount={todayTransactions}
        title="Total Transactions"
        trend={transactionsChange}
        showCurrencySymbol={false}
        icon={<ChartLine className="size-4 text-muted-foreground" />}
        footerTitle={
          transactionsChange >= 0
            ? `More customers today`
            : `Fewer customers today`
        }
        footerSubtitle={
          transactionsChange >= 0
            ? "Customer activity rising"
            : "Customer activity dropped"
        }
      />

      <InfoCard
        amount={todayAvg}
        title="Average Sales Value"
        trend={avgChange}
        icon={<IndianRupee className="size-4 text-muted-foreground" />}
        footerTitle={
          avgChange >= 0 ? `Higher spend today` : `Lower spend today`
        }
        footerSubtitle={
          avgChange >= 0
            ? "Avg. purchase value rising"
            : "Avg. purchase value dropped"
        }
      />
    </>
  );
}
