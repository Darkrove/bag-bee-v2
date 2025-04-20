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
  Phone,
  Pin,
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
import { currencyFormatter, getRandomNumber, truncate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@prisma/client";
import { toast } from "sonner";

export function DataTableMobile({ data }: { data: Customer[] }) {
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
      {currentRecords.map((customer) => (
        <CustomerDetails key={customer.id} customer={customer} />
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
        <p className="flex size-8 items-center justify-center rounded-md border border-input">
          {currentPage}
        </p>
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

const CustomerDetails = ({ customer }: { customer: Customer }) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary-foreground">
                <User className="size-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">{customer.name}</p>
                <p className="text-xs text-secondary-foreground">
                  Created:{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(customer.createdAt)}
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
                    onClick={() => {
                      navigator.clipboard.writeText(customer.id);
                      toast.success("success", {
                        description: "Customer ID copied to clipboard",
                      });
                    }}
                  >
                    Copy customer ID
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/dashboard/edit/${customer.id}`}>
                      Edit Customer
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/dashboard/view-customer-data/${customer.id}`}>
                      View Customer Invoices
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
                <Blend className="size-4 text-secondary-foreground" />
                <p className="text-sm font-semibold">Customer ID</p>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                {truncate(customer.id, 8)}
              </Badge>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <User className="size-4 text-secondary-foreground" />
                <p className="truncate text-sm font-semibold">Customer Name</p>
              </div>
              <p className="text-sm text-muted-foreground">{customer.name}</p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Phone className="size-4 text-secondary-foreground" />
                <p className="text-sm font-semibold">Phone Number</p>
              </div>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Pin className="size-4 text-secondary-foreground" />
                <p className="text-sm font-semibold">Address</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {customer.address}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;
