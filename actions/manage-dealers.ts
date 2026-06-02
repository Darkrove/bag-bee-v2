"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function fetchDealers() {
  try {
    const dealers = await db.dealer.findMany({
      orderBy: { label: "asc" },
      include: {
        bills: {
          select: {
            amount: true,
          },
        },
        payments: {
          select: {
            amount: true,
          },
        },
      },
    });

    const formattedDealers = dealers.map((dealer) => {
      const totalBilled = dealer.bills.reduce((sum, bill) => sum + bill.amount, 0);
      const totalPaid = dealer.payments.reduce((sum, payment) => sum + payment.amount, 0);
      return {
        id: dealer.id,
        label: dealer.label,
        value: dealer.value,
        contactNumber: dealer.contactNumber,
        updatedAt: dealer.updatedAt.toISOString(),
        totalBilled,
        totalPaid,
        remainingBalance: totalBilled - totalPaid,
      };
    });

    return { data: formattedDealers, error: null };
  } catch (error) {
    console.error("Error fetching dealers:", error);
    return { data: null, error: "Failed to fetch dealers" };
  }
}

export async function createDealer(label: string, value: string, contactNumber?: string) {
  try {
    const dealer = await db.dealer.create({
      data: {
        label,
        value: value.toUpperCase(),
        contactNumber,
      },
    });
    return { data: dealer, error: null };
  } catch (error) {
    console.error("Error creating dealer:", error);
    return { data: null, error: "Failed to create dealer" };
  }
}

export async function updateDealer(id: string, label: string, value: string, contactNumber?: string) {
  try {
    const dealer = await db.dealer.update({
      where: { id },
      data: {
        label,
        value: value.toUpperCase(),
        contactNumber,
        updatedAt: new Date(),
      },
    });
    return { data: dealer, error: null };
  } catch (error) {
    console.error("Error updating dealer:", error);
    return { data: null, error: "Failed to update dealer" };
  }
}

export async function deleteDealer(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { data: null, error: "Unauthorized" };
    }

    await db.dealer.delete({
      where: { id },
    });
    return { data: null, error: null };
  } catch (error) {
    console.error("Error deleting dealer:", error);
    return { data: null, error: "Failed to delete dealer" };
  }
}
