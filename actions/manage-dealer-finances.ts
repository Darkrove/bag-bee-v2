"use server";

import { db } from "@/lib/db";

export type DealerBillWithStrings = {
  id: number;
  dealerId: string;
  billNumber: string | null;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type DealerPaymentWithStrings = {
  id: number;
  dealerId: string;
  amount: number;
  date: string;
  paymentMethod: "CASH" | "ONLINE" | "GR";
  createdAt: string;
  updatedAt: string;
};

export type DealerWithHistory = {
  id: string;
  label: string;
  value: string;
  contactNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  bills: DealerBillWithStrings[];
  payments: DealerPaymentWithStrings[];
};

export async function fetchDealerDetails(id: string) {
  try {
    const dealer = await db.dealer.findUnique({
      where: { id },
      include: {
        bills: {
          orderBy: { date: "desc" },
        },
        payments: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!dealer) {
      return { data: null, error: "Dealer not found" };
    }

    return {
      data: {
        id: dealer.id,
        label: dealer.label,
        value: dealer.value,
        contactNumber: dealer.contactNumber,
        createdAt: dealer.createdAt.toISOString(),
        updatedAt: dealer.updatedAt.toISOString(),
        bills: dealer.bills.map((bill) => ({
          id: bill.id,
          dealerId: bill.dealerId,
          billNumber: bill.billNumber,
          amount: bill.amount,
          date: bill.date.toISOString(),
          createdAt: bill.createdAt.toISOString(),
          updatedAt: bill.updatedAt.toISOString(),
        })),
        payments: dealer.payments.map((payment) => ({
          id: payment.id,
          dealerId: payment.dealerId,
          amount: payment.amount,
          date: payment.date.toISOString(),
          paymentMethod: payment.paymentMethod as "CASH" | "ONLINE" | "GR",
          createdAt: payment.createdAt.toISOString(),
          updatedAt: payment.updatedAt.toISOString(),
        })),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching dealer details:", error);
    return { data: null, error: "Failed to fetch dealer details" };
  }
}

export async function createDealerBill(
  dealerId: string,
  amount: number,
  date: string,
  billNumber?: string
) {
  try {
    const bill = await db.dealerBill.create({
      data: {
        dealerId,
        amount: Math.max(0, Math.round(amount)),
        date: new Date(date),
        billNumber: billNumber?.trim() || null,
      },
    });

    return { data: bill, error: null };
  } catch (error) {
    console.error("Error creating dealer bill:", error);
    return { data: null, error: "Failed to create dealer bill" };
  }
}

export async function createDealerPayment(
  dealerId: string,
  amount: number,
  date: string,
  paymentMethod: "CASH" | "ONLINE" | "GR"
) {
  try {
    const payment = await db.dealerPayment.create({
      data: {
        dealerId,
        amount: Math.max(0, Math.round(amount)),
        date: new Date(date),
        paymentMethod,
      },
    });

    return { data: payment, error: null };
  } catch (error) {
    console.error("Error creating dealer payment:", error);
    return { data: null, error: "Failed to create dealer payment" };
  }
}

export async function updateDealerBill(
  billId: number,
  amount: number,
  date: string,
  billNumber?: string
) {
  try {
    const bill = await db.dealerBill.update({
      where: { id: billId },
      data: {
        amount: Math.max(0, Math.round(amount)),
        date: new Date(date),
        billNumber: billNumber?.trim() || null,
      },
    });

    return { data: bill, error: null };
  } catch (error) {
    console.error("Error updating dealer bill:", error);
    return { data: null, error: "Failed to update dealer bill" };
  }
}

export async function updateDealerPayment(
  paymentId: number,
  amount: number,
  date: string,
  paymentMethod: "CASH" | "ONLINE" | "GR"
) {
  try {
    const payment = await db.dealerPayment.update({
      where: { id: paymentId },
      data: {
        amount: Math.max(0, Math.round(amount)),
        date: new Date(date),
        paymentMethod,
      },
    });

    return { data: payment, error: null };
  } catch (error) {
    console.error("Error updating dealer payment:", error);
    return { data: null, error: "Failed to update dealer payment" };
  }
}

export async function deleteDealerBill(billId: number) {
  try {
    await db.dealerBill.delete({
      where: { id: billId },
    });

    return { data: null, error: null };
  } catch (error) {
    console.error("Error deleting dealer bill:", error);
    return { data: null, error: "Failed to delete dealer bill" };
  }
}

export async function deleteDealerPayment(paymentId: number) {
  try {
    await db.dealerPayment.delete({
      where: { id: paymentId },
    });

    return { data: null, error: null };
  } catch (error) {
    console.error("Error deleting dealer payment:", error);
    return { data: null, error: "Failed to delete dealer payment" };
  }
}
