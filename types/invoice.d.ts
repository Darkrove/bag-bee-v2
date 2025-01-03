import { Invoic } from "@prisma/client";

export interface InvoiceItemRequest {
    code: string;
    productCategory: string;
    quantity: number;
    price: number;
    amount: number;
    profit: number;
    note?: string | null;
    dealerCode: string;
  }
  
  export interface InvoiceDataRequest {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    paymentMode: string;
    warrantyPeriod: string;
    cashierName: string;
    totalAmount: number;
    totalProfit: number;
    totalQuantity: number;
    items: InvoiceItemRequest[];
  }