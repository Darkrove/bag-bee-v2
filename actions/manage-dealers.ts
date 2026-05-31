"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function fetchDealers() {
  try {
    const dealers = await db.dealer.findMany({
      orderBy: { label: "asc" },
    });
    return { data: dealers, error: null };
  } catch (error) {
    console.error("Error fetching dealers:", error);
    return { data: null, error: "Failed to fetch dealers" };
  }
}

export async function createDealer(label: string, value: string, contactNumber?: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { data: null, error: "Unauthorized" };
    }

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
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { data: null, error: "Unauthorized" };
    }

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
