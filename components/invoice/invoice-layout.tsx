"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { addDays, format } from "date-fns";
import ReactToPrint from "react-to-print";
import {
  Download,
  Loader2,
  Pencil,
  Printer,
  QrCode,
  Share,
  Trash,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { RoundButton, buttonVariants } from "@/components/ui/round-button";
import { Icons } from "@/components/shared/icons";
import { InvoiceItem } from "@prisma/client";
import { Status } from "@/components/invoice/status";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "../ui/button";
import InvoiceTemplate from "@/template/invoice-template";
import { currencyFormatter } from "@/lib/utils";

export interface Props {
  invoice: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    cashierName: string;
    totalAmount: number;
    totalProfit: number;
    totalQuantity: number;
    paymentMode: string;
    warrantyPeriod: string;
  };
  invoiceItem: InvoiceItem[];
}

const InvoiceLayout = ({ invoice, invoiceItem }: Props) => {
  const componentRef = useRef(null);
  const data = {
    me: {
      name: "Famous Bag House",
      address: (
        <span>
          Shop No. 5,
          <br /> Ekta Appartment,
          <br /> Nehru Road,
          <br /> Opp. Ration Office,
          <br /> Dombivli East-421201
        </span>
      ),
      city: "Dombivli East, Mumbai - 421201",
      mail: "samaralishaikh212@gmail.com",
      contact: "+91 9867081170",
    },
    customer: {
      name: "Sara James",
      address: (
        <span>
          280 Suzanne Throughway,
          <br />
          Breannabury, OR 45801,
          <br />
          United States
          <br />
        </span>
      ),
      subtotal: 0,
      taxes: 0,
      total: 0,
      amountpaid: 0,
    },
    encodedMessage: encodeURIComponent(
      `Dear Sir/Madam
Thanks for shopping at *Famous Bag*. As part of our green initiative, your digital bill awaits.

Happy Shopping ♻`,
    ),
    encodedFileURL: encodeURIComponent(
      "https://www.isro.gov.in/media_isro/pdf/Missions/LVM3/LVM3M4_Chandrayaan3_brochure.pdf",
    ),
  };

  return (
    <div>
      <div className="flex-col space-y-5">
        <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex flex-col space-y-4 sm:w-11/12 lg:w-3/4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Link
                    href={`https://api.whatsapp.com/send?phone=+91${invoice.customerPhone}&text=${data.encodedMessage}`}
                    className={buttonVariants({ variant: "secondary" })}
                    target="_blank"
                  >
                    <span className="sr-only">Share</span>
                    <Share className="size-4" />
                  </Link>
                  <ReactToPrint
                    bodyClass="invoice"
                    trigger={() => (
                      <RoundButton variant="secondary">
                        <span className="sr-only">Print</span>
                        <Printer className="size-4" />
                      </RoundButton>
                    )}
                    content={() => componentRef.current}
                  />
                  <PDFDownloadLink
                    document={
                      <InvoiceTemplate
                        invoice={invoice}
                        invoiceItem={invoiceItem}
                        totalSales={invoice.totalAmount}
                        me={{
                          name: "",
                          address: undefined,
                          city: "",
                          mail: "",
                          contact: "",
                        }}
                      />
                    }
                    fileName={`invoice-${invoice.id}.pdf`}
                  >
                    <div>
                      <RoundButton variant="secondary">
                        <span className="sr-only">Download</span>
                        <Download className="size-4" />
                      </RoundButton>
                    </div>
                  </PDFDownloadLink>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/edit/${invoice.id}`}
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    <span className="sr-only">Edit</span>
                    <Pencil className="size-4" />
                  </Link>
                  <RoundButton variant="destructive">
                    <span className="sr-only">Delete</span>
                    <Trash className="size-4" />
                  </RoundButton>
                </div>
              </div>
            </div>
            <div className="w-full rounded-lg bg-secondary p-10 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex w-full items-center justify-between space-x-2 md:w-auto md:justify-start">
                  <h1 className="text-secondary-foreground">Mode</h1>
                  <Status type={invoice?.paymentMode} />
                </div>
                <div className="hidden space-x-2 md:block">
                  {/* <div className="text-2xl font-bold">Date</div> */}
                  <div className="text-secondary-foreground">
                    {format(invoice?.createdAt, "PPP")}
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={componentRef}
              className="invoice flex min-h-full w-full flex-col justify-between rounded-none border-t-[12px] border-primary bg-secondary p-4 sm:p-10"
            >
              <div>
                <div className="flex justify-between">
                  <div>
                    <Icons.logo className="size-10"></Icons.logo>
                    <h1 className="mt-2 text-xl font-semibold text-primary dark:text-white md:text-xl">
                      {data.me.name}
                    </h1>
                    <div className="mt-2">
                      <p className="block text-sm font-medium text-secondary-foreground">
                        {data.me.contact}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <h2 className="text-2xl font-semibold text-secondary-foreground md:text-3xl">
                      Invoice
                    </h2>
                    <span className="mt-1 block text-secondary-foreground/50">
                      #{invoice.id}
                    </span>

                    <address className="mt-4 not-italic text-secondary-foreground">
                      {data.me.address}
                    </address>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-foreground">
                      Bill to
                    </h3>
                    <h3 className="font-semibold text-secondary-foreground/50">
                      {invoice.customerName}
                    </h3>
                    <address className="not-italic text-secondary-foreground/50">
                      <p>{invoice.customerPhone}</p>
                      <p>{invoice.customerAddress}</p>
                    </address>
                  </div>

                  <div className="space-y-2 sm:text-right">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
                      <dl className="grid gap-x-3 sm:grid-cols-5">
                        <dt className="col-span-3 font-semibold text-secondary-foreground">
                          Invoice date
                        </dt>
                        <dd className="col-span-2 text-secondary-foreground/50">
                          {format(invoice.createdAt, "dd/MM/yyyy")}
                        </dd>
                      </dl>
                      <dl className="grid gap-x-3 text-right sm:grid-cols-5">
                        <dt className="col-span-3 font-semibold text-secondary-foreground">
                          Warranty upto
                        </dt>
                        {parseInt(invoice.warrantyPeriod) > 0 ? (
                          <dd className="col-span-3 text-secondary-foreground/50 sm:col-span-2">
                            {format(
                              addDays(
                                invoice.createdAt,
                                parseInt(invoice.warrantyPeriod),
                              ),
                              "dd/MM/yyyy",
                            )}
                          </dd>
                        ) : (
                          <dd className="col-span-3 text-secondary-foreground/50 sm:col-span-2">
                            No warranty
                          </dd>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="space-y-4 rounded-lg border border-secondary-foreground p-4">
                    <div className="hidden sm:grid sm:grid-cols-6">
                      <div className="text-xs font-medium uppercase text-secondary-foreground/50 sm:col-span-2">
                        Item
                      </div>
                      <div className="text-xs font-medium uppercase text-secondary-foreground/50">
                        Code
                      </div>
                      <div className="text-left text-xs font-medium uppercase text-secondary-foreground/50">
                        Rate
                      </div>
                      <div className="text-left text-xs font-medium uppercase text-secondary-foreground/50">
                        Qty
                      </div>
                      <div className="text-right text-xs font-medium uppercase text-secondary-foreground/50">
                        Total
                      </div>
                    </div>

                    <div className="hidden border-b border-secondary-foreground sm:block"></div>
                    {invoiceItem.map((item: InvoiceItem, index: number) => (
                      <>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                          <div className="col-span-2">
                            <h5 className="text-xs font-medium uppercase text-secondary-foreground/50 sm:hidden">
                              Item
                            </h5>
                            <p className="font-medium text-secondary-foreground">
                              {item.productCategory}
                              {item.note ? (
                                <span className="uppercase text-secondary-foreground/50">
                                  {" "}
                                  ({item.note})
                                </span>
                              ) : null}
                            </p>
                          </div>
                          <div className="text-right sm:text-left">
                            <h5 className="text-xs font-medium uppercase text-secondary-foreground/50 sm:hidden">
                              Code
                            </h5>
                            <p className="text-secondary-foreground">
                              {item.code}
                            </p>
                          </div>
                          <div>
                            <h5 className="text-xs font-medium uppercase text-secondary-foreground/50 sm:hidden">
                              Rate
                            </h5>
                            <p className="text-secondary-foreground">
                              {currencyFormatter.format(item.price)}
                            </p>
                          </div>
                          <div>
                            <h5 className="text-xs font-medium uppercase text-secondary-foreground/50 sm:hidden">
                              Qty
                            </h5>
                            <p className="text-secondary-foreground">
                              {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <h5 className="text-xs font-medium uppercase text-secondary-foreground/50 sm:hidden">
                              Total
                            </h5>
                            <p className="text-secondary-foreground sm:text-right">
                              {currencyFormatter.format(item.amount)}
                            </p>
                          </div>
                        </div>
                        {index !== invoiceItem.length - 1 && (
                          <Separator className="border-gray-500" />
                        )}
                      </>
                    ))}
                  </div>
                </div>
                {/* <!-- End Table --> */}

                {/* <!-- Flex --> */}
                <div className="mt-8 flex sm:justify-end">
                  <div className="w-full max-w-2xl space-y-2 sm:text-right">
                    {/* <!-- Grid --> */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-2">
                      <dl className="grid gap-x-3 sm:grid-cols-5">
                        <dt className="col-span-3 font-semibold text-secondary-foreground">
                          Subtotal
                        </dt>
                        <dd className="col-span-2 text-secondary-foreground/50">
                          {currencyFormatter.format(invoice.totalAmount)}
                        </dd>
                      </dl>

                      <dl className="grid gap-x-3 text-right sm:grid-cols-5">
                        <dt className="col-span-3 font-semibold text-secondary-foreground">
                          GST
                        </dt>
                        <dd className="col-span-3 text-secondary-foreground/50 sm:col-span-2">
                          {currencyFormatter.format(data.customer.taxes)}
                        </dd>
                      </dl>

                      <dl className="grid gap-x-3 sm:grid-cols-5">
                        <dt className="col-span-3 font-semibold text-secondary-foreground">
                          Total
                        </dt>
                        <dd className="col-span-2 text-secondary-foreground/50">
                          {currencyFormatter.format(invoice.totalAmount)}
                        </dd>
                      </dl>

                      <dl className="grid gap-x-3 text-right sm:grid-cols-5">
                        <dt className="col-span-3 font-semibold text-secondary-foreground">
                          Amount paid
                        </dt>
                        <dd className="col-span-3 text-secondary-foreground/50 sm:col-span-2">
                        {currencyFormatter.format(invoice.totalAmount)}
                        </dd>
                      </dl>

                      <dl className="grid gap-x-3 sm:grid-cols-5">
                        <dt className="col-span-3 font-semibold text-secondary-foreground">
                          Amount due
                        </dt>
                        <dd className="col-span-2 text-secondary-foreground/50">₹0.00</dd>
                      </dl>
                    </div>
                    {/* <!-- End Grid --> */}
                  </div>
                </div>
                {/* <!-- End Flex --> */}
              </div>
              <div className="justify-end">
                <div className="mt-8 sm:mt-12">
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-8 flex w-full flex-col items-center justify-between sm:flex-row">
                    <h4 className="text-base font-semibold text-secondary-foreground">
                      Thank you!
                    </h4>
                    <p className="text-base text-secondary-foreground">
                      © 2024 {data.me.name}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- End Card --> */}
            <div className="w-full rounded-lg bg-secondary p-6 shadow-md">
              <div className="flex w-full flex-col items-center justify-center text-center text-secondary-foreground">
                <p className="text-xs">* No return / Exchange / Refund.</p>
                <p className="text-xs">
                  * Warranty covers only stitching and fitting.
                </p>
                <p className="text-xs">
                  * Any damage, malfunction, or defect in the accessories (such
                  as zippers, straps, buckles, trolley, wheels,etc.). is not
                  covered under our product warranty.
                </p>
                <p className="text-xs">
                  * This is computer generated invoice and hence does not
                  require any signature.
                </p>
                {/* <RenderQRCode props={{
                        key: id,
                        url: `https://yourbill.vercel.app/${id}`,
                      }}/>
                      <p>-Z31410041014924</p> */}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- End Invoice --> */}
      </div>
    </div>
  );
};

export default InvoiceLayout;
