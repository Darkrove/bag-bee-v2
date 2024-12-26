import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { endOfYear, format, formatDistance, startOfYear } from "date-fns"
import { ReactNode } from "react";

import { dateFormat } from "@/constants/date"
import { apiUrls } from "@/lib/api-urls"
import { dealers } from "@/constants/table";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { currencyFormatter } from "@/lib/utils";

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

  interface SalesData {
    totalSales: number;
    totalProfit: number;
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
    icon?: ReactNode;
  }

  interface CategoryWithPercentage {
    entity: string;
    totalSales: number;
    totalProfit: number;
    percentageSales: number;
  }

  

async function fetchInvoices(from: string, to: string): Promise<Invoice[]> {
    const result = await fetch(
        process.env.NEXTAUTH_URL + apiUrls.invoice.getInvoice({ from, to }),
        { cache: "no-store" }
    ).then((res) => res.json());

    return result?.data || [];
}

function calculateTopCategories(invoices: Invoice[], topN: number): CategoryWithPercentage[] {
    const categorySales: { [category: string]: SalesData } = {};
  
    // Calculate total sales and profit for each category
    invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          if (!categorySales[item.productCategory]) {
            categorySales[item.productCategory] = {
              totalSales: 0,
              totalProfit: 0,
            }
          }
    
          categorySales[item.productCategory].totalSales +=
            item.price * item.quantity
          categorySales[item.productCategory].totalProfit += item.profit
        })
      })
  
    // Convert categorySales to an array for sorting
    const sortedCategories = Object.entries(categorySales).sort(
      (a, b) => b[1].totalSales - a[1].totalSales
    );
  // console.log(invoices[1].items)
    // Extract the top N categories
    const topCategories = sortedCategories.slice(0, topN);
  
    // Calculate total sales across all categories
    const overallTotalSales = Object.values(categorySales).reduce(
      (total, category) => total + category.totalSales,
      0
    );
  
    // Calculate percentage sales for each category
    const categoriesWithPercentage = sortedCategories.map(
      ([entity, { totalSales, totalProfit }]) => {
        const percentageSales = (totalSales / overallTotalSales) * 100;
        return {
          entity,
          totalSales,
          totalProfit,
          percentageSales,
        };
      }
    );
  
    // Extract the top N categories with percentage sales
    return categoriesWithPercentage.slice(0, topN);
  }



export default async function TopDataList() {
    const from = format(new Date('2023-01-01'), dateFormat);
    const to = format(endOfYear(new Date()), dateFormat);
    const invoices = await fetchInvoices(from, to);
// console.log(invoices[0].items)
    const topCategoriesWithPercentage = calculateTopCategories(invoices, 5);
    return (
<div className="grid gap-4">
      <TopListCard
        heading="Top Categories"
        title="Top 5 product categories"
         link="/featured-products"
        data={topCategoriesWithPercentage}
        icon={true}
      />
    </div>
  );
    
}

const TopListCard: React.FC<TopListCardProps> = ({ heading, title, link, data, icon }) => {
    
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
                                {item.entity}
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
                {index !== data.length - 1 && <Separator className="border-gray-500" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };