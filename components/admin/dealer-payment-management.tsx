"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  FileText,
  CreditCard,
  Pencil,
  Trash2,
  Blend,
  MoreHorizontal
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  fetchDealerDetails,
  createDealerBill,
  createDealerPayment,
  updateDealerBill,
  updateDealerPayment,
  deleteDealerBill,
  deleteDealerPayment,
  DealerWithHistory,
} from "@/actions/manage-dealer-finances";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { currencyFormatter } from "@/lib/utils";

const today = new Date().toISOString().slice(0, 10);

export function DealerPaymentManagement({
  initialDealer,
}: {
  initialDealer: DealerWithHistory;
}) {
  const [dealer, setDealer] = useState(initialDealer);
  const [isLoading, setIsLoading] = useState(false);
  const [isBillSubmitting, setIsBillSubmitting] = useState(false);
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingBillId, setEditingBillId] = useState<number | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [billForm, setBillForm] = useState({
    billNumber: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: "CASH" as "CASH" | "ONLINE" | "GR",
  });

  const totalBilled = dealer.bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = dealer.payments
    .filter((payment) => payment.paymentMethod !== "GR")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalGRAmount = dealer.payments
    .filter((payment) => payment.paymentMethod === "GR")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = totalBilled - totalPaid - totalGRAmount;
  const { isMobile } = useMediaQuery();
  async function refreshDealer() {
    setIsLoading(true);
    const result = await fetchDealerDetails(dealer.id);
    if (result.data) {
      setDealer(result.data);
    } else {
      toast.error(result.error || "Unable to refresh dealer details");
    }
    setIsLoading(false);
  }

  async function handleAddBill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(billForm.amount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid bill amount.");
      return;
    }
    const CleanedFormData = {
      billNumber: billForm.billNumber.trim(),
      date: billForm.date,
    };

    setIsBillSubmitting(true);
    try {
      if (editingBillId !== null) {
        const result = await updateDealerBill(
          editingBillId,
          amount,
          CleanedFormData.date,
          CleanedFormData.billNumber,
        );
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Bill updated successfully.");
          setEditingBillId(null);
          setBillForm({
            billNumber: "",
            amount: "",
            date: new Date().toISOString().slice(0, 10),
          });
          setBillDialogOpen(false);
          await refreshDealer();
        }
      } else {
        const result = await createDealerBill(
          dealer.id,
          amount,
          CleanedFormData.date,
          CleanedFormData.billNumber,
        );
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Bill added successfully.");
          setBillForm({
            billNumber: "",
            amount: "",
            date: new Date().toISOString().slice(0, 10),
          });
          setBillDialogOpen(false);
          await refreshDealer();
        }
      }
    } finally {
      setIsBillSubmitting(false);
    }
  }

  async function handleAddPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(paymentForm.amount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }
    const CleanedFormData = {
      amount: paymentForm.amount.trim(),
      date: paymentForm.date,
      paymentMethod: paymentForm.paymentMethod,
    };

    setIsPaymentSubmitting(true);
    try {
      if (editingPaymentId !== null) {
        const result = await updateDealerPayment(
          editingPaymentId,
          amount,
          CleanedFormData.date,
          CleanedFormData.paymentMethod,
        );
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Payment updated successfully.");
          setEditingPaymentId(null);
          setPaymentForm({
            amount: "",
            date: new Date().toISOString().slice(0, 10),
            paymentMethod: "CASH",
          });
          setPaymentDialogOpen(false);
          await refreshDealer();
        }
      } else {
        const result = await createDealerPayment(
          dealer.id,
          amount,
          CleanedFormData.date,
          CleanedFormData.paymentMethod,
        );
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Payment added successfully.");
          setPaymentForm({
            amount: "",
            date: new Date().toISOString().slice(0, 10),
            paymentMethod: "CASH",
          });
          setPaymentDialogOpen(false);
          await refreshDealer();
        }
      }
    } finally {
      setIsPaymentSubmitting(false);
    }
  }

  function handleEditBill(bill: any) {
    setEditingBillId(bill.id);
    setBillForm({
      billNumber: bill.billNumber || "",
      amount: bill.amount.toString(),
      date: bill.date.split("T")[0],
    });
    setBillDialogOpen(true);
  }

  function handleEditPayment(payment: any) {
    setEditingPaymentId(payment.id);
    setPaymentForm({
      amount: payment.amount.toString(),
      date: payment.date.split("T")[0],
      paymentMethod: payment.paymentMethod,
    });
    setPaymentDialogOpen(true);
  }

  async function handleDeleteBill(billId: number) {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    const result = await deleteDealerBill(billId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Bill deleted successfully.");
      await refreshDealer();
    }
  }

  async function handleDeletePayment(paymentId: number) {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;
    const result = await deleteDealerPayment(paymentId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Payment deleted successfully.");
      await refreshDealer();
    }
  }

  function resetBillForm() {
    setEditingBillId(null);
    setBillForm({
      billNumber: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    });
  }

  function resetPaymentForm() {
    setEditingPaymentId(null);
    setPaymentForm({
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: "CASH",
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Dealer
              </p>
              <h2 className="text-2xl font-semibold">{dealer.label}</h2>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setBillDialogOpen(true)}
                title="Add Bill"
              >
                <FileText className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setPaymentDialogOpen(true)}
                title="Record Payment"
              >
                <CreditCard className="size-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Code</p>
              <p className="font-medium">{dealer.value}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="font-medium">{dealer.contactNumber || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Billed</CardTitle>
            <CardDescription>
              All vendor bills entered for this dealer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {currencyFormatter.format(totalBilled)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Paid</CardTitle>
            <CardDescription>Payments recorded to the dealer.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {currencyFormatter.format(totalPaid)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>GR Amount</CardTitle>
            <CardDescription>Products returned due to defects.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-orange-600">
              {currencyFormatter.format(totalGRAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Remaining</CardTitle>
            <CardDescription>Amount still due to the dealer.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-emerald-600">
              {currencyFormatter.format(remainingBalance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bill history</CardTitle>
            <CardDescription>
              All bills entered for this dealer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {dealer.bills.length === 0 ? (
                <div className="flex items-center justify-center rounded-md border border-muted p-6 text-center text-sm text-muted-foreground">
                  <p>No bills have been recorded yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Bill Number</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dealer.bills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                          }).format(new Date(bill.date))}
                        </TableCell>
                        <TableCell>{bill.billNumber || "—"}</TableCell>
                        <TableCell className="text-right">
                          {isMobile ? (
                            <span className="text-medium ml-1">
                              {(bill.amount / 1000).toFixed(1)}k
                            </span>
                          ) : (
                            <span className="text-medium ml-1">
                              {currencyFormatter.format(bill.amount)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onSelect={() => handleEditBill(bill)}
                              >
                                <Pencil className="mr-2 size-3.5" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleDeleteBill(bill.id)}
                              >
                                <Trash2 className="mr-2 size-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
            <CardDescription>All payments made to this dealer.</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {dealer.payments.length === 0 ? (
                <div className="flex items-center justify-center rounded-md border border-muted p-6 text-center text-sm text-muted-foreground">
                  <p>No payments have been recorded yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dealer.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                          }).format(new Date(payment.date))}
                        </TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          {isMobile ? (
                            <span className="text-medium ml-1">
                              {(payment.amount / 1000).toFixed(1)}k
                            </span>
                          ) : (
                            <span className="text-medium ml-1">
                              {currencyFormatter.format(payment.amount)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onSelect={() => handleEditPayment(payment)}
                              >
                                <Pencil className="mr-2 size-3.5" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleDeletePayment(payment.id)}
                              >
                                <Trash2 className="mr-2 size-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={billDialogOpen}
        onOpenChange={(open) => {
          setBillDialogOpen(open);
          if (!open) resetBillForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBillId ? "Edit Bill" : "Add new vendor bill"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBill} className="space-y-4">
            <div>
              <Label htmlFor="billNumber">Bill number</Label>
              <Input
                id="billNumber"
                value={billForm.billNumber}
                onChange={(event) =>
                  setBillForm({
                    ...billForm,
                    billNumber: event.target.value,
                  })
                }
                placeholder="Optional bill number"
              />
            </div>
            <div>
              <Label htmlFor="billAmount">Amount</Label>
              <Input
                id="billAmount"
                type="number"
                min="0"
                step="1"
                value={billForm.amount}
                onChange={(event) =>
                  setBillForm({ ...billForm, amount: event.target.value })
                }
                placeholder="Amount in rupees"
                required
              />
            </div>
            <div>
              <Label htmlFor="billDate">Bill date</Label>
              <Input
                id="billDate"
                type="date"
                value={billForm.date}
                onChange={(event) =>
                  setBillForm({ ...billForm, date: event.target.value })
                }
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isBillSubmitting}
              className="w-full"
            >
              {isBillSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {editingBillId ? "Updating bill..." : "Recording bill..."}
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  {editingBillId ? "Update Bill" : "Add Bill"}
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={paymentDialogOpen}
        onOpenChange={(open) => {
          setPaymentDialogOpen(open);
          if (!open) resetPaymentForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPaymentId ? "Edit Payment" : "Record payment"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPayment} className="space-y-4">
            <div>
              <Label htmlFor="paymentAmount">Amount</Label>
              <Input
                id="paymentAmount"
                type="number"
                min="0"
                step="1"
                value={paymentForm.amount}
                onChange={(event) =>
                  setPaymentForm({ ...paymentForm, amount: event.target.value })
                }
                placeholder="Amount in rupees"
                required
              />
            </div>
            <div>
              <Label htmlFor="paymentDate">Payment date</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentForm.date}
                onChange={(event) =>
                  setPaymentForm({ ...paymentForm, date: event.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment method</Label>
              <Select
                value={paymentForm.paymentMethod}
                onValueChange={(value) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentMethod: value as "CASH" | "ONLINE" | "GR",
                  })
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue>{paymentForm.paymentMethod}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="GR">GR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isPaymentSubmitting}
              className="w-full"
            >
              {isPaymentSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {editingPaymentId
                    ? "Updating payment..."
                    : "Saving payment..."}
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  {editingPaymentId ? "Update Payment" : "Add Payment"}
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-muted p-6 text-center text-sm text-muted-foreground">
          Refreshing dealer details...
        </div>
      ) : null}
    </div>
  );
}
