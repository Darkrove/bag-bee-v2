"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { createInvoice } from "@/actions/create-invoice";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2, Trash, Plus } from "lucide-react";
import { cn, currencyFormatter } from "@/lib/utils";
import { InvoiceDataRequest } from "@/types/invoice";

const formSchema = z.object({
  customerName: z.string().min(2).max(30),
  contact: z.string().min(10).max(15),
  address: z.string().min(2),
  mode: z.string().nonempty("Please select a payment mode."),
  warranty: z.string().nonempty("Please select a warranty period."),
});

const modes = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
  { label: "Card", value: "card" },
  { label: "Cheque", value: "cheque" },
] as const;

const warranty = [
  { label: "No warranty", value: "0" },
  { label: "6 months", value: "180" },
  { label: "1 year", value: "365" },
  { label: "18 months", value: "545" },
  { label: "2 years", value: "730" },
  { label: "3 years", value: "1095" },
  { label: "5 years", value: "1825" },
  { label: "7 years", value: "2555" },
];

type InvoiceFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<InvoiceFormValues> = {
  customerName: "local",
  contact: "1234567890",
  address: "dombivli - 421201",
};

export function InvoiceForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { items, deleteItem, clearItems } = useStore();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleDelete = (itemCode: string) => {
    try {
      deleteItem(itemCode);
      toast.success("Item deleted", {
        description: `Item with code ${itemCode} has been deleted from the list.`,
      });
    } catch (error) {
      toast.error("An error occurred", {
        description: "Unable to delete item.",
      });
    }
  };

  const calculateTotal = () =>
    items.reduce((total, item) => total + item.amount, 0);
  const calculateProfit = () =>
    items.reduce((total, item) => total + item.profit, 0);
  const calculateQuantity = () =>
    items.reduce((total, item) => total + item.quantity, 0);

  async function onSubmit(data: InvoiceFormValues & { customerName: string, contact: string, address: string, mode: string, warranty: number }) {
    setIsLoading(true);
    try {
      const invoiceData: InvoiceDataRequest = {
        cashierName: session?.user?.name || "Sajjad Shaikh",
        totalAmount: calculateTotal(),
        totalProfit: calculateProfit(),
        totalQuantity: calculateQuantity(),
        items,
        customerName: data.customerName,
        customerPhone: data.contact,
        customerAddress: data.address,
        paymentMode: data.mode,
        warrantyPeriod: data.warranty,
      };
        const response = await createInvoice(invoiceData)
        if (response.status === "success") {
            toast.success("Success", {
                description: "Invoice created successfully.",
                action: {
                label: "View",
                onClick: () => router.push(`/billv2/${response.id}`),
                },
            })
            } else {
            toast.error("An error occurred", {
                description: Array.isArray(response?.message) ? response?.message.map(issue => issue.message).join(", ") : response?.message
            });
        }
    
    } catch (error) {
      toast.error("An error occurred", {
        description: "Unable to process.",
      });
    } finally {
      setIsLoading(false);
      form.reset();
      clearItems();
    }
  }

  return (
    <Form {...form}>
      <div className="mx-auto">
        <h1 className="mb-4 text-xl font-bold">Item List</h1>
        <div className="flex flex-col gap-3 rounded-md bg-muted shadow">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-row justify-between px-3 py-2"
            >
              <div className="flex flex-col">
                <p className="text-md font-bold">
                  {item.productCategory}({item.note})
                </p>
                <p className="text-muted-foreground">
                  {item.quantity} x ₹{item.price}
                </p>
              </div>
              <div className="flex items-center">
                <h3 className="mr-4 font-bold">{currencyFormatter.format(item.amount)}</h3>
                <Button
                  size="icon"
                  variant="destructive"
                  className="ml-auto rounded-full"
                  onClick={() => handleDelete(item.code)}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="flex h-40 flex-col items-center justify-center">
              <p className="text-md font-bold text-muted-foreground">
                No items added
              </p>
              <p className="text-md font-bold text-muted-foreground">
                Add items to create invoice
              </p>
            </div>
          )}
          <div className="flex h-20 flex-row items-center justify-between rounded-b-md bg-primary p-5">
            <p className="text-md font-bold text-white">Total</p>
            <p className="text-xl font-bold text-white">
              {currencyFormatter.format(calculateTotal())}
            </p>
          </div>
        </div>
      </div>
      <h1 className="my-4 text-xl font-bold">Customer Details</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer name</FormLabel>
                <FormControl>
                  <Input placeholder="sajjad shaikh" {...field} />
                </FormControl>
                <FormDescription>
                  This is customer name for billing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact number</FormLabel>
                <FormControl>
                  <Input placeholder="8433624344" {...field} />
                </FormControl>
                <FormDescription>
                  This is contact number for billing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer address</FormLabel>
                <FormControl>
                  <Input placeholder="dombivli" {...field} />
                </FormControl>
                <FormDescription>
                  This is customer address for billing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="leading-[1.50rem]">
                  Payment mode
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? modes.find((mode) => mode.value === field.value)
                              ?.label
                          : "Select mode"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search mode..." />
                      <CommandList>
                        <CommandEmpty>No mode found.</CommandEmpty>
                        <CommandGroup>
                          {modes.map((mode) => (
                            <CommandItem
                              value={mode.value}
                              key={mode.value}
                              onSelect={(value) => form.setValue("mode", value)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  mode.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {mode.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>This is the payment mode.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="warranty"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="leading-[1.50rem]">
                  Warranty period
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? warranty.find(
                              (warranty) => warranty.value === field.value,
                            )?.label
                          : "Select warranty"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search warranty period..." />
                      <CommandList>
                        <CommandEmpty>No warranty period found.</CommandEmpty>
                        <CommandGroup>
                          {warranty.map((warranty) => (
                            <CommandItem
                              value={warranty.value}
                              key={warranty.value}
                              onSelect={(value) =>
                                form.setValue("warranty", value)
                              }
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  warranty.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {warranty.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the warranty that will be used for invoice.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={isLoading || items.length === 0}
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Plus className="mr-2 size-4" />
          )}
          Create Invoice
        </Button>
      </form>
    </Form>
  );
}
