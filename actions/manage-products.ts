"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function fetchProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: { label: "asc" },
    });
    return { data: products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: null, error: "Failed to fetch products" };
  }
}

export async function createProduct(label: string, value: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { data: null, error: "Unauthorized" };
    }

    const product = await db.product.create({
      data: {
        label,
        value: value.toUpperCase(),
      },
    });
    return { data: product, error: null };
  } catch (error) {
    console.error("Error creating product:", error);
    return { data: null, error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  label: string,
  value: string,
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { data: null, error: "Unauthorized" };
    }

    const product = await db.product.update({
      where: { id },
      data: {
        label,
        value: value.toUpperCase(),
        updatedAt: new Date(),
      },
    });
    return { data: product, error: null };
  } catch (error) {
    console.error("Error updating product:", error);
    return { data: null, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { data: null, error: "Unauthorized" };
    }

    await db.product.delete({
      where: { id },
    });
    return { data: null, error: null };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { data: null, error: "Failed to delete product" };
  }
}
