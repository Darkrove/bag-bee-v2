import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import {
  IndianRupee,
  PieChart,
  ChartLine,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Counter from "@/components/counter";
import { Badge } from "../ui/badge";

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
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {showCurrencySymbol && "₹"}<Counter value={amount} />
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUp />
            +12.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month {icon}
        </div>
        <div className="text-muted-foreground">
          Visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
