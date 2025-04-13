import { Suspense } from "react";
import ViewCustomerDataLoading from "./[customerid]/loading";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ViewInvoice({ children }: ProtectedLayoutProps) {
  return (
    <div>
      <Suspense fallback={<ViewCustomerDataLoading />}>{children}</Suspense>
    </div>
  );
}
