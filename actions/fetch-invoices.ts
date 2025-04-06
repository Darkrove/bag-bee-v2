"use server";
import {
  endOfDay,
  parseISO,
  startOfDay,
} from "date-fns";
import { db } from "@/lib/db";
import { Invoice, InvoiceItem } from "@prisma/client";

export interface InvoiceData extends Invoice {
  items: InvoiceItem[];
}

export interface InvoicesResponse {
  status: string;
  data?: InvoiceData[];
  totalSales?: number;
  totalProfit?: number;
}

export async function fetchInvoices(
  fromString: string,
  toString: string,
): Promise<InvoicesResponse> {
  try {
    const from = startOfDay(parseISO(fromString));
    const to = endOfDay(parseISO(toString));

    const invoices = await db.invoice.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    const invoiceItems = await db.invoiceItem.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    const data = invoices.map((invoice) => {
      const items = invoiceItems.filter(
        (item) => item.invoiceId === invoice.id,
      );
      return {
        ...invoice,
        items,
      };
    });

    data.sort((a, b) => a.id - b.id);

    const totalSales = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalProfit = data.reduce((acc, curr) => acc + curr.totalProfit, 0);

    return { status: "success", data, totalSales, totalProfit };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}
