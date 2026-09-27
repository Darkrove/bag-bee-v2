"use client";
import * as React from "react";
import { IndianRupee, PieChart, ChartLine, PercentCircle } from "lucide-react";
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
        <Skeleton className="h-44 w-full rounded-lg" />
      </>
    );
  }

  // Ensure data is available and has totalSales and totalProfit
  const revenue = data?.sales?.totalSales || 0;
  const profit = data?.sales?.totalProfit || 0;
  const totalTransactions = data?.sales?.count || 0;
  const averageTransactionValue = totalTransactions ? parseFloat((revenue / totalTransactions).toFixed(2)) : 0;

  const margin = revenue ? parseFloat(((profit / revenue) * 100).toFixed(2)) : 0;

  return (
    <>
      <InfoCard
        amount={revenue}
        title="Revenue"
        icon={<PieChart className="size-4 text-muted-foreground" />}
        footerTitle="All time revenue"
      />
      <InfoCard
        amount={profit}
        title="Profit"
        icon={<IndianRupee className="size-4 text-muted-foreground" />}
        footerTitle="All time profit"
      />
      <InfoCard
        amount={totalTransactions}
        title="Total Invoiced"
        showCurrencySymbol={false}
        icon={<ChartLine className="size-4 text-muted-foreground" />}
        footerTitle="All invoiced transactions"
      />
      <InfoCard
        amount={averageTransactionValue}
        title="Avg / Customer"
        icon={<IndianRupee className="size-4 text-muted-foreground" />}
        footerTitle="Avg transaction value"
      />
      <InfoCard
        amount={margin}
        showCurrencySymbol={false}
        showPercentage={true}
        title="Margin"
        icon={<PercentCircle className="size-4 text-muted-foreground" />}
        footerTitle="Profit margin percentage"
      />
    </>
  );
}