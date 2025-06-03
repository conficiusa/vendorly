import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <Skeleton className="h-12 w-64 mx-auto mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl overflow-hidden divide-y divide-rose-100 border border-rose-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6">
                  <div className="flex items-center gap-6">
                    <Skeleton className="w-28 h-28 rounded-lg flex-shrink-0" />
                    <div className="flex-grow">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="w-8 h-6" />
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary Skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-rose-50 rounded-xl p-8 border border-rose-200">
              <Skeleton className="h-8 w-40 mb-8" />
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
                <div className="border-t border-rose-200 pt-4">
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <div className="border-t border-rose-200 pt-6 mt-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-7 w-24" />
                  </div>
                </div>
              </div>
              <Skeleton className="w-full h-12 mt-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
