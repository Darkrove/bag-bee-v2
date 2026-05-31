import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { endOfYear, format, startOfYear } from "date-fns";

import { dateFormat } from "@/constants/date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toCamelCase, currencyFormatter } from "@/lib/utils";
import { fetchInvoices, InvoicesResponse } from "@/actions/fetch-invoices";
import {
  calculateSalesData,
  getEntitiesWithPercentage,
} from "@/lib/performance";

interface InvoiceItem {
  productCategory: string;
  dealerCode: string;
  price: number;
  quantity: number;
  profit: number;
}

interface TopListCardProps {
  heading: string;
  title: string;
  link: string;
  data: {
    entity: string;
    totalSales: number;
    totalProfit: number;
    percentageSales: number;
  }[];
  isDealer?: boolean;
}

function getTopEntitiesWithPercentage(
  salesData: Record<string, { totalSales: number; totalProfit: number }>,
  topN: number,
) {
  return getEntitiesWithPercentage(salesData, topN);
}

export default async function TopDataList() {
  const from = format(startOfYear(new Date()), dateFormat);
  const to = format(endOfYear(new Date()), dateFormat);
  
  const result = await fetchInvoices(from, to)

  const categorySalesData = calculateSalesData(result, "productCategory");
  const dealerSalesData = calculateSalesData(result, "dealerCode");

  const topCategoriesWithPercentage = getTopEntitiesWithPercentage(
    categorySalesData,
    5,
  );
  const topDealersWithPercentage = getTopEntitiesWithPercentage(
    dealerSalesData,
    5,
  );
  return (
    <div className="grid gap-4">
      <TopListCard
        heading="Top Categories"
        title="Top 5 product categories"
        link="/featured-products"
        data={topCategoriesWithPercentage}
      />
      <TopListCard
        heading="Top Dealers"
        title="Top 5 delaers by sales"
        link="/featured-dealers"
        data={topDealersWithPercentage}
        isDealer={true}
      />
    </div>
  );
}

const TopListCard: React.FC<TopListCardProps> = ({
  heading,
  title,
  link,
  data,
  isDealer,
}) => {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{heading}</CardTitle>
          <CardDescription className="text-balance">{title}</CardDescription>
        </div>
        <Button size="sm" className="ml-auto shrink-0 gap-1 px-4">
          <Link href={link} className="flex items-center gap-2">
            <span>View All</span>
            <ArrowUpRight className="hidden size-4 sm:block" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div>
          {data.map((item, index) => (
            <div key={index} className="flex flex-col gap-3 pt-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="size-8 text-green-400" />
                <div className="ml-4 flex space-x-1">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium capitalize leading-none">
                      {toCamelCase(item.entity)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.percentageSales.toFixed(2)}% of sales
                    </p>
                  </div>
                </div>
                <div className="ml-auto flex flex-row gap-3 font-medium">
                  <div className="flex flex-col space-y-1 text-right">
                    <p className="text-sm font-medium capitalize leading-none">
                      {currencyFormatter.format(item.totalSales)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currencyFormatter.format(item.totalProfit)}
                    </p>
                  </div>
                </div>
              </div>
              {index !== data.length - 1 && (
                <Separator className="border-gray-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
