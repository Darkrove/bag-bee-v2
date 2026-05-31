"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

import { db } from "@/lib/db";
import { userRoleSchema } from "@/lib/validations/user";

export type FormData = {
  role: UserRole;
};

export async function updateUserRoleAdmin(userId: string, data: FormData) {
  try {
    const session = await auth();

    // Only admins can update user roles
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      throw new Error("Unauthorized");
    }

    // Prevent admin from changing their own role
    if (session.user.id === userId) {
      throw new Error("Cannot change your own role");
    }

    const { role } = userRoleSchema.parse(data);

    // Update the user role.
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });

    revalidatePath("/admin/users");
    return { status: "success" };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update user role",
    };
  }
}
