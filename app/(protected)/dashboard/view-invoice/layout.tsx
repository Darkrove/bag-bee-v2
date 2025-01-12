import { Suspense } from "react";
import ViewInvoiceLoading from "./[billid]/loading";

interface ProtectedLayoutProps {
    children: React.ReactNode;
  }
  
  export default async function ViewInvoice({ children }: ProtectedLayoutProps) {
    return (
        <div>
            <Suspense fallback={<ViewInvoiceLoading />}>
                {children}
            </Suspense>
        </div>
    )
  }