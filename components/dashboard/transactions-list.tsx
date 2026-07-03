import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDistance, startOfDay, endOfDay, format } from "date-fns";
import useSWR from "swr";

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
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter, getRandomNumber } from "@/lib/utils";
import { apiUrls } from "@/lib/api-urls"; // ✅ assuming you have invoice API urls
import { fetchInvoices } from "@/actions/fetch-invoices";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default async function TransactionsList({
  showRowsNumber,
}: {
  showRowsNumber: number;
}) {
  const todayStart = format(startOfDay(new Date()), dateFormat);
  const todayEnd = format(endOfDay(new Date()), dateFormat);
  const result = await fetchInvoices(todayStart, todayEnd);

  const invoices = result?.data || [];

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent transactions from your store.
          </CardDescription>
        </div>
        <Button size="sm" className="ml-auto shrink-0 gap-1 px-4">
          <Link
            href="/dashboard/sales-data"
            className="flex items-center gap-2"
          >
            <span>View All</span>
            <ArrowUpRight className="hidden size-4 sm:block" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-bold text-primary">
              No Transactions for Today 📭
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Check back later — your sales will show up here.
            </p>
          </div>
        ) : (
          <div>
            {invoices
              ?.slice(-showRowsNumber) // get last N
              .reverse() // reverse to show latest first
              .map((invoice, index) => (
                <div key={invoice.id} className="flex flex-col gap-3 pt-3">
                  <div className="flex items-center">
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
                          {invoice.customerName || "Unknown"}
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
                  {index !== Math.min(invoices.length, showRowsNumber) - 1 && (
                    <Separator className="border-gray-500" />
                  )}
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
