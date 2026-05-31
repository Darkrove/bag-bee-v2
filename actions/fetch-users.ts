"use server";

import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export async function fetchUsers() {
  try {
    const session = await auth();

    // Only admins can fetch all users
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      throw new Error("Unauthorized");
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
