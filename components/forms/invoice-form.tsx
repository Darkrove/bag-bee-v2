"use client";

import { CommandInput } from "@/components/ui/command";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { debounce } from "lodash";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Trash,
  Plus,
  Search,
  User,
} from "lucide-react";
import { cn, currencyFormatter } from "@/lib/utils";
import type { InvoiceDataRequest } from "@/types/invoice";
import { MODES } from "@/components/sales/data";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

const formSchema = z.object({
  customerName: z.string().min(2).max(30),
  contact: z.string().min(10).max(15),
  address: z.string().min(2),
  mode: z.string().nonempty("Please select a payment mode."),
  warranty: z.string().nonempty("Please select a warranty period."),
});

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
  customerName: "",
  contact: "",
  address: "",
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

export function InvoiceForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const { items, deleteItem, clearItems } = useStore();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const searchCustomers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCustomers([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/customers?query=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Error searching customers:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleCustomerSelect = (customer: Customer) => {
    form.setValue("customerName", customer.name);
    form.setValue("contact", customer.phone);
    form.setValue("address", customer.address);
    setCustomerSearchOpen(false);
  };

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

  async function onSubmit(
    data: InvoiceFormValues & {
      customerName: string;
      contact: string;
      address: string;
      mode: string;
      warranty: string;
    },
  ) {
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
      const response = await createInvoice(invoiceData);
      if (response.status === "success") {
        toast.success("Success", {
          description: "Invoice created successfully.",
          action: {
            label: "View",
            onClick: () =>
              router.push(`/dashboard/view-invoice/${response.id}`),
          },
        });
      } else {
        toast.error("An error occurred", {
          description: Array.isArray(response?.message)
            ? response?.message.map((issue) => issue.message).join(", ")
            : response?.message,
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

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      searchCustomers(value);
    }, 300),
    [],
  );

  return (
    <Form {...form}>
      <div className="mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Item List</h1>
          <Badge variant="outline" className="text-xs">
            {items.length} {items.length === 1 ? "item" : "items"}
          </Badge>
        </div>
        <Card className="overflow-hidden">
          <ScrollArea className="max-h-[300px]">
            <div className="flex flex-col gap-2 p-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between rounded-md bg-muted/50 p-3 hover:bg-muted/80"
                >
                  <div className="flex flex-col">
                    <p className="font-medium">
                      {item.productCategory}{" "}
                      {item.note && (
                        <span className="text-muted-foreground">
                          ({item.note})
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ₹{item.price}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="mr-4 font-bold">
                      {currencyFormatter.format(item.amount)}
                    </h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(item.code)}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="flex h-40 flex-col items-center justify-center">
                  <p className="text-md font-medium text-muted-foreground">
                    No items added
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add items to create invoice
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex h-16 flex-row items-center justify-between bg-primary p-4">
            <p className="text-md font-bold text-primary-foreground">Total</p>
            <p className="text-xl font-bold text-primary-foreground">
              {currencyFormatter.format(calculateTotal())}
            </p>
          </div>
        </Card>
      </div>

      <div className="my-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Customer Details</h1>
          <Popover
            open={customerSearchOpen}
            onOpenChange={setCustomerSearchOpen}
          >
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Find Customer</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              {/* <div className="p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button size="sm" onClick={() => searchCustomers(searchQuery)} disabled={searchQuery.length < 2}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <p className="mt-2 text-xs text-muted-foreground">Enter at least 2 characters to search</p>
                )}
              </div> */}
              <div className="border-b p-2">
                <Input
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    searchCustomers(value);
                  }}
                />
              </div>
              <Command>
                {/* <CommandInput
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onValueChange={(value) => {
                    setSearchQuery(value);
                    debouncedSearch(value);
                  }}
                /> */}
                <CommandList>
                  {isSearching ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>No customers found</CommandEmpty>
                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            onSelect={() => handleCustomerSelect(customer)}
                            className="flex flex-col items-start"
                          >
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                              <Avatar>
                                <AvatarImage
                                  alt="Picture"
                                  src="/avatar/user1.png"
                                  referrerPolicy="no-referrer"
                                />

                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <span className="sr-only">
                                    {customer.name}
                                  </span>
                                  <Icons.user className="size-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                  {customer.name}
                                </span>
                                <span className="truncate text-xs">
                                  {customer.phone}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter customer name for billing
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
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter contact number for billing
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
                    <Input placeholder="Enter customer address" {...field} />
                  </FormControl>
                  <FormDescription>
                    Customer address for billing
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
                  <FormLabel>Payment mode</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? MODES.find((mode) => mode.value === field.value)
                                ?.label
                            : "Select mode"}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search mode..." />
                        <CommandList>
                          <CommandEmpty>No mode found.</CommandEmpty>
                          <CommandGroup>
                            {MODES.map((mode) => (
                              <CommandItem
                                value={mode.value}
                                key={mode.value}
                                onSelect={(value) =>
                                  form.setValue("mode", value)
                                }
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
                  <FormDescription>
                    Payment mode for this invoice
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Warranty period</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
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
                    <PopoverContent className="w-full p-0" align="start">
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
                    Warranty period for this invoice
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
      </div>
    </Form>
  );
}
