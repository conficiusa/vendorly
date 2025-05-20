import { formatDistanceToNow } from "date-fns";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_RECENT_ACTIVITY } from "@/lib/constants/mock";

interface ActivityIconProps {
  type: string;
}

function ActivityIcon({ type }: ActivityIconProps) {
  switch (type) {
    case "order":
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <Icons.ShoppingCart className="h-4 w-4 text-green-600" />
        </div>
      );
    case "review":
      return (
        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <Icons.MessageSquare className="h-4 w-4 text-yellow-600" />
        </div>
      );
    case "inventory":
      return (
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
          <Icons.AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
      );
    case "service":
      return (
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Icons.Wrench className="h-4 w-4 text-blue-600" />
        </div>
      );
    default:
      return (
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Icons.Activity className="h-4 w-4 text-gray-600" />
        </div>
      );
  }
}

export function RecentActivity() {
  return (
    <Card className="shadow-none border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Activity</span>
          <Icons.MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 ">
        <div className="space-y-0">
          {MOCK_RECENT_ACTIVITY.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 p-4 transition-colors hover:bg-muted/50",
                index !== MOCK_RECENT_ACTIVITY.length - 1 && "border-b"
              )}
            >
              <ActivityIcon type={activity.type} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    includeSeconds:true
                  })}
                </p>
              </div>
              {activity.amount && (
                <div className="text-sm font-medium">
                  ${activity.amount.toFixed(2)}
                </div>
              )}
              {activity.rating && (
                <div className="flex items-center">
                  <Icons.Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1">
                    {activity.rating}
                  </span>
                </div>
              )}
              {activity.stock !== undefined && (
                <div className="text-sm font-medium text-red-500">
                  {activity.stock} left
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
