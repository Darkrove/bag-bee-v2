import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import LayoutHeader from "@/components/dashboard/header";
import { UserRole } from "@prisma/client";
import { fetchUsers } from "@/actions/fetch-users";
import { UsersTable } from "@/components/admin/users-table";
import { columns } from "@/components/admin/users-columns";
import { UsersTableMobile } from "@/components/admin/users-table-mobile";

type User = {
  name: string | null;
  id: string;
  createdAt: Date;
  email: string | null;
  image: string | null;
  role: UserRole;
};

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) redirect("/login");

  let users: User[] = [];
  try {
    users = await fetchUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <>
      <LayoutHeader
        heading="Users Management"
        text="Manage all registered users and their roles."
      />
      <div className="flex flex-col gap-4">
        <UsersTable columns={columns} data={users} />
        <UsersTableMobile data={users} />
      </div>
    </>
  );
}
