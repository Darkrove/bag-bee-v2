import { constructMetadata } from "@/lib/utils";
import { AreaChartStacked } from "@/components/charts/area-chart-stacked";
import { BarChartMixed } from "@/components/charts/bar-chart-mixed";
import { InteractiveBarChart } from "@/components/charts/interactive-bar-chart";
import { LineChartMultiple } from "@/components/charts/line-chart-multiple";
import { RadarChartSimple } from "@/components/charts/radar-chart-simple";
import { RadialChartGrid } from "@/components/charts/radial-chart-grid";
import { RadialShapeChart } from "@/components/charts/radial-shape-chart";
import { RadialStackedChart } from "@/components/charts/radial-stacked-chart";
import { RadialTextChart } from "@/components/charts/radial-text-chart";
import { DashboardHeader } from "@/components/dashboard/header";
import { PieChartDonut } from "@/components/charts/pie-chart";
import { fetchInvoices } from "@/actions/fetch-invoices";
import { dateFormat } from "@/constants/date";
import { DateFilter } from "@/components/charts/date-filter"

import { endOfDay, format, startOfDay, startOfYear } from "date-fns";

export const metadata = constructMetadata({
  title: "Charts | Famous Bag",
  description: "Charts for analytics and data visualization.",
});

export default async function ChartsPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string }
}) {
  // Get date range from search params or use defaults
  const from = searchParams.from || format(startOfYear(new Date()), dateFormat)
  const to = searchParams.to || format(endOfDay(new Date()), dateFormat)

  // Fetch data based on date range
  const result = await fetchInvoices(from, to)
  // Function to count transactions per mode
const countTransactionsByMode = (data, mode) =>
  data?.filter((item) => item.paymentMode === mode).length || 0;

// Function to sum total transaction amount per mode
const sumTransactionAmountByMode = (data, mode) =>
  data
    ?.filter((item) => item.paymentMode === mode)
    .reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0) || 0;

// Get transaction stats (count & total amount)
const getTransactionStats = (data) => ({
  cash: {
    count: countTransactionsByMode(data, "cash"),
    totalAmount: sumTransactionAmountByMode(data, "cash"),
  },
  online: {
    count: countTransactionsByMode(data, "online"),
    totalAmount: sumTransactionAmountByMode(data, "online"),
  },
  card: {
    count: countTransactionsByMode(data, "card"),
    totalAmount: sumTransactionAmountByMode(data, "card"),
  },
});

const { cash, online, card } = getTransactionStats(result?.data || []);

  return (
    <>
     <DashboardHeader heading="Charts" text="Charts for analytics."/>
     <DateFilter />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <PieChartDonut
            card={card.count}
            cash={cash.count}
            online={online.count}
          />
          <RadialChartGrid
          card={card.totalAmount}
          cash={cash.totalAmount}
          online={online.totalAmount}
          />
          <BarChartMixed />
          <RadarChartSimple />
        </div>

        <InteractiveBarChart />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <AreaChartStacked />
          <RadialShapeChart />
          <LineChartMultiple />
          <RadialStackedChart />
        </div>
      </div>
    </>
  );
}
