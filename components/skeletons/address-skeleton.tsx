import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const AddressSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-lg border-2 border-input">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AddressSkeleton;
