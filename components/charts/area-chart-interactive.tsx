"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverview } from "@/components/context/overview-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AreaChartInteractive() {
  const { data, loading } = useOverview();
  const filteredData: { date: string; sales: number; profit: number }[] = [];

  data?.daily?.forEach(
    (row: { date: string; sales: number; profit: number }) => {
      // row.date is already in "YYYY-MM-DD", so no need for conversion
      const formattedDate = row.date;

      const sales = row.sales || 0;
      const profit = row.profit || 0;

      // Check if this date already exists
      const existingEntryIndex = filteredData.findIndex(
        (entry) => entry.date === formattedDate,
      );

      if (existingEntryIndex !== -1) {
        // Update if already exists
        filteredData[existingEntryIndex].sales += sales;
        filteredData[existingEntryIndex].profit += profit;
      } else {
        // Insert new record
        filteredData.push({
          date: formattedDate,
          sales,
          profit,
        });
      }
    },
  );
  // Sort data by date (useful for charts)
  filteredData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const parseDate = (value: string) => {
    // Ensure YYYY-MM-DD is parsed as local date
    const [year, month, day] = value.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 justify-items-center gap-1 text-center sm:justify-items-start sm:text-left">
            <Skeleton className="h-6 w-32 text-center" /> {/* title */}
            <Skeleton className="h-4 w-52 text-center" /> {/* description */}
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full rounded-xl" />{" "}
          {/* chart skeleton */}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Sales VS Profit</CardTitle>
          <CardDescription>
            Showing data for the last {filteredData.length} days
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = parseDate(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
