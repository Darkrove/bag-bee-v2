import { NextRequest, NextResponse } from "next/server";
import messages from "@/constants/messages";
import {
  endOfDay,
  endOfYear,
  parseISO,
  startOfDay,
  startOfYear,
} from "date-fns";
import { z } from "zod";

import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const fromString = searchParams.get("from") || "";
  const toString = searchParams.get("to") || "";

  try {
    const start = Date.now();

    if (fromString === "" || toString === "") {
      return NextResponse.json({
        error: "Missing required parameter(s)",
      });
    }

    const from = startOfDay(parseISO(fromString));
    const to = endOfDay(parseISO(toString));

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return NextResponse.json({ error: "Invalid date format" });
    }

    const invoices = await db.invoice.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        items: true, // <-- automatically joins invoiceItem
      },
      orderBy: {
        id: "asc",
      },
    });

    const totalSales = await db.invoice.aggregate({
      where: { createdAt: { gte: from, lte: to } },
      _sum: { totalAmount: true },
    });
    
    const totalProfit = await db.invoice.aggregate({
      where: { createdAt: { gte: from, lte: to } },
      _sum: { totalProfit: true },
    });

    const end = Date.now();

    return NextResponse.json({
      success: true,
      message: "GET /api/invoice",
      time: `${end - start}ms`,
      data: invoices,
      totalSales,
      totalProfit,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
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
    } = await request.json();

    if (!id) {
      return NextResponse.json(messages.request.invalid, { status: 400 });
    }

    const start = Date.now();

    // Update the invoice
    await db.$transaction([
      db.invoice.update({
        where: { id },
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
          updatedAt: new Date(),
        },
      }),
      ...items.map((item: any) =>
        db.invoiceItem.update({
          where: { id: item.id },
          data: {
            productCategory: item.productCategory,
            quantity: item.quantity,
            price: item.price,
            amount: item.amount,
            note: item.note,
            code: item.code,
            profit: item.profit,
            dealerCode: item.dealerCode,
            updatedAt: new Date(),
          },
        })
      ),
    ]);
    
    const end = Date.now();

    return NextResponse.json(
      {
        success: true,
        message: messages.updated,
        id,
        time: `${end - start}ms`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
