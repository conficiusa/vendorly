import { Skeleton } from "@/components/ui/skeleton";

const SidebarProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center p-4 mb-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
          <Skeleton className="h-3 w-3 rounded-full" />
        </div>
      </div>
      <div className="mt-3 text-center">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
};

export default SidebarProfileSkeleton;
