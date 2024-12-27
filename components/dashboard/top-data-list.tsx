import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { endOfYear, format } from "date-fns";

import { dateFormat } from "@/constants/date";
import { apiUrls } from "@/lib/api-urls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currencyFormatter, getDealerLabelFromValue } from "@/lib/utils";

interface InvoiceItem {
  productCategory: string;
  dealerCode: string;
  price: number;
  quantity: number;
  profit: number;
}

interface Invoice {
  items: InvoiceItem[];
}

interface SalesDataItem {
  totalSales: number;
  totalProfit: number;
}

interface SalesData {
  [key: string]: SalesDataItem;
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

async function fetchInvoices(from: string, to: string): Promise<Invoice[]> {
  const result = await fetch(
    process.env.NEXTAUTH_URL + apiUrls.invoice.getInvoice({ from, to }),
    { cache: "no-store" },
  ).then((res) => res.json());

  return result?.data || [];
}

function calculateSalesData(
  invoices: Invoice[],
  key: keyof InvoiceItem,
): SalesData {
  const salesData: SalesData = {};

  invoices.forEach((invoice) => {
    invoice.items.forEach((item) => {
      const value = item[key];
      if (!salesData[value]) {
        salesData[value] = { totalSales: 0, totalProfit: 0 };
      }
      salesData[value].totalSales += item.price * item.quantity;
      salesData[value].totalProfit += item.profit;
    });
  });

  return salesData;
}

function getTopEntitiesWithPercentage(salesData: SalesData, topN: number) {
  const sortedEntities = Object.entries(salesData).sort(
    (a, b) => b[1].totalSales - a[1].totalSales,
  );

  const overallTotalSales = Object.values(salesData).reduce(
    (total, entity) => total + entity.totalSales,
    0,
  );

  const entitiesWithPercentage = sortedEntities.map(
    ([entity, { totalSales, totalProfit }]) => ({
      entity,
      totalSales,
      totalProfit,
      percentageSales: (totalSales / overallTotalSales) * 100,
    }),
  );

  return entitiesWithPercentage.slice(0, topN);
}

export default async function TopDataList() {
  const from = format(new Date("2023-01-01"), dateFormat);
  const to = format(endOfYear(new Date()), dateFormat);
  
  const invoices = await fetchInvoices(from, to);

  const categorySalesData = calculateSalesData(invoices, "productCategory");
  const dealerSalesData = calculateSalesData(invoices, "dealerCode");

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
                      {isDealer
                        ? `${getDealerLabelFromValue(item.entity)}`
                        : `${item.entity}`}
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
