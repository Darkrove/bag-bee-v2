"use client";

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

interface Invoice {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TransactionsList({
  showRowsNumber,
}: {
  showRowsNumber: number;
}) {
  const todayStart =  startOfDay(new Date())
  const todayEnd = endOfDay(new Date())
  
  const { data, error, isLoading } = useSWR(
    apiUrls.invoice.getList({
      from: todayStart.toISOString(),
      to: todayEnd.toISOString(),
    }),
    fetcher,
    {
      refreshInterval: 5000, // 🔄 refresh every 5s
    },
  );

  if (isLoading) {
    return (
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Button size="sm" className="ml-auto shrink-0 gap-1 px-4" disabled>
            <span>View All</span>
          </Button>
        </CardHeader>
        <CardContent>
          {Array.from({ length: showRowsNumber }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Error loading transactions 🚨</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const invoices: Invoice[] = data?.data || [];

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
                  // here show separator except for last item based on length if length is smalled that showRowsNumber other wise showrownumber-1
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
