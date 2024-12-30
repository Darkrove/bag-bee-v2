"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Check, ChevronsUpDown, Loader2, Plus, Trash } from "lucide-react";

import { useStore } from "@/store/useStore";
import { cn, calculateProfit } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const products = [
  { label: "Office Bag", value: "officebag" },
  { label: "School Bag", value: "schoolbag" },
  { label: "College Bag", value: "collegebag" },
  { label: "Rain Cover", value: "raincover" },
  { label: "Trekking Bag", value: "trekbag" },
  { label: "Air Bag", value: "airbag" },
  { label: "Laptop Bag", value: "laptopbag" },
  { label: "Trolley Bag", value: "trolleybag" },
  { label: "Duffle Bag", value: "dufflebag" },
  { label: "Gym Bag", value: "gymbag" },
  { label: "Sling Bag", value: "slingbag" },
  { label: "Wallet", value: "wallet" },
  { label: "Belt", value: "belt" },
  { label: "Hand Bag", value: "handbag" },
  { label: "General", value: "general" },
] as const;

const dealers = [
  { label: "Luggage king", value: "idr" },
  { label: "Goodwin", value: "gwd" },
  { label: "Legon bag", value: "lgb" },
  { label: "Fly bag", value: "fly" },
  { label: "Zabco bag", value: "zab" },
  { label: "Market", value: "mar" },
  { label: "Falcon", value: "fal" },
  { label: "Impress", value: "imp" },
  { label: "Peri bag", value: "per" },
  { label: "Dubbly bag", value: "sur" },
  { label: "Fast Fashion", value: "ffb" },
  { label: "Cherry Bag", value: "chb" },
  { label: "Originals Bag", value: "ogb" },
  { label: "Jiore Bag", value: "jib" },
  { label: "FBI", value: "fbi" },
] as const;

const formSchema = z.object({
  product: z.string().refine((value) => value.length > 0, {
    message: "Please select a product to continue.",
    path: ["product"],
  }),
  note: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1 digit."),
  price: z.number().min(1, "Amount must be at least 1 digit."),
  code: z.string().min(2, "Code must be at least 2 characters."),
  dealerCode: z.string().refine((value) => value.length > 0, {
    message: "Please select a dealer code.",
    path: ["dealerCode"],
  }),
});

export type ItemFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<ItemFormValues> = {
  quantity: 1,
};

export function ItemForm() {
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useStore((state) => state.addItem);
  const clearItems = useStore((state) => state.clearItems);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: ItemFormValues) {
    setIsLoading(true);
    try {
      const profit = calculateProfit(data.code, data.price, data.quantity);
      const amount = data.price * data.quantity;
      const note = data?.note?.replace(/\s/g, "").toUpperCase() || null;
      const invoiceData = {
        code: data.code,
        productCategory: data.product,
        quantity: data.quantity,
        price: data.price,
        amount: amount,
        profit: profit,
        note: note,
        dealerCode: data.dealerCode,
      };
      addItem(invoiceData);
      toast.success("Success", {
        description: "Item added successfully.",
      });
    } catch (error) {
      toast.error("An error occurred.", {
        description: "Unable to process.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* product */}
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Product category</FormLabel>
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
                          ? products.find(
                              (product) => product.value === field.value,
                            )?.label
                          : "Select language"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              value={product.value}
                              key={product.value}
                              onSelect={() => {
                                form.setValue("product", product.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  product.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {product.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the product category for billing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* dealer code */}
          <FormField
            control={form.control}
            name="dealerCode"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel className="leading-[1.50rem]">Dealer code</FormLabel>
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
                          ? dealers.find(
                              (dealer) => dealer.value === field.value,
                            )?.label
                          : "Select dealer code"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search code..." />
                      <CommandList>
                        <CommandEmpty>No dealer code found.</CommandEmpty>
                        <CommandGroup>
                          {dealers.map((dealer) => (
                            <CommandItem
                              value={dealer.value}
                              key={dealer.value}
                              onSelect={(value) => {
                                form.setValue("dealerCode", value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  dealer.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {dealer.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the product category for billing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormDescription>
                  This is product quantity for billing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="345"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormDescription>This is price of a product.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="OSB" {...field} />
                </FormControl>
                <FormDescription>
                  This is purchase code of product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* note */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Input placeholder="m102" {...field} />
                </FormControl>
                <FormDescription>
                  This is model number of product if any.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />{" "}
            </>
          ) : (
            <Plus className="mr-2 size-4" />
          )}
          Add To Invoice
        </Button>
      </form>
      <div className="mt-2">
        <Button
          className="w-full"
          variant="destructive"
          onClick={() => {
            form.reset({
              quantity: 1,
              price: 0,
              code: "",
              note: "",
              product: "",
              dealerCode: "",
            })
            clearItems();
          }}
        >
          <Trash className="mr-2 size-4" />
          Clear All Fields
        </Button>
      </div>
    </Form>
  );
}
