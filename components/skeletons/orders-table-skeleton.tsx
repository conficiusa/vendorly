import { Skeleton } from "@/components/ui/skeleton";

export function OrdersTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Top controls skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-9 w-[180px]" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md bg-background p-4 md:p-6 lg:p-8">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-7 items-center gap-4 md:gap-6"
            >
              <Skeleton className="h-4 w-[80px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[120px]" />
              </div>
              <Skeleton className="h-4 w-[90px]" />
              <Skeleton className="h-4 w-[70px]" />
              <Skeleton className="h-4 w-[70px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
