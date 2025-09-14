import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    console.error("Error fetching invoices", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}