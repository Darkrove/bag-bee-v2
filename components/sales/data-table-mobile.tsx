"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Blend,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  IndianRupee,
  MoreHorizontal,
  ShoppingBasket,
  User,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { currencyFormatter, getRandomNumber } from "@/lib/utils";
import { InvoiceData } from "@/actions/fetch-invoices";
import { Separator } from "@/components/ui/separator";
import { MODES } from "./data";
import { Badge } from "@/components/ui/badge";

export function DataTableMobile({ data }: { data: InvoiceData[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Calculate the indices for slicing the data array
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(data.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 lg:hidden">
      <DataTableToolbar
        recordsPerPage={recordsPerPage}
        handleRecordsPerPageChange={handleRecordsPerPageChange}
        currentPage={currentPage}
        handleFirstPage={handleFirstPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handleLastPage={handleLastPage}
        totalPages={totalPages}
      />
      {currentRecords.map((invoice) => (
        <InvoiceDetail key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
}

const DataTableToolbar = ({
  recordsPerPage,
  handleRecordsPerPageChange,
  currentPage,
  handleFirstPage,
  handlePreviousPage,
  handleNextPage,
  handleLastPage,
  totalPages,
}: {
  recordsPerPage: number;
  handleRecordsPerPageChange: (value: string) => void;
  currentPage: number;
  handleFirstPage: () => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleLastPage: () => void;
  totalPages: number;
}) => {
  return (
    <div className="mb-4 flex items-center justify-center md:justify-between">
      <div className="hidden items-center space-x-2 md:flex">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={recordsPerPage.toString()}
          onValueChange={handleRecordsPerPageChange}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={"10"} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="flex size-8 items-center justify-center rounded-md border border-input">{currentPage}</p>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const PaymentModeIcon = ({ paymentMode }: { paymentMode: string }) => {
  const mode = MODES.find((mode) => mode.value === paymentMode);
  return (
    <>
      {mode && mode.icon && (
        <mode.icon className="size-4 text-secondary-foreground" />
      )}
    </>
  );
};

const InvoiceDetail = ({ invoice }: { invoice: InvoiceData }) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary-foreground">
                <FileText className="size-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">INV{invoice.id}</p>
                <p className="text-xs text-secondary-foreground">
                  Issued:{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(invoice.createdAt)}
                </p>
              </div>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="size-8 rounded-full p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(invoice.id.toString())
                    }
                  >
                    Copy payment ID
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/dashboard/edit/${invoice.id}`}>
                      Edit Invoice
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View customer</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/dashboard/view-invoice/${invoice.id}`}>
                      View Invoice
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <User className="size-4 text-secondary-foreground" />
                <p className="text-sm font-semibold">Customer Name</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {invoice.customerName}
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <PaymentModeIcon paymentMode={invoice.paymentMode} />
                <p className="text-sm font-semibold">Payment Mode</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {
                  MODES.find((mode) => mode.value === invoice.paymentMode)
                    ?.label
                }
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <FileText className="size-4 text-secondary-foreground" />
                <p className="text-sm font-semibold">Total Amount</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {currencyFormatter.format(invoice.totalAmount)}
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <IndianRupee className="size-4 text-secondary-foreground" />
                <p className="text-sm font-semibold">Profit</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {currencyFormatter.format(invoice.totalProfit)}
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <ShoppingBasket className="size-4 text-secondary-foreground" />
                <p className="text-sm font-semibold">Items</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {invoice.items.slice(0, 1).map((item) => item.productCategory)}
                {invoice.items.length > 1 && (
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    & {invoice.totalQuantity - 1} more
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Blend className="size-4 text-secondary-foreground" />
                <p className="text-sm font-semibold">Status</p>
              </div>
              <Badge variant="success" size="sm">
                Paid
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDetail;