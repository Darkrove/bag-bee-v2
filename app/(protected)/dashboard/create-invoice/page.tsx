import { Luggage, Receipt } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceForm } from "@/components/forms/invoice-form"
import { ItemForm } from "@/components/forms/item-form"

export const metadata = constructMetadata({
  title: "Invoice",
  description: "List of charts by shadcn-ui",
});

export default function InvoicePage() {
  return (
    <>
      <DashboardHeader heading="Invoice" text="List of charts by shadcn-ui." />
      <section className="container grid items-center gap-6">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className=" text-xl font-bold  md:text-2xl">
              Choose Product
            </CardTitle>
            <Luggage className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ItemForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold md:text-2xl">
              New Invoice
            </CardTitle>
            <Receipt className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <InvoiceForm />
          </CardContent>
        </Card>
      </div>
    </section>
    </>
    );
}
