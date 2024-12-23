"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import DatePicker from "@/components/ui/datepicker";

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="m-auto size-6 text-black dark:text-white"
  >
    <title>Open menu</title>
    <path
      fillRule="evenodd"
      d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export default function LayoutHeader({
  title,
  text,
  showDatePicker = false,
}: {
  title: string;
  text: string;
  showDatePicker?: boolean;
}) {
  return (
    <>
      <div
        className={`flex justify-between  text-gray-950 dark:text-gray-200 ${
          showDatePicker ? "flex-col sm:flex-row" : "flex-row items-center"
        }`}
      >
        <h2
          className={`text-2xl font-extrabold capitalize leading-snug tracking-tight ${
            showDatePicker ? "mb-2 sm:mb-0" : ""
          }`}
        >
          <div className="grid gap-1">
        <h1 className="font-heading text-2xl font-semibold">{title}</h1>
        {text && <p className="text-base text-muted-foreground">{text}</p>}
      </div>
        </h2>
        <div className="items-center justify-between sm:mt-0">
          {showDatePicker ? (
            <div className="date-picker mr-0 flex w-full items-center max-sm:mt-1 sm:mr-4">
              {/* <span className="mr-2 hidden text-xs font-semibold uppercase md:inline-block">Showing:</span> */}
              <DatePicker />
            </div>
          ) : null}
        </div>
      </div>
      <Separator />
    </>
  );
}
