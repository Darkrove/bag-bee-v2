"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { fetchDealers, createDealer, updateDealer, deleteDealer } from "@/actions/manage-dealers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { currencyFormatter } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Dealer {
  id: string;
  label: string;
  value: string;
  contactNumber?: string;
  updatedAt: string;
  totalBilled: number;
  totalPaid: number;
  remainingBalance: number;
}

export function DealersManagementTable() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteLabel, setPendingDeleteLabel] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ label: "", value: "", contactNumber: "" });

  useEffect(() => {
    loadDealers();
  }, []);

  async function loadDealers() {
    setIsLoading(true);
    const result = await fetchDealers();
    if (result.data) {
      setDealers(result.data as Dealer[]);
    } else {
      toast.error("Failed to load dealers");
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanedFormData = {
      label: formData.label.trim(),
      value: formData.value.trim(),
      contactNumber: formData.contactNumber.trim(),
    };

    try {
      if (editingId) {
        const result = await updateDealer(
          editingId,
          cleanedFormData.label,
          cleanedFormData.value,
          cleanedFormData.contactNumber,
        );
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Dealer updated successfully");
          setEditingId(null);
          await loadDealers();
        }
      } else {
        const result = await createDealer(
          cleanedFormData.label,
          cleanedFormData.value,
          cleanedFormData.contactNumber,
        );
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Dealer created successfully");
          await loadDealers();
        }
      }
      setFormData({ label: "", value: "", contactNumber: "" });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function requestDelete(id: string, label?: string) {
    setPendingDeleteId(id);
    setPendingDeleteLabel(label ?? null);
    setConfirmOpen(true);
  }

  async function performDelete() {
    if (!pendingDeleteId) return;
    setIsSubmitting(true);
    try {
      const result = await deleteDealer(pendingDeleteId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Dealer deleted successfully");
        await loadDealers();
      }
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
      setPendingDeleteId(null);
      setPendingDeleteLabel(null);
    }
  }

  function handleEdit(dealer: Dealer) {
    setEditingId(dealer.id);
    setFormData({ label: dealer.label, value: dealer.value, contactNumber: dealer.contactNumber || "" });
    setOpen(true);
  }

  function handleNewDealer() {
    setEditingId(null);
    setFormData({ label: "", value: "", contactNumber: "" });
    setOpen(true);
  }

  const totalRemainingAcrossDealers = dealers.reduce((sum, dealer) => sum + dealer.remainingBalance, 0);
  const totalPaidAcrossDealers = dealers.reduce((sum, dealer) => sum + dealer.totalPaid, 0);

  if (isLoading) {
    return (
      <Skeleton className="size-full rounded-lg" />
    );
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <DialogTrigger asChild>
            <Button onClick={handleNewDealer}>
              <Plus className="mr-2 h-4 w-4" />
              Add Dealer
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Dealer" : "Add New Dealer"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="label">Dealer Name</Label>
              <Input
                id="label"
                placeholder="e.g., Luggage King"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="value">Dealer Value</Label>
              <Input
                id="value"
                placeholder="e.g., LUGGAGE_KING"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="e.g., +233201234567"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                "Update Dealer"
              ) : (
                "Create Dealer"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {isAdmin ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Paid to Dealers</p>
            <p className="mt-2 text-2xl font-semibold">{currencyFormatter.format(totalPaidAcrossDealers)}</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Remaining Balance</p>
            <p className="mt-2 text-2xl font-semibold">{currencyFormatter.format(totalRemainingAcrossDealers)}</p>
          </div>
        </div>
      ) : null}

      <div className="space-y-4 lg:hidden">
        {dealers.map((dealer) => (
          <Card key={dealer.id} className="w-full">
            <CardContent>
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-sm font-medium">{dealer.label}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/dealers-management/${dealer.id}`}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">Manage</span>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(dealer)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => requestDelete(dealer.id, dealer.label)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Dealer Code</p>
                  <p className="text-sm text-muted-foreground font-mono">{dealer.value}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Paid</p>
                  <p className="text-sm text-muted-foreground">
                    {currencyFormatter.format(dealer.totalPaid)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Remaining</p>
                  <p className={`text-sm font-semibold ${dealer.remainingBalance < 0 ? "text-destructive" : "text-emerald-600"}`}>
                    {currencyFormatter.format(dealer.remainingBalance)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const date = new Date(dealer.updatedAt);
                      return `${new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(date)}`;
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden lg:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dealers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No dealers found. Create your first dealer.
                </TableCell>
              </TableRow>
            ) : (
              dealers.map((dealer) => (
                <TableRow key={dealer.id}>
                  <TableCell>{dealer.label}</TableCell>
                  <TableCell className="font-mono text-sm">{dealer.value}</TableCell>
                  <TableCell className="text-sm">{dealer.contactNumber || "—"}</TableCell>
                  <TableCell className="text-sm">{currencyFormatter.format(dealer.totalPaid)}</TableCell>
                  <TableCell className={`text-sm font-semibold ${dealer.remainingBalance < 0 ? "text-destructive" : "text-emerald-600"}`}>
                    {currencyFormatter.format(dealer.remainingBalance)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {(() => {
                      const date = new Date(dealer.updatedAt);
                      return `${new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(date)} at ${new Intl.DateTimeFormat("en-US", {
                        timeStyle: "short",
                      }).format(date)}`;
                    })()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/dashboard/dealers-management/${dealer.id}`}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">Manage</span>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(dealer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => requestDelete(dealer.id, dealer.label)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete dealer</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete {pendingDeleteLabel ? `"${pendingDeleteLabel}"` : "this dealer"}? This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={performDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
