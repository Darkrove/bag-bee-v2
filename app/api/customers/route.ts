import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || ""

    if (!query || query.length < 2) {
      return NextResponse.json({ customers: [] })
    }

    const customers = await db.customer.findMany({
      where: {
        OR: [{ name: { contains: query, mode: "insensitive" } }, { phone: { contains: query, mode: "insensitive" } }],
      },
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Error searching customers:", error)
    return NextResponse.json({ error: "Failed to search customers" }, { status: 500 })
  }
}

