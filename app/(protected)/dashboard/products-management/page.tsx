import LayoutHeader from "@/components/dashboard/header";
import { ProductsManagementTable } from "@/components/admin/products-management-table"

export default function ProductsManagementPage() {

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
