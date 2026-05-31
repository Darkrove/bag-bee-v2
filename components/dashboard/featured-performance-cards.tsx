"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { currencyFormatter, toCamelCase } from "@/lib/utils";
import { EntityPerformanceWithMonthly } from "@/lib/performance";

interface FeaturedPerformanceCardsProps {
    entityLabel: string;
    rows: EntityPerformanceWithMonthly[];
}

const chartConfig = {
    totalSales: {
        label: "Total Sales",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function FeaturedPerformanceCards({ entityLabel, rows }: FeaturedPerformanceCardsProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => (
                <Card key={row.entity} className="overflow-hidden">
                    <CardHeader className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-base leading-snug">
                                    {row.entity}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {entityLabel}
                                </p>
                            </div>
                            <Badge variant="outline" className="text-xs font-semibold">
                                {row.percentageSales.toFixed(1)}%
                            </Badge>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div className="rounded-lg border border-border bg-muted/50 p-3">
                                <p className="text-xs uppercase text-muted-foreground">Sales</p>
                                <p className="text-base font-semibold">
                                    {currencyFormatter.format(row.totalSales)}
                                </p>
                            </div>
                            <div className="rounded-lg border border-border bg-muted/50 p-3">
                                <p className="text-xs uppercase text-muted-foreground">Profit</p>
                                <p className="text-base font-semibold">
                                    {currencyFormatter.format(row.totalProfit)}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={row.monthly}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line"/>}
                                />
                                <Line
                                    dataKey="totalSales"
                                    type="monotone"
                                    stroke="var(--color-totalSales)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
