"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { getRandomNumber } from "@/lib/utils";

interface InvoiceData {
  id: number;
  customerName: string;
  paymentMode: string;
  createdAt: Date;
}

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
  }

  const handleFirstPage = () => {
    setCurrentPage(1);
  }

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
      <Table>
        <TableBody>
          {currentRecords.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="flex w-full items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="size-9 bg-gray-300 shadow-sm">
                      <AvatarImage
                        src={`/avatars/${getRandomNumber()}.png`}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {row.customerName ? row.customerName[0] : ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {/* create a Link to /dashboard/view-invoice/{row.id} at invoice number */}
                      <Link href={`/dashboard/view-invoice/${row.id}`}>
                        <p className="text-sm font-semibold ">INV{row.id}</p>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {row.customerName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(row.createdAt)}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="text-center text-sm text-muted-foreground">
            {currentPage} of {totalPages} page(s)
        </div>
    </div>
  );
}

// create a component for the table toolbar

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
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
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
        {/* create button for first page */}
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
