import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { endOfYear, format, formatDistance, startOfYear } from "date-fns";

import { dateFormat } from "@/constants/date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { currencyFormatter, getRandomNumber } from "@/lib/utils";
import { fetchInvoices } from "@/actions/fetch-invoices";
import { Invoice } from "@prisma/client";

export default async function TransactionsList({showRowsNumber}: {showRowsNumber: number}) {
  const from = format(startOfYear(new Date()), dateFormat);
  const to = format(endOfYear(new Date()), dateFormat);
  const result = await fetchInvoices(from, to);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription className="text-balance">
            Recent transactions from your store.
          </CardDescription>
        </div>
        <Button size="sm" className="ml-auto shrink-0 gap-1 px-4">
          <Link href="/dashboard/sales-data" className="flex items-center gap-2">
            <span>View All</span>
            <ArrowUpRight className="hidden size-4 sm:block" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div>
          {result?.data
            ?.reverse()
            .slice(0, showRowsNumber)
            .map((invoice: Invoice, index: number) => (
              <div key={index} className="flex flex-col gap-3 pt-3">
                <div className="flex items-center" key={invoice.customerPhone}>
                  <Avatar className="size-9 bg-gray-300 shadow-sm">
                    <AvatarImage
                      src={`/avatars/${getRandomNumber()}.png`}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {invoice.customerName ? invoice.customerName[0] : ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex space-x-1">
                    <div className="flex flex-col items-start justify-between space-y-1">
                      <Link
                        href={`/dashboard/view-invoice/${invoice.id}`}
                        className="truncate text-sm font-medium capitalize leading-none transition duration-300 ease-in-out hover:underline"
                      >
                        {invoice.customerName}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {formatDistance(
                          new Date(invoice.createdAt),
                          new Date(),
                        )}{" "}
                        ago
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto font-medium">
                    + {currencyFormatter.format(invoice.totalAmount)}
                  </div>
                </div>
                {index !== showRowsNumber - 1 && <Separator className="border-gray-500" />}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
