"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import messages from "@/constants/messages";
import { prisma } from "@/lib/db";
import { InvoiceData } from "./fetch-invoices";

interface CreateInvoicesResponse {
  status: string;
  message: string | z.ZodIssue[];
  time?: string;
  data?: InvoiceData;
  id?: number;
}

import { InvoiceDataRequest } from "@/types/invoice";

const invoiceSchema = z.object({
  customerName: z.string(),
  customerPhone: z.string(),
  customerAddress: z.string(),
  paymentMode: z.string(),
  warrantyPeriod: z.string(),
  cashierName: z.string(),
  totalAmount: z.number(),
  totalProfit: z.number(),
  totalQuantity: z.number(),
  items: z.array(
    z.object({
      productCategory: z.string(),
      quantity: z.number(),
      price: z.number(),
      amount: z.number(),
      note: z.string().optional(),
      code: z.string(),
      profit: z.number(),
      dealerCode: z.string(),
    }),
  ),
});

export type InvoiceInterface = z.infer<typeof invoiceSchema>;

export async function createInvoice(data: InvoiceDataRequest): Promise<CreateInvoicesResponse> {
  const validationResult = invoiceSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      status: "error",
      message: validationResult.error.issues,
    };
  }

  const {
    customerName,
    customerPhone,
    customerAddress,
    paymentMode,
    warrantyPeriod,
    cashierName,
    totalAmount,
    totalProfit,
    totalQuantity,
    items,
  } = validationResult.data;

  try {
    const start = Date.now();
    const invoiceData = await prisma.invoice.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        paymentMode,
        warrantyPeriod,
        cashierName,
        totalAmount,
        totalProfit,
        totalQuantity,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    const end = Date.now();

    return {
      status: "success",
      message: messages.success,
      time: `${end - start}ms`,
      data: invoiceData,
      id: invoiceData.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return {
        status: "error",
        message: error.issues,
      };
    }
    return {
      status: "error",
      message: messages.request.failed,
    };
  }
}
