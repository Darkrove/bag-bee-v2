import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import LayoutHeader from "@/components/dashboard/header";
import { DealerPaymentManagement } from "@/components/admin/dealer-payment-management";
import { fetchDealerDetails } from "@/actions/manage-dealer-finances";

interface DealerManagementPageProps {
  params: {
    dealerId: string;
  };
}

export default async function DealerManagementPage({ params }: DealerManagementPageProps) {
  const result = await fetchDealerDetails(params.dealerId);

  if (!result.data) {
    notFound();
  }

  return (
    <>
      <LayoutHeader
        heading="Dealer Payment Ledger"
        text={`Track bills, payments, and remaining balance for ${result.data.label}.`}
      />
      <DealerPaymentManagement initialDealer={result.data} />
    </>
  );
}
