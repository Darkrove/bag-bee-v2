import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LayoutHeader from "@/components/dashboard/header";
import { ProductsManagementTable } from "@/components/admin/products-management-table"

export default async function ProductsManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <>
      <LayoutHeader
        heading="Manage Products"
        text="Add, edit, or delete product categories."
      />
      <ProductsManagementTable />
    </>
  );
}
