import { InvoiceItem } from "@prisma/client";
import { InvoicesResponse } from "@/actions/fetch-invoices";

interface SalesDataItem {
  totalSales: number;
  totalProfit: number;
}

interface SalesData {
  [key: string]: SalesDataItem;
}

export type EntityPerformance = {
  entity: string;
  totalSales: number;
  totalProfit: number;
  percentageSales: number;
};

export function calculateSalesData(
  response: InvoicesResponse,
  key: keyof InvoiceItem,
): SalesData {
  const salesData: SalesData = {};

  response.data?.forEach((invoice) => {
    invoice.items?.forEach((item) => {
      const rawValue = item[key];
      if (rawValue === null || rawValue === undefined) return;

      const value = String(rawValue);

      if (!salesData[value]) {
        salesData[value] = { totalSales: 0, totalProfit: 0 };
      }

      salesData[value].totalSales += item.price * item.quantity;
      salesData[value].totalProfit += item.profit;
    });
  });

  return salesData;
}

export function getEntitiesWithPercentage(
  salesData: SalesData,
  topN?: number,
): EntityPerformance[] {
  const sortedEntities = Object.entries(salesData).sort(
    (a, b) => b[1].totalSales - a[1].totalSales,
  );

  const overallTotalSales = sortedEntities.reduce(
    (total, [, entity]) => total + entity.totalSales,
    0,
  );

  const entitiesWithPercentage = sortedEntities.map(
    ([entity, { totalSales, totalProfit }]) => ({
      entity,
      totalSales,
      totalProfit,
      percentageSales:
        overallTotalSales === 0 ? 0 : (totalSales / overallTotalSales) * 100,
    }),
  );

  return topN ? entitiesWithPercentage.slice(0, topN) : entitiesWithPercentage;
}
