"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Product } from "@/lib/data";

interface ProductCardProps {
	product: Product;
	className?: string;
	isListView?: boolean;
}

export function ProductCard({
	product,
	className,
	isListView = false,
}: ProductCardProps) {
	const defaultVariant = product.variantProducts.find(
		(v) => v.id === product.defaultVariantId
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			whileHover={{ y: -5 }}
			transition={{ duration: 0.2 }}
			className={cn(
				"group relative overflow-hidden rounded-xl border bg-card shadow-sm",
				isListView ? "flex gap-4" : "",
				className
			)}
		>
			<Link
				href={`/marketplace/${product.id}`}
				className={cn(isListView ? "flex flex-row items-start w-full" : "")}
			>
				<div
					className={cn(
						"relative overflow-hidden",
						isListView ? "w-48 h-48" : "aspect-[4/3]"
					)}
				>
					<Image
						src={product.images[0]}
						alt={product.name}
						className='object-cover transition-transform duration-300 group-hover:scale-105'
						fill
						sizes={
							isListView
								? "192px"
								: "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
						}
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
					<div className='absolute bottom-0 left-0 p-4'>
						<p className='rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm'>
							{product.category}
						</p>
					</div>
				</div>

				<div className={cn("flex-1", isListView ? "p-4" : "p-4")}>
					<div className='flex items-start justify-between'>
						<div>
							<h3 className='font-medium text-card-foreground line-clamp-2'>
								{product.name}
							</h3>
							<p className='text-xs text-muted-foreground line-clamp-1'>
								{product.vendor.name}
							</p>
						</div>
						<p className='text-lg font-semibold text-primary'>
							${defaultVariant?.price.toFixed(2)}
							{product.variants && (
								<span className='text-xs text-muted-foreground ml-1'>+</span>
							)}
						</p>
					</div>

					{isListView && (
						<>
							<p className='mt-2 text-sm text-muted-foreground line-clamp-2'>
								{product.description}
							</p>
							{product.variants && (
								<div className='mt-2 flex flex-wrap gap-2'>
									{product.variants.map((variant) => (
										<div
											key={variant.name}
											className='text-xs text-muted-foreground'
										>
											{variant.name}: {variant.options.join(", ")}
										</div>
									))}
								</div>
							)}
						</>
					)}

					<div className='mt-4 flex items-center justify-between'>
						<div className='flex items-center'>
							<div className='flex items-center'>
								<Star className='h-3.5 w-3.5 fill-current text-yellow-500 mr-1' />
								<span className='text-xs font-medium'>{product.rating}</span>
							</div>
							<span className='mx-1.5 text-xs text-muted-foreground'>·</span>
							<span className='text-xs text-muted-foreground'>
								{product.reviewCount} reviews
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<span
								className={cn(
									"text-xs",
									(defaultVariant?.stock || 0) > 10
										? "text-green-600"
										: "text-orange-600"
								)}
							>
								{defaultVariant?.stock} left
							</span>
							<button
								onClick={(e) => {
									e.preventDefault();
									// Add to cart logic here
								}}
								className='rounded-full bg-primary p-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
							>
								<ShoppingCart className='h-4 w-4' />
							</button>
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
