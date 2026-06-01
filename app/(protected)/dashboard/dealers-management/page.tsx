import LayoutHeader from "@/components/dashboard/header";
import { DealersManagementTable } from "@/components/admin/dealers-management-table"

export default function DealersManagementPage() {

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
