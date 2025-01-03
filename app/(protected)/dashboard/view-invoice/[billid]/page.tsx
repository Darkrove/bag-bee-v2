import { getInvoiceById, InvoicesResponse } from "@/actions/fetch-invoice-by-id";
import { DashboardHeader } from "@/components/dashboard/header"
import InvoiceLayout from "@/components/invoice/invoice-layout";
import { constructMetadata } from "@/lib/utils";

interface Props {
    params: {
        billid: string
    }
}

export const metadata = constructMetadata({
    title: "View Invoice | Famous Bag",
    description: "View your invoice.",
});

export default async function ViewInvoicePage({ params: { billid } }: Props) {
    // Fetch the invoice data
    const result: InvoicesResponse = await getInvoiceById(parseInt(billid));

    // Check if the fetch was successful and the invoice exists
    if (result.status === 'success' && result.invoice && result.invoiceItems) {
        return (
            <>
                <section className="grid items-center gap-6">
                    <InvoiceLayout invoice={result.invoice} invoiceItem={result.invoiceItems} />
                </section>
            </>
        );
    } else {
        // Handle the case where the invoice is not found or an error occurred
        return (
            <>
                <section className="grid items-center gap-6">
                    <p>Invoice not found or an error occurred.</p>
                </section>
            </>
        );
    }
}