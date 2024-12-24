import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Counter from "@/components/counter";

// Define the props for the InfoCard component
interface InfoCardProps {
  amount: number;
  title: string;
  icon: ReactNode;
  showCurrencySymbol?: boolean; // Optional prop to show/hide currency symbol
}

// InfoCard component definition
export default function InfoCard({
  amount,
  title,
  icon,
  showCurrencySymbol = true, // Default to true if not provided
}: InfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {showCurrencySymbol && "₹"}<Counter value={amount} />
        </div>
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
      </CardContent>
    </Card>
  );
}