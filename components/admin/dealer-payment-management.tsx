"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, FileText, CreditCard } from "lucide-react";

import {
  fetchDealerDetails,
  createDealerBill,
  createDealerPayment,
  DealerWithHistory,
} from "@/actions/manage-dealer-finances";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function DealerPaymentManagement({ initialDealer }: { initialDealer: DealerWithHistory }) {
  const [dealer, setDealer] = useState(initialDealer);
  const [isLoading, setIsLoading] = useState(false);
  const [isBillSubmitting, setIsBillSubmitting] = useState(false);
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [billForm, setBillForm] = useState({ billNumber: "", amount: "", date: new Date().toISOString().slice(0, 10) });
  const [paymentForm, setPaymentForm] = useState({ amount: "", date: new Date().toISOString().slice(0, 10), paymentMethod: "CASH" as "CASH" | "ONLINE" });

  const totalBilled = dealer.bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = dealer.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = totalBilled - totalPaid;

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

    setIsBillSubmitting(true);
    const result = await createDealerBill(dealer.id, amount, billForm.date, billForm.billNumber);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Bill added successfully.");
      setBillForm({ billNumber: "", amount: "", date: new Date().toISOString().slice(0, 10) });
      setBillDialogOpen(false);
      await refreshDealer();
    }
    setIsBillSubmitting(false);
  }

  async function handleAddPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(paymentForm.amount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }

    setIsPaymentSubmitting(true);
    const result = await createDealerPayment(
      dealer.id,
      amount,
      paymentForm.date,
      paymentForm.paymentMethod
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Payment added successfully.");
      setPaymentForm({ amount: "", date: new Date().toISOString().slice(0, 10), paymentMethod: "CASH" });
      setPaymentDialogOpen(false);
      await refreshDealer();
    }
    setIsPaymentSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground">Dealer</p>
              <h2 className="text-2xl font-semibold">{dealer.label}</h2>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setBillDialogOpen(true)}
                title="Add Bill"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setPaymentDialogOpen(true)}
                title="Record Payment"
              >
                <CreditCard className="h-4 w-4" />
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border">
          <CardHeader>
            <CardTitle>Total Billed</CardTitle>
            <CardDescription>All vendor bills entered for this dealer.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{currencyFormatter.format(totalBilled)}</p>
          </CardContent>
        </Card>
        <Card className="border">
          <CardHeader>
            <CardTitle>Total Paid</CardTitle>
            <CardDescription>Payments recorded to the dealer.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{currencyFormatter.format(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card className="border">
          <CardHeader>
            <CardTitle>Remaining</CardTitle>
            <CardDescription>Amount still due to the dealer.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-emerald-600">{currencyFormatter.format(remainingBalance)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border">
          <CardHeader>
            <div>
              <CardTitle>Bill history</CardTitle>
              <CardDescription>All bills entered for this dealer.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Bill Number</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealer.bills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      No bills have been recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  dealer.bills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                        }).format(new Date(bill.date))}
                      </TableCell>
                      <TableCell>{bill.billNumber || "—"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {currencyFormatter.format(bill.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <div>
              <CardTitle>Payment history</CardTitle>
              <CardDescription>All payments made to this dealer.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealer.payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      No payments have been recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  dealer.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                        }).format(new Date(payment.date))}
                      </TableCell>
                      <TableCell>{payment.paymentMethod.toLowerCase()}</TableCell>
                      <TableCell className="text-right font-medium">
                        {currencyFormatter.format(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={billDialogOpen} onOpenChange={setBillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new vendor bill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBill} className="space-y-4">
            <div>
              <Label htmlFor="billNumber">Bill number</Label>
              <Input
                id="billNumber"
                value={billForm.billNumber}
                onChange={(event) =>
                  setBillForm({ ...billForm, billNumber: event.target.value })
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
            <Button type="submit" disabled={isBillSubmitting} className="w-full">
              {isBillSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording bill...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bill
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
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
                    paymentMethod: value as "CASH" | "ONLINE",
                  })
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue>{paymentForm.paymentMethod}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isPaymentSubmitting} className="w-full">
              {isPaymentSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving payment...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment
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
