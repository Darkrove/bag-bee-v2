"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { InvoiceDataRequest } from "@/types/invoice"

export async function createInvoice(data: InvoiceDataRequest) {
  try {
    // Check if customer exists
    let customerId: string | null = null
    const existingCustomer = await db.customer.findFirst({
      where: {
        OR: [
          { phone: data.customerPhone },
          {
            name: data.customerName,
            phone: data.customerPhone,
          },
        ],
      },
    })

    // Create or update customer
    if (existingCustomer) {
      await db.customer.update({
        where: { id: existingCustomer.id },
        data: {
          name: data.customerName,
          phone: data.customerPhone,
          address: data.customerAddress,
          updatedAt: new Date(),
        },
      })
      customerId = existingCustomer.id
    } else {
      const newCustomer = await db.customer.create({
        data: {
          name: data.customerName,
          phone: data.customerPhone,
          address: data.customerAddress,
        },
      })
      customerId = newCustomer.id
    }

    // Create invoice with customer reference
    const invoice = await db.invoice.create({
      data: {
        customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        cashierName: data.cashierName,
        totalAmount: data.totalAmount,
        totalProfit: data.totalProfit,
        totalQuantity: data.totalQuantity,
        paymentMode: data.paymentMode,
        warrantyPeriod: data.warrantyPeriod,
        items: {
          create: data.items.map((item) => ({
            productCategory: item.productCategory,
            note: item.note || "",
            quantity: item.quantity,
            price: item.price,
            amount: item.amount,
            code: item.code,
            profit: item.profit,
            dealerCode: item.dealerCode,
          })),
        },
      },
    })

    revalidatePath("/dashboard/invoices")
    return { status: "success", id: invoice.id }
  } catch (error) {
    console.error("Error creating invoice:", error)
    return {
      status: "error",
      message: "Failed to create invoice. Please try again.",
    }
  }
}

