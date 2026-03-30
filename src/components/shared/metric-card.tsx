import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number; 
  trendDescription?: string;
  isCurrency?: boolean;
}

export function MetricCard({ title, value, trend, trendDescription }: MetricCardProps) {
  const isPositive = trend && trend > 0;
  
  return (
    <Card className="shadow-sm border-zinc-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight tabular-nums text-zinc-900">
          {value}
        </div>
        {trend !== undefined && (
          <div className="mt-2 flex items-center text-xs">
            <span className={`flex items-center font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
            <span className="ml-2 text-zinc-500">
              {trendDescription}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
