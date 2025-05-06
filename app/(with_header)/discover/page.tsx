"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Layout, Search, Clock } from "lucide-react";

import {
	mockProducts,
	mockServices,
	categories,
	serviceCategories,
} from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { ServiceCard } from "@/components/service-card";
import { MarketplaceTabs } from "@/components/tabs";
import { CategoryFilter } from "@/components/category-filter";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

const tabOptions = ["Products", "Services"];

export default function MarketplacePage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab") || "products";

	const [activeTab, setActiveTab] = React.useState(
		tabParam === "services" ? "Services" : "Products"
	);
	const [selectedCategory, setSelectedCategory] = React.useState("All");
	const [searchQuery, setSearchQuery] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [gridView, setGridView] = React.useState(true);

	const filteredProducts = React.useMemo(() => {
		return mockProducts.filter((product) => {
			const matchesCategory =
				selectedCategory === "All" || product.category === selectedCategory;
			const matchesSearch =
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesCategory && matchesSearch;
		});
	}, [selectedCategory, searchQuery]);

	const filteredServices = React.useMemo(() => {
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
		setIsLoading(true);
		setActiveTab(tab);
		setSelectedCategory("All");

		const newTab = tab === "Products" ? "products" : "services";
		router.push(`/discover?tab=${newTab}`);

		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	};

	const handleCategoryChange = (category: string) => {
		setIsLoading(true);
		setSelectedCategory(category);

		setTimeout(() => {
			setIsLoading(false);
		}, 300);
	};

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<div className='min-h-screen bg-background'>
			<main className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
				<div className='mb-6'>
					<h1 className='text-3xl font-bold tracking-tight'>
						Today&apos;s Sale
					</h1>
					<p className='mt-2 text-muted-foreground'>
						Browse and purchase products or book services from campus vendors
					</p>
				</div>

				<div className='space-y-6'>
					<MarketplaceTabs
						tabs={tabOptions}
						activeTab={activeTab}
						onChange={handleTabChange}
					/>

					<div className='flex flex-col space-y-4'>
						<div className='flex space-x-2 items-center justify-between'>
							<SearchFilterBar
								searchQuery={searchQuery}
								onSearchChange={handleSearchChange}
								onFilterClick={() => {}}
							/>

							<div className='hidden sm:flex items-center space-x-2'>
								<button
									onClick={() => setGridView(true)}
									className={cn(
										"p-2 rounded-md transition-colors",
										gridView
											? "bg-secondary text-secondary-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
									)}
								>
									<Layout className='h-5 w-5' />
									<span className='sr-only'>Grid view</span>
								</button>
								<button
									onClick={() => setGridView(false)}
									className={cn(
										"p-2 rounded-md transition-colors",
										!gridView
											? "bg-secondary text-secondary-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
									)}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='20'
										height='20'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<line x1='21' x2='3' y1='6' y2='6' />
										<line x1='15' x2='3' y1='12' y2='12' />
										<line x1='17' x2='3' y1='18' y2='18' />
									</svg>
									<span className='sr-only'>List view</span>
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

					{isLoading ? (
						<div className='flex items-center justify-center min-h-[300px]'>
							<Loader />
						</div>
					) : (
						<>
							{activeTab === "Products" && (
								<>
									{filteredProducts.length === 0 ? (
										<div className='min-h-[300px] flex flex-col items-center justify-center text-center p-8'>
											<Search className='h-12 w-12 text-muted-foreground/50 mb-4' />
											<h3 className='text-xl font-semibold'>
												No products found
											</h3>
											<p className='text-muted-foreground mt-2'>
												Try adjusting your search or filter to find what you&apos;re
												looking for
											</p>
										</div>
									) : (
										<div
											className={cn(
												"grid gap-6 mt-6",
												gridView
													? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
													: "grid-cols-1"
											)}
										>
											<AnimatePresence>
												{filteredProducts.map((product) => (
													<ProductCard
														key={product.id}
														product={product}
														isListView={!gridView}
													/>
												))}
											</AnimatePresence>
										</div>
									)}
								</>
							)}

							{activeTab === "Services" && (
								<>
									{filteredServices.length === 0 ? (
										<div className='min-h-[300px] flex flex-col items-center justify-center text-center p-8'>
											<Clock className='h-12 w-12 text-muted-foreground/50 mb-4' />
											<h3 className='text-xl font-semibold'>
												No services found
											</h3>
											<p className='text-muted-foreground mt-2'>
												Try adjusting your search or filter to find what you&apos;re
												looking for
											</p>
										</div>
									) : (
										<div
											className={cn(
												"grid gap-6 mt-6",
												gridView
													? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
													: "grid-cols-1"
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
						</>
					)}
				</div>
			</main>
		</div>
	);
}
