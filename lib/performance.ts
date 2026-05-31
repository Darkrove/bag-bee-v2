import { InvoiceItem } from "@prisma/client";
import { InvoicesResponse } from "@/actions/fetch-invoices";

interface SalesDataItem {
  totalSales: number;
  totalProfit: number;
}

interface SalesData {
  [key: string]: SalesDataItem;
}

export type MonthlyPerformance = {
  month: string;
  totalSales: number;
  totalProfit: number;
};

export type EntityPerformance = {
  entity: string;
  totalSales: number;
  totalProfit: number;
  percentageSales: number;
};

export type EntityPerformanceWithMonthly = EntityPerformance & {
  monthly: MonthlyPerformance[];
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

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

export function getEntityMonthlyPerformance(
  response: InvoicesResponse,
  key: keyof InvoiceItem,
  topN?: number,
): EntityPerformanceWithMonthly[] {
  const entities: Record<
    string,
    {
      totalSales: number;
      totalProfit: number;
      monthly: MonthlyPerformance[];
    }
  > = {};

  response.data?.forEach((invoice) => {
    invoice.items?.forEach((item) => {
      const rawValue = item[key];
      if (rawValue === null || rawValue === undefined) return;

      const entity = String(rawValue);
      const monthIndex = new Date(item.createdAt).getMonth();
      const sales = item.price * item.quantity;
      const profit = item.profit;

      if (!entities[entity]) {
        entities[entity] = {
          totalSales: 0,
          totalProfit: 0,
          monthly: MONTH_LABELS.map((label) => ({
            month: label,
            totalSales: 0,
            totalProfit: 0,
          })),
        };
      }

      entities[entity].totalSales += sales;
      entities[entity].totalProfit += profit;
      entities[entity].monthly[monthIndex].totalSales += sales;
      entities[entity].monthly[monthIndex].totalProfit += profit;
    });
  });

  const sortedEntities = Object.entries(entities).sort(
    (a, b) => b[1].totalSales - a[1].totalSales,
  );

  const overallTotalSales = sortedEntities.reduce(
    (total, [, entity]) => total + entity.totalSales,
    0,
  );

  const result = sortedEntities.map(([entity, data]) => ({
    entity,
    totalSales: data.totalSales,
    totalProfit: data.totalProfit,
    percentageSales:
      overallTotalSales === 0 ? 0 : (data.totalSales / overallTotalSales) * 100,
    monthly: data.monthly,
  }));

  return topN ? result.slice(0, topN) : result;
}
