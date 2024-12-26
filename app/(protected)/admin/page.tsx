import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import LayoutHeader from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import TransactionsList from "@/components/dashboard/transactions-list";
import DatePicker from "@/components/ui/datepicker";
import { DatePickerProvider } from "@/components/context/datepicker-provider"
import { OverviewContextProvider } from "@/components/context/overview-provider"
import { Data } from "./data";
import TopDataList from "@/components/dashboard/top-data-list";


export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <DatePickerProvider name="transaction">
      <OverviewContextProvider>
        <LayoutHeader
          heading="Admin Panel"
          text="Access only for users with ADMIN role."
          showDatePicker={true}
        />
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Data />
          </div>
          <TransactionsList />
          <TopDataList/>
        </div>
      </OverviewContextProvider>
    </DatePickerProvider>
  );
}
