import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type IconName = keyof typeof Icons;

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  // Cast the icon name to IconName type
  const Icon = Icons[icon as IconName] as LucideIcon;

  return (
    <Card className={cn("overflow-hidden shadow-none", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend && (
              <>
                {trend.isPositive ? (
                  <Icons.TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <Icons.TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  }
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              </>
            )}
            {description && <span className="ml-1">{description}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
