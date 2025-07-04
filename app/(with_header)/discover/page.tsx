"use client";

import Banner from "@/components/homepage/banner";
import ProductCard from "@/components/homepage/ProductCard";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   AlertCircle,
//   Grid3X3,
//   List,
//   ShoppingBag,
//   Zap,
//   TrendingUp,
// } from "lucide-react";
// import { useInView } from "react-intersection-observer";
// import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import { useRecombeeRecommendations } from "@/lib/swr/useRecombeeRecommendations";
import { AlertCircle, ShoppingBag } from "lucide-react";
// import ProductCard from "@/components/homepage/ProductCard";
// import Link from "next/link";

// export default function MarketplacePage() {
//   const { ref, inView } = useInView();
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   const {
//     recommendations,
//     recommId,
//     isLoadingInitialData,
//     isEmpty,
//     isReachingEnd,
//     setSize,
//     isValidating,
//     error,
//   } = useRecombeeRecommendations("discover");

//   useEffect(() => {
//     if (inView && !isValidating && !isReachingEnd && !error) {
//       setSize((prevSize) => prevSize + 1);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [inView, isValidating, isReachingEnd, error]);

//   if (isLoadingInitialData) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="space-y-6">
//             <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
//             <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
//             <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
//             <ProductsGridSkeleton count={12} />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//                 Discover Products
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 mt-1">
//                 Explore our curated collection of amazing products
//               </p>
//             </div>

//             {/* View Toggle */}
//             <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`p-2 rounded-md transition-colors ${
//                   viewMode === "grid"
//                     ? "bg-blue-500 text-white"
//                     : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                 }`}
//               >
//                 <Grid3X3 className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode("list")}
//                 className={`p-2 rounded-md transition-colors ${
//                   viewMode === "list"
//                     ? "bg-blue-500 text-white"
//                     : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                 }`}
//               >
//                 <List className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Promotional Banner */}
//
//         {/* Products Grid */}
//         {error && (
//           <div className="flex flex-col items-center justify-center py-16 text-center">
//             <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full mb-4">
//               <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               Unable to load products
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 max-w-md">
//               There was an error loading products. Please refresh the page or
//               try again later.
//             </p>
//           </div>
//         )}

//         {!error && isEmpty && !isValidating && (
//           <div className="flex flex-col items-center justify-center py-16 text-center">
//             <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-4">
//               <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//               No products available
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 max-w-md">
//               Check back soon for new products and exciting deals.
//             </p>
//           </div>
//         )}

//         {(recommendations.length > 0 || isValidating) && !error && (
//           <div className="space-y-8">
//             {/* Products Count */}
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                 Featured Products
//               </h3>
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 {recommendations.length} products
//               </span>
//             </div>

//             <motion.div
//               layout
//               className={
//                 viewMode === "grid"
//                   ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
//                   : "space-y-4"
//               }
//             >
//               <AnimatePresence mode="popLayout">
//                 {recommendations.map((recommendation, index) => (
//                   <motion.div
//                     key={recommendation.id}
//                     layout
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{
//                       duration: 0.3,
//                       delay: index * 0.02,
//                       layout: { duration: 0.3 },
//                     }}
//                   >
//                     <ProductCard product={recommendation} recommId={recommId} />
//                   </motion.div>
//                 ))}
//               </AnimatePresence>

//               {isValidating && recommendations.length > 0 && !isReachingEnd && (
//                 <AnimatePresence>
//                   {[...Array(4)].map((_, i) => (
//                     <motion.div
//                       key={`loading-${i}`}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                     >
//                       <ProductsGridSkeleton
//                         count={1}
//                         itemClassName="opacity-60"
//                       />
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               )}
//             </motion.div>

//             {/* Load More Trigger */}
//             <div ref={ref} className="flex items-center justify-center py-8">
//               {isValidating && recommendations.length > 0 && !isReachingEnd && (
//                 <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
//                   <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                   <span>Loading more products...</span>
//                 </div>
//               )}

//               {isReachingEnd && recommendations.length > 0 && (
//                 <div className="text-center text-gray-500 dark:text-gray-400">
//                   <span>You've reached the end</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Page = () => {
  const { ref, inView } = useInView();
  const {
    recommendations,
    isLoadingInitialData,
    recommId,
    error,
    isEmpty,
    isValidating,
    isReachingEnd,
    setSize,
  } = useRecombeeRecommendations("discover");

  useEffect(() => {
    if (inView) {
      setSize((prevSize) => prevSize + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  console.log("inView", inView);

  // console.log("isValidating", isValidating);
  console.log("isReachingEnd", isReachingEnd);
  // console.log("error", error);
  // console.log("isEmpty", isEmpty);
  // console.log("recommId", recommId);

  if (isLoadingInitialData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <ProductsGridSkeleton count={12} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Banner />

        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Unable to load products
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              There was an error loading products. Please refresh the page or
              try again later.
            </p>
          </div>
        )}
        {!error && isEmpty && !isValidating && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No products available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Check back soon for new products and exciting deals.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.map((recommendation, index) => (
            <div key={index}>
              <ProductCard product={recommendation} recommId={recommId} />
            </div>
          ))}
        </div>
        <div ref={ref} className="flex items-center justify-center py-8">
          {isValidating && recommendations.length > 0 && !isReachingEnd && (
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading more products...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
