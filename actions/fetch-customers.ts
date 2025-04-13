"use server"

import { db } from "@/lib/db";
import { Customer } from "@prisma/client";
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

