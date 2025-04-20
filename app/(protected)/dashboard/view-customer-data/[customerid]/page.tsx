import {
  fetchCustomerDetailsByIdWithInvoices,
} from "@/actions/fetch-customers";
import CustomerDetails from "@/components/customers/customer-details";
import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";

interface Props {
  params: {
    customerid: string;
  };
}

export const metadata = constructMetadata({
  title: "View Customer Data | Famous Bag",
  description: "View Customer Data.",
});

export default async function ViewInvoicePage({
  params: { customerid },
}: Props) {
  const result = await fetchCustomerDetailsByIdWithInvoices(customerid);
  console.log("result", result);

  return (
    <>
      <DashboardHeader heading="Customer" text="Customer Data" />
      <CustomerDetails
        customer={result.customer}
        invoiceCount={result.invoiceCount}
        amountPaid={result.amountPaid}
        lastPurchaseDate={result.lastPurchaseDate}
      />
    </>
  );
}
