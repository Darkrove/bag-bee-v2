"use server";
import { prisma } from "@/lib/db";
import { Invoice, InvoiceItem } from "@prisma/client";

export interface Status {
  status: string;
}

export const updateInvoice = async (
  id: number,
  data: Partial<Invoice>,
): Promise<Status> => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data,
    });
    return { status: "success" };
  } catch (error) {
    return { status: "error" };
  }
};
