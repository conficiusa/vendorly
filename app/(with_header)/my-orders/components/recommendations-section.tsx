"use client";

import { useRecombeeRecommendations } from "@/lib/swr/useRecombeeRecommendations";
import ProductCard from "@/components/homepage/ProductCard";
import { Button } from "@/components/ui/button";
import { ProductCard as ProductCardType } from "@/lib/types/product.types";
import { Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { RecombeeScenario } from "@/lib/types/recombee-types";

type RecommendationsSectionProps = {
  scenario: RecombeeScenario;
  itemId?: string;
};
export function RecommendationsSection({
  scenario,
  itemId,
}: RecommendationsSectionProps) {
  const {
    recommId,
    recommendations,
    isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    setSize,
    size,
    error,
  } = useRecombeeRecommendations(scenario, itemId);

  // Transform Recombee data to ProductCard format
  const transformedProducts: ProductCardType[] = recommendations.map(
    (item) => ({
      id: item.id,
      name: item.name || "Unknown Product",
      image: item.image || "/placeholder-product.jpg",
      price: typeof item.price === "number" ? item.price : 0,
      category: item.category || "General",
      slug: item.slug || item.id,
      store: item.store || "Unknown Store",
      rating: typeof item.rating === "number" ? item.rating : null,
      description: item.description || "No description available",
    })
  );

  if (error) {
    return (
      <div className="text-center py-8">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          There was an error loading products.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/70 text-white rounded-lg transition-colors"
        >
          Browse Products
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  if (isLoadingInitialData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              More to Like
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover products you might enjoy
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading products...
          </span>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-8 px-4">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No recommendations available
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Check back later for personalized product recommendations.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/70 text-white rounded-lg transition-colors"
        >
          Browse Products
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            More to Like
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover products you might enjoy
          </p>
        </div>

        <Link
          href="/discover"
          className="hidden sm:inline-flex items-center px-4 py-2 text-primary hover:text-primary/70 font-medium transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {transformedProducts.map((product) => (
          <ProductCard key={product.id} product={product} recommId={recommId} />
        ))}
      </div>

      {/* Load More Button */}
      {!isReachingEnd && (
        <div className="text-center pt-6">
          <Button
            onClick={() => setSize(size + 1)}
            disabled={isLoadingMore}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                Load More Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Mobile View All Link */}
      <div className="text-center sm:hidden">
        <Link
          href="/discover"
          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/70 text-white font-medium rounded-lg transition-colors"
        >
          View All Products
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
