"use server"

import { db } from "@/lib/db";
import { Customer, Invoice } from "@prisma/client";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function fetchCustomers(
  fromString: string,
  toString: string,
): Promise<{ data: Customer[] }> {
  try {
    const from = startOfDay(parseISO(fromString));
    const to = endOfDay(parseISO(toString));

    const customers = await db.customer.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    return { data: customers };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { data: [] };
  }
}

export interface CustomerWithInvoices extends Customer {
  invoices: Invoice[]; // Include invoices in the customer object
}

export async function fetchCustomerDetailsByIdWithInvoices(
  customerId: string,
): Promise<{ customer: CustomerWithInvoices | null; invoiceCount: number; amountPaid: number; lastPurchaseDate: Date | null }> {
  try {
    const customer = await db.customer.findUnique({
      where: {
        id: customerId,
      },
      include: {
        invoices: true, // Include related invoices
      },
    });

    if (!customer) {
      return { customer: null, invoiceCount: 0, amountPaid: 0, lastPurchaseDate: null };
    }

    const invoiceCount = customer.invoices.length;
    const amountPaid = customer.invoices.reduce((total, invoice) => total + (invoice.totalAmount || 0), 0);
    const lastPurchaseDate = customer.invoices.length > 0 ? new Date(Math.max(...customer.invoices.map((invoice) => new Date(invoice.createdAt).getTime()))) : null;

    return { customer, invoiceCount, amountPaid, lastPurchaseDate };
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return { customer: null, invoiceCount: 0, amountPaid: 0, lastPurchaseDate: null };
  }
}

export async function fetchCustomerById(id: string): Promise<Customer | null> {
  try {
    const customer = await db.customer.findUnique({
      where: {
        id,
      },
    });

    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

