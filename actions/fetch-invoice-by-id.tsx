"use server";

import { prisma } from "@/lib/db";
import { Invoice, InvoiceItem } from "@prisma/client";

// Define the interface that includes invoice and its items
export interface InvoiceData extends Invoice {
    items: InvoiceItem[];
}

// Define the response type for the function
export interface InvoicesResponse {
    status: string;
    invoice?: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        customerPhone: string;
        customerAddress: string;
        cashierName: string;
        totalAmount: number;
        totalProfit: number;
        totalQuantity: number;
        paymentMode: string;
        warrantyPeriod: string;
    };
    invoiceItems?: InvoiceItem[];
}

// Define the function to fetch an invoice by ID
export async function getInvoiceById(billid: number): Promise<InvoicesResponse> {
    try {
        // Fetch the invoice from the database
        const invoice = await prisma.invoice.findUnique({
            where: {
                id: billid,
            },
            include: {
                items: true, // Assuming 'items' is the relation name for InvoiceItems
            },
        });

        // If invoice is not found, return an error status
        if (!invoice) {
            return { status: "error", invoice: undefined, invoiceItems: undefined };
        }

        // Construct the response to match the expected type
        const response = {
            status: "success",
            invoice: {
                id: invoice.id,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
                customerName: invoice.customerName,
                customerPhone: invoice.customerPhone,
                customerAddress: invoice.customerAddress,
                cashierName: invoice.cashierName,
                totalAmount: invoice.totalAmount,
                totalProfit: invoice.totalProfit,
                totalQuantity: invoice.totalQuantity,
                paymentMode: invoice.paymentMode,
                warrantyPeriod: invoice.warrantyPeriod,
            },
            invoiceItems: invoice.items,
        };

        return response;
    } catch (error) {
        console.error("Error fetching invoice:", error);
        return { status: "error" };
    }
}