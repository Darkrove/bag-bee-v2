import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LayoutHeader from "@/components/dashboard/header";
import { DealersManagementTable } from "@/components/admin/dealers-management-table"

export default async function DealersManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <>
      <LayoutHeader
        heading="Manage Dealers"
        text="Add, edit, or delete dealer information."
      />
      <DealersManagementTable />
    </>
  );
}
