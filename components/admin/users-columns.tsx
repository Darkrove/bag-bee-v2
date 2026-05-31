"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { User, UserRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "../customers/data-table-column-header";
import { toast } from "sonner";
import { updateUserRoleAdmin } from "@/actions/update-user-role-admin";
import { useState } from "react";

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

export const columns: ColumnDef<UserData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue("name") || "Unknown";
      return (
        <div className="flex items-center space-x-2 font-normal">
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email: string = row.getValue("email") || "-";
      return (
        <div className="flex items-center space-x-2 font-normal">
          <span className="truncate">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role: UserRole = row.getValue("role");
      return (
        <Badge variant={getRoleBadgeVariant(role)}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div>
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0" disabled={isLoading}>
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
      );
    },
  },
];
