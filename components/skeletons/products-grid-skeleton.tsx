import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

const ProductCardSkeleton = ({ className }: ProductCardSkeletonProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse",
        className
      )}
    >
      {/* Image Placeholder - aspect-[4/5] */}
      <div className="aspect-[4/5] w-full bg-neutral-200 dark:bg-neutral-800"></div>
      {/* Content Placeholder */}
      <div className="p-4 sm:p-5">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
        <div className="flex items-end justify-between">
          <div>
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-1.5"></div>
            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
          </div>
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

interface ProductsGridSkeletonProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

export const ProductsGridSkeleton = ({
  count = 8, // Default to 8 skeleton cards
  className,
  itemClassName,
}: ProductsGridSkeletonProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6",
        className
      )}
    >
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} className={itemClassName} />
      ))}
    </div>
  );
};
