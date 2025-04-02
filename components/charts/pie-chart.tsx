"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
import { date } from "zod"


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


export function PieChartDonut({card, cash, online}: {card: number, cash: number, online: number}) {
  const chartData = React.useMemo(() => {
    return [
      { mode: "Card", transactions: card, fill: "var(--color-card)" },
      { mode: "Cash", transactions: cash, fill: "var(--color-cash)" },
      { mode: "Online", transactions: online, fill: "var(--color-online)" },
    ]
  }
  , [card, cash, online])
  const totalTransactions = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.transactions, 0)
  }, [])

  const percentageIncrease = cash > 0 
  ? ((online - cash) / cash) * 100 
  : online > 0 ? 100 : 0;

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="transactions"
              nameKey="mode"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTransactions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Transactions
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        Online transactions are {percentageIncrease.toFixed(2)}% more than cash transaction <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total transaction for the year {new Date().getFullYear()}
        </div>
      </CardFooter>
    </Card>
  )
}
