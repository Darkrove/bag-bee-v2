"use client";
import * as React from "react";
import { IndianRupee, PieChart, ChartLine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverview } from "@/components/context/overview-provider";
import InfoCard from "@/components/dashboard/info-card";

export function Data() {
  const { data, loading } = useOverview();

  // Loading state with Skeleton
  if (loading) {
    return (
      <>
        <Skeleton className="h-44 w-full rounded-lg" />
        <Skeleton className="h-44 w-full rounded-lg" />
        <Skeleton className="h-44 w-full rounded-lg" />
        <Skeleton className="h-44 w-full rounded-lg" />
      </>
    );
  }

  // Ensure data is available and has totalSales and totalProfit
  const totalSales = data?.sales?.totalSales || 0;
  const totalProfit = data?.sales?.totalProfit || 0;
  const totalTransactions = data?.sales?.count || 0;
  const averageTransactionValue = totalTransactions ? parseFloat((totalSales / totalTransactions).toFixed(2)) : 0;

  return (
    <>
      <InfoCard
        amount={totalSales}
        title="Total Sales"
        icon={<PieChart className="size-4 text-muted-foreground" />}
        footerTitle="All sales record"
      />
      <InfoCard
        amount={totalProfit}
        title="Total Profit"
        icon={<IndianRupee className="size-4 text-muted-foreground" />}
        footerTitle="All profit record"
      />
      <InfoCard
        amount={totalTransactions}
        title="Total Transactions"
        showCurrencySymbol={false}
        icon={<ChartLine className="size-4 text-muted-foreground" />}
        footerTitle="All transactions record"
      />
      <InfoCard
        amount={averageTransactionValue}
        title="Average Sales Value"
        icon={<IndianRupee className="size-4 text-muted-foreground" />}
        footerTitle="Average transaction value"
      />
    </>
  );
}