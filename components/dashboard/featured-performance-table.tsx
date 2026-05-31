import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencyFormatter } from "@/lib/utils";
import { EntityPerformance } from "@/lib/performance";

interface FeaturedPerformanceTableProps {
    heading: string;
    description: string;
    entityLabel: string;
    rows: EntityPerformance[];
}

export function FeaturedPerformanceTable({
    heading,
    description,
    entityLabel,
    rows,
}: FeaturedPerformanceTableProps) {
    return (
        <Card className="w-full overflow-hidden">
            <CardHeader>
                <div className="flex flex-col gap-1">
                    <CardTitle>{heading}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{entityLabel}</TableHead>
                            <TableHead className="text-right">Total Sales</TableHead>
                            <TableHead className="text-right">Total Profit</TableHead>
                            <TableHead className="text-right">Sales %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-sm text-muted-foreground">
                                    No performance data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.entity}>
                                    <TableCell className="font-medium capitalize">{row.entity}</TableCell>
                                    <TableCell className="text-right">{currencyFormatter.format(row.totalSales)}</TableCell>
                                    <TableCell className="text-right">{currencyFormatter.format(row.totalProfit)}</TableCell>
                                    <TableCell className="text-right">{row.percentageSales.toFixed(2)}%</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                Showing performance for all {entityLabel.toLowerCase()} in the selected period.
            </CardFooter>
        </Card>
    );
}
