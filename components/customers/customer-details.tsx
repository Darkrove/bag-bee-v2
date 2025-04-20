"use client";

import { format } from "date-fns";
import { Clock, FileText, MapPin, Phone, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CustomerWithInvoices } from "@/actions/fetch-customers";
import { currencyFormatter } from "@/lib/utils";

interface CustomerData {
  customer: CustomerWithInvoices | null;
  invoiceCount: number;
  amountPaid: number;
  lastPurchaseDate: Date | null;
}

export default function CustomerDetails(data: CustomerData) {
  if (!data?.customer) {
    return (
      <div className="mx-auto py-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-medium">
              Customer Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No customer data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const { customer, invoiceCount, amountPaid, lastPurchaseDate } = data;

  return (
    <div className="mx-auto py-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-medium">
              Customer Details
            </CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              ID: {customer.id.substring(0, 8)}...
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <div className="font-medium">{customer.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <div>{customer.phone}</div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <div>{customer.address}</div>
              </div>
            </div>

            <Separator />

            {/* Purchase Summary */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                PURCHASE SUMMARY
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Invoices
                  </div>
                  <div className="text-xl font-medium">{invoiceCount}</div>
                </div>
                <div className="flex w-full flex-col items-end justify-end">
                  <div className="text-sm text-muted-foreground">
                    Total Amount
                  </div>
                  <div className="text-xl font-medium">
                    {currencyFormatter.format(amountPaid)}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">
                    Last Purchase
                  </div>
                  <div className="font-medium">
                    {lastPurchaseDate
                      ? format(lastPurchaseDate, "MMM dd, yyyy")
                      : "No recent purchase"}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Invoice Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                INVOICE TIMELINE
              </h3>

              {customer.invoices.map((invoice, index) => (
                <div key={invoice.id} className="relative pb-8 pl-6 last:pb-0">
                  {index < customer.invoices.length - 1 && (
                    <div className="absolute bottom-0 left-2 top-2 w-px bg-border" />
                  )}
                  <div className="absolute left-0 top-1 flex size-4 items-center justify-center rounded-full border border-primary bg-background">
                    <div className="size-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="flex items-start justify-between space-x-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <div className="font-medium">
                          INV#{invoice.id}
                        </div>
                        <Badge
                          variant="outline"
                          className="ml-2 border-green-200 bg-green-50 text-xs text-green-700"
                        >
                          paid
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-3" />
                        {format(invoice.createdAt, "MMM dd, yyyy")}
                      </div>
                    </div>
                    <div className="font-medium">
                      {currencyFormatter.format(invoice.totalAmount || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
