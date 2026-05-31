"use client";

import { useState } from "react";
import { User as UserIcon, MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { User, UserRole } from "@prisma/client";

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
import { truncate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateUserRoleAdmin } from "@/actions/update-user-role-admin";

type UserData = Pick<User, "id" | "email" | "name" | "image" | "role" | "createdAt">;

const getRoleBadgeVariant = (role: UserRole): "default" | "secondary" | "destructive" | "outline" => {
  switch (role) {
    case UserRole.ADMIN:
      return "destructive";
    case UserRole.USER:
      return "default";
    default:
      return "secondary";
  }
};

export function UsersTableMobile({ data }: { data: UserData[] }) {
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
      <UsersTableToolbar
        recordsPerPage={recordsPerPage}
        handleRecordsPerPageChange={handleRecordsPerPageChange}
        currentPage={currentPage}
        handleFirstPage={handleFirstPage}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handleLastPage={handleLastPage}
        totalPages={totalPages}
      />
      {currentRecords.map((user) => (
        <UserDetailsCard key={user.id} user={user} />
      ))}
    </div>
  );
}

const UsersTableToolbar = ({
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

const UserDetailsCard = ({ user }: { user: UserData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (newRole: UserRole) => {
    if (user.role === newRole) return;

    setIsLoading(true);
    try {
      const result = await updateUserRoleAdmin(user.id, { role: newRole });

      if (result.status === "success") {
        toast.success("Role updated", {
          description: `User role changed to ${newRole}`,
        });
      } else {
        toast.error("Error", {
          description: result.message || "Failed to update role",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "An error occurred while updating the role",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary-foreground">
                <UserIcon className="size-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.name || "Unknown"}</p>
                <p className="text-xs text-secondary-foreground">
                  Joined:{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(user.createdAt)}
                </p>
              </div>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="size-8 rounded-full p-0" disabled={isLoading}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(user.email || "");
                      toast.success("success", {
                        description: "Email copied to clipboard",
                      });
                    }}
                  >
                    Copy email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Change Role
                  </DropdownMenuLabel>
                  {Object.values(UserRole).map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => handleRoleChange(role as UserRole)}
                      disabled={isLoading || user.role === role}
                    >
                      {role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between space-x-2">
              <p className="text-sm font-semibold">Email</p>
              <p className="text-sm text-muted-foreground truncate">{user.email || "-"}</p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <p className="text-sm font-semibold">Role</p>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
