import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseISO, startOfDay, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const fromString = searchParams.get("from");
  const toString = searchParams.get("to");

  if (!fromString || !toString) {
    return NextResponse.json({ error: "Missing date params" }, { status: 400 });
  }

  const from = startOfDay(parseISO(fromString));
  const to = endOfDay(parseISO(toString));

  const daily = await db.invoice.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: from, lte: to } },
    _sum: { totalAmount: true, totalProfit: true },
    orderBy: { createdAt: "asc" },
  });

  const formatted = daily.map((d) => ({
    date: d.createdAt.toISOString().split("T")[0],
    sales: d._sum.totalAmount || 0,
    profit: d._sum.totalProfit || 0,
  }));

  return NextResponse.json({ success: true, data: formatted });
}
