import Link from "next/link";
import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { formatDistance } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const records = [
  {
    id: "#001",
    customerName: "Liam Johnson",
    customerPhone: "8433",
    totalAmount: "1400.00",
    createdAt: "2024-12-01T10:00:00Z", // Add createdAt property
  },
  {
    id: "#002",
    customerName: "Olivia Smith",
    customerPhone: "8433",
    totalAmount: "1570.00",
    createdAt: "2024-12-01T10:00:00Z", // Add createdAt property
  },
  {
    id: "#003",
    customerName: "Noah Williams",
    customerPhone: "8433",
    totalAmount: "2000.00",
    createdAt: "2024-12-01T10:00:00Z", // Add createdAt property
  },
];

export default function TransactionsList() {
  function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }
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
          {records
            ?.reverse()
            .slice(0, 5)
            .map(
              (
                record: {
                  id: string;
                  customerName: string;
                  customerPhone: string;
                  totalAmount: string;
                  createdAt: string;
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
                          className="truncate text-sm font-medium leading-none transition duration-300 ease-in-out hover:underline"
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
                      + ₹{record.totalAmount}
                    </div>
                  </div>
                  {index !== records.length - 1 && (
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
