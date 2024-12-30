import { notFound, redirect } from "next/navigation";
import { constructMetadata } from "@/lib/utils";
import { getCurrentUser } from "@/lib/session";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata({
  title: "Admin | Famous Bag",
  description: "Admin page for only admin management.",
});

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  // if (!user) redirect("/login");
  // if (user.role !== "ADMIN") notFound();

  if (!user || user.role !== "ADMIN") redirect("/login");

  return <>{children}</>;
}
