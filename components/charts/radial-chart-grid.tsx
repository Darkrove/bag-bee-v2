"use client"

import { TrendingUp } from "lucide-react"
import { PolarGrid, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react"

const chartConfig = {
  transactions: {
    label: "Transactions",
  },
  card: {
    label: "Card",
    color: "hsl(var(--chart-1))",
  },
  cash: {
    label: "Cash",
    color: "hsl(var(--chart-2))",
  },
  online: {
    label: "Online",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function RadialChartGrid({card, cash, online}: {card: number, cash: number, online: number}) {
  const chartData = React.useMemo(() => {
      return [
        { mode: "Card", transactions: card, fill: "var(--color-card)" },
        { mode: "Cash", transactions: cash, fill: "var(--color-cash)" },
        { mode: "Online", transactions: online, fill: "var(--color-online)" },
      ]
    }
    , [card, cash, online])
  return (
    <Card className="flex flex-col">
      {/* <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Grid</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="mode" />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="transactions" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total transaction for the year {new Date().getFullYear()}
        </div>
      </CardFooter>
    </Card>
  )
}
