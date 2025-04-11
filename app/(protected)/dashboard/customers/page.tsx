import { DashboardHeader } from "@/components/dashboard/header";
import { DataTable } from "@/components/customers/data-table";
import React from "react";
import data from "./data.json";

const page = () => {
  return (
    <>
      <DashboardHeader heading="Customers" text="Check and manage customers." />
      <DataTable data={data} />
    </>
  );
};

export default page;
