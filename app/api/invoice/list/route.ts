import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const fromString = searchParams.get("from");
    const toString = searchParams.get("to");

    if (!fromString || !toString) {
      return NextResponse.json(
        { error: "Missing date params" },
        { status: 400 },
      );
    }

    const from = startOfDay(parseISO(fromString));
    const to = endOfDay(parseISO(toString));

    const where: any = {};
    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
    } else {
      // default → today only
      where.createdAt = {
        gte: startOfDay(new Date()),
        lte: endOfDay(new Date()),
      };
    }

    const invoices = await db.invoice.findMany({
      where,
      select: {
        id: true,
        customerName: true,
        customerPhone: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    console.error("Error fetching invoices", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}
