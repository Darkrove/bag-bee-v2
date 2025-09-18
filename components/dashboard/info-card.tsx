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
  trend?: number;
  showCurrencySymbol?: boolean;
  footerTitle?: string;
  footerSubtitle?: string;
}

// InfoCard component definition
export default function InfoCard({
  amount,
  title,
  icon,
  trend,
  showCurrencySymbol = true, // Default to true if not provided
  footerTitle,
  footerSubtitle,
}: InfoCardProps) {
  const isUp = trend !== undefined && trend >= 0;
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {showCurrencySymbol && "₹"}
          <Counter value={amount} />
        </CardTitle>
        {typeof trend === "number" && (
          <CardAction>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerTitle || (isUp ? "Trending up" : "Trending down")}
        </div>
        {footerSubtitle && (
          <div className="text-muted-foreground">{footerSubtitle}</div>
        )}
      </CardFooter>
    </Card>
  );
}
