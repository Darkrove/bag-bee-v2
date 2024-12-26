import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { endOfYear, format, formatDistance, startOfYear } from "date-fns"

import { dateFormat } from "@/constants/date"
import { apiUrls } from "@/lib/api-urls"
import { Badge } from "@/components/ui/badge";
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
import { currencyFormatter } from "@/lib/utils";

export default async function TransactionsList() {
  function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  const from = format(startOfYear(new Date()), dateFormat)
  const to = format(endOfYear(new Date()), dateFormat)
  const result = await fetch(
    process.env.NEXTAUTH_URL + apiUrls.invoice.getInvoice({ from, to }),
    {
      cache: "no-store",
    }
  ).then((res) => res.json())

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
          <Link href="#" className="flex items-center gap-2">
            <span>View All</span>
            <ArrowUpRight className="hidden size-4 sm:block" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div>
          {result?.data
            ?.reverse()
            .slice(0, 5)
            .map(
              (
                record: {
                  id: string
                  productCategory: string
                  customerName: string
                  customerPhone: string
                  createdAt: Date
                  totalAmount: string
                },
                index: number,
              ) => (
                <div className="flex flex-col gap-3 pt-3">
                  <div className="flex items-center" key={record.customerPhone}>
                    <Avatar className="size-9 bg-gray-300 shadow-sm">
                      <AvatarImage
                        src={`/avatars/${getRandomNumber()}.png`}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {record.customerName ? record.customerName[0] : ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex space-x-1">
                      <div className="flex flex-col items-start justify-between space-y-1">
                        <Link
                          href={`/billv2/${record.id}`}
                          className="truncate text-sm font-medium capitalize leading-none transition duration-300 ease-in-out hover:underline"
                          target="_blank"
                        >
                          {record.customerName}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatDistance(
                            new Date(record.createdAt),
                            new Date(),
                          )}{" "}
                          ago
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto font-medium">
                      + {currencyFormatter.format(parseInt(record.totalAmount))}
                    </div>
                  </div>
                  {index !== 5 - 1 && (
                    <Separator className="border-gray-500" />
                  )}
                </div>
              ),
            )}
        </div>
      </CardContent>
    </Card>
  );
}
