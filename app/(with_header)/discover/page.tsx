"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Layout, Search, Clock, AlertCircle } from "lucide-react";

import { mockServices, categories, serviceCategories } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { ServiceCard } from "@/components/service-card";
import { MarketplaceTabs } from "@/components/tabs";
import { CategoryFilter } from "@/components/category-filter";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { cn } from "@/lib/utils";
import { useInfiniteProducts } from "@/lib/swr/useInfiniteProducts";
import { ProductApiResponse } from "@/lib/swr/useProducts";
import { useInView } from "react-intersection-observer";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";

const tabOptions = ["Products", "Services"];

export default function MarketplacePage() {
  const { ref, inView } = useInView();

  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "products";

  const [activeTab, setActiveTab] = useState(
    tabParam === "services" ? "Services" : "Products"
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridView, setGridView] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const getKey = (
    pageIndex: number,
    previousPageData: ProductApiResponse | null
  ) => {
    if (previousPageData && previousPageData.pagination.hasMore === false) {
      setIsFinished(true);
      return null;
    }
    let query = `/api/products?page=${pageIndex + 1}&limit=12`;
    if (selectedCategory !== "All") {
      query += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    if (searchQuery) {
      query += `&search=${encodeURIComponent(searchQuery)}`;
    }
    return query;
  };

  const {
    setSize,
    isValidating,
    data,
    error,
    isLoading: isLoadingProducts,
  } = useInfiniteProducts(getKey);

  const products = useMemo(
    () => data?.map((response) => response.data).flat() || [],
    [data]
  );

  useEffect(() => {
    if (inView && !isValidating && !isFinished && products.length > 0) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [inView, isValidating, setSize, isFinished, products.length]);

  useEffect(() => {
    setSize(1);
    setIsFinished(false);
  }, [activeTab, selectedCategory, searchQuery, setSize]);

  const filteredServices = useMemo(() => {
    return mockServices.filter((service) => {
      const matchesCategory =
        selectedCategory === "All" || service.category === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCategory("All");
    setSearchQuery("");
    const newTab = tab === "Products" ? "products" : "services";
    router.push(`/discover?tab=${newTab}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const isInitialLoading = isLoadingProducts && products.length === 0 && !data;

  if (isInitialLoading && activeTab === "Products") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-100 dark:from-neutral-950 dark:to-purple-900/30">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 animate-pulse mb-2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 animate-pulse"></div>
          </div>
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full animate-pulse mb-4"></div>
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-full animate-pulse mb-6"></div>
          <ProductsGridSkeleton count={12} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-100 dark:from-neutral-950 dark:to-purple-900/30">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 dark:from-purple-400 dark:via-pink-400 dark:to-orange-300">
            Discover Your Next Favorite
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Explore a universe of unique products and services, curated just for
            you.
          </p>
        </div>

        <div className="space-y-8">
          <MarketplaceTabs
            tabs={tabOptions}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center justify-between">
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onFilterClick={() => {}}
              />

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => setGridView(true)}
                  title="Grid View"
                  className={cn(
                    "p-2.5 rounded-lg transition-all duration-200",
                    gridView
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <Layout className="h-5 w-5" />
                  <span className="sr-only">Grid view</span>
                </button>
                <button
                  onClick={() => setGridView(false)}
                  title="List View"
                  className={cn(
                    "p-2.5 rounded-lg transition-all duration-200",
                    !gridView
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="21" x2="3" y1="6" y2="6" />
                    <line x1="15" x2="3" y1="12" y2="12" />
                    <line x1="17" x2="3" y1="18" y2="18" />
                  </svg>
                  <span className="sr-only">List view</span>
                </button>
              </div>
            </div>

            <CategoryFilter
              categories={
                activeTab === "Products" ? categories : serviceCategories
              }
              selectedCategory={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>

          {activeTab === "Products" && (
            <>
              {error && (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
                  <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400 mb-6" />
                  <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
                    Oops! Something went wrong.
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md">
                    {error.message ||
                      "We couldn't load the products at this moment. Please try again in a bit."}
                  </p>
                </div>
              )}
              {!error && products.length === 0 && !isValidating && (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
                  <Search className="h-16 w-16 text-neutral-400 dark:text-neutral-500 mb-6" />
                  <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
                    No Treasures Found
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md">
                    It seems we couldn't find any products matching your search
                    or filter. Try a different spell!
                  </p>
                </div>
              )}
              {(products.length > 0 || isValidating) && !error && (
                <div
                  className={cn(
                    "grid gap-4 sm:gap-6 mt-6",
                    gridView
                      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1 space-y-4 sm:space-y-6"
                  )}
                >
                  <AnimatePresence>
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isListView={!gridView}
                      />
                    ))}
                  </AnimatePresence>
                  {isValidating && products.length > 0 && !isFinished && (
                    <AnimatePresence>
                      {[...Array(gridView ? 4 : 1)].map((_, i) => (
                        <ProductsGridSkeleton
                          key={`loading-${i}`}
                          count={1}
                          itemClassName="opacity-70"
                        />
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              )}
              <div
                ref={ref}
                className="h-10 mt-10 flex items-center justify-center"
              >
                {isValidating && products.length > 0 && !isFinished && (
                  <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
                    <div className="w-5 h-5 border-2 border-neutral-400 dark:border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Conjuring more items...</span>
                  </div>
                )}
                {isFinished && products.length > 0 && (
                  <div className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                    You've reached the end of the scroll. No more ancient relics
                    to uncover!
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "Services" && (
            <>
              {filteredServices.length === 0 ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
                  <Clock className="h-16 w-16 text-neutral-400 dark:text-neutral-500 mb-6" />
                  <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
                    No Services Available
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md">
                    Try adjusting your search or filter, or check back later for
                    new service offerings.
                  </p>
                </div>
              ) : (
                <div
                  className={cn(
                    "grid gap-4 sm:gap-6 mt-6",
                    gridView
                      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1 space-y-4 sm:space-y-6"
                  )}
                >
                  <AnimatePresence>
                    {filteredServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
