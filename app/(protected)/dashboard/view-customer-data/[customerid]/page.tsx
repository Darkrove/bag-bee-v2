import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";

interface Props {
    params: {
        customerid: string
    }
}

export const metadata = constructMetadata({
    title: "View Customer Data | Famous Bag",
    description: "View Customer Data.",
});

export default async function ViewInvoicePage({ params: { customerid } }: Props) {
    return (
        <>
        <DashboardHeader heading="Customer" text="Customer Data" />
            <section className="grid items-center gap-6">
                <p>Customer with id {customerid} not found or an error occurred.</p>
            </section>
        </>
    )
}