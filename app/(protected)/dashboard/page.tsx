import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import TransactionsList from "@/components/dashboard/transactions-list";
import Data from "./data";

export const metadata = constructMetadata({
  title: "Dashboard | Famous Bag",
  description: "Dahboard for analytics and data visualization.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role : ${user?.role}.`}
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Data />
        </div>
        <TransactionsList showRowsNumber={10} />
      </div>
    </>
  );
}
