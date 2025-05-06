"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowLeft,
	Star,
	Store,
	Clock,
	Shield,
	ChevronLeft,
	ChevronRight,
	Minus,
	Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { mockProducts } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ProductDetailsPage({
	params,
}: {
	params: Promise<any>;
}) {
	const { id } = React.use(params);
	const product = mockProducts.find((p) => p.id === id);
	const [activeImageIndex, setActiveImageIndex] = React.useState(0);
	const [selectedVariants, setSelectedVariants] = React.useState<
		Record<string, string>
	>({});
	const [quantity, setQuantity] = React.useState(1);
	const [isImageTransitioning, setIsImageTransitioning] = React.useState(false);
	const [slideDirection, setSlideDirection] = React.useState<
		"left" | "right" | undefined
	>("left");

	React.useEffect(() => {
		if (product?.variants) {
			const defaultVariants: Record<string, string> = {};
			product.variants.forEach((variant) => {
				defaultVariants[variant.name] = variant.options[0];
			});
			setSelectedVariants(defaultVariants);
		}
	}, [product]);

	const handlers = useSwipeable({
		onSwipedLeft: () => nextImage(),
		onSwipedRight: () => previousImage(),
		preventScrollOnSwipe: true,
		trackMouse: true,
	});

	if (!product) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold mb-2'>Product not found</h1>
					<p className='text-muted-foreground mb-4'>
						The product you&apos;re looking for doesn&apos;t exist.
					</p>
					<Link
						href='/discover'
						className='text-primary hover:text-primary/80 inline-flex items-center'
					>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Go back
					</Link>
				</div>
			</div>
		);
	}

	const nextImage = () => {
		if (!isImageTransitioning) {
			setSlideDirection("left");
			setIsImageTransitioning(true);
			setActiveImageIndex((prev) =>
				prev === product.images.length - 1 ? 0 : prev + 1
			);
			setTimeout(() => setIsImageTransitioning(false), 300);
		}
	};

	const previousImage = () => {
		if (!isImageTransitioning) {
			setSlideDirection("right");
			setIsImageTransitioning(true);
			setActiveImageIndex((prev) =>
				prev === 0 ? product.images.length - 1 : prev - 1
			);
			setTimeout(() => setIsImageTransitioning(false), 300);
		}
	};

	const getCurrentVariant = () => {
		if (!product.variants)
			return product.variantProducts.find(
				(v) => v.id === product.defaultVariantId
			);

		const variantName = product.variants
			.map((v) => selectedVariants[v.name])
			.join(" ");

		return (
			product.variantProducts.find((v) => v.name === variantName) ||
			product.variantProducts.find((v) => v.id === product.defaultVariantId)
		);
	};

	const currentVariant = getCurrentVariant();

	const handleAddToCart = () => {
		if (!currentVariant) return;

		const cartItem = {
			id: product.id,
			variantId: currentVariant.id,
			quantity,
			variants: selectedVariants,
		};

		console.log("Adding to cart:", cartItem);
		// Add to cart logic here
	};

	return (
		<div className='min-h-screen bg-background'>
			<main className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
					<div className='space-y-4'>
						<div
							{...handlers}
							className='relative aspect-square rounded-xl overflow-hidden bg-secondary'
						>
							<AnimatePresence initial={false} mode='wait'>
								<motion.div
									key={activeImageIndex}
									initial={{
										opacity: 0,
										x: slideDirection === "left" ? 300 : -300,
									}}
									animate={{ opacity: 1, x: 0 }}
									exit={{
										opacity: 0,
										x: slideDirection === "left" ? -300 : 300,
									}}
									transition={{ type: "tween", duration: 0.3 }}
									className='absolute inset-0'
								>
									<Image
										src={product.images[activeImageIndex]}
										alt={`${product.name} - Image ${activeImageIndex + 1}`}
										fill
										className='object-cover'
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										priority
									/>
								</motion.div>
							</AnimatePresence>
							<button
								onClick={previousImage}
								className='absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background/90 transition-colors'
								disabled={isImageTransitioning}
							>
								<ChevronLeft className='h-6 w-6' />
							</button>
							<button
								onClick={nextImage}
								className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background/90 transition-colors'
								disabled={isImageTransitioning}
							>
								<ChevronRight className='h-6 w-6' />
							</button>
						</div>

						<div className='grid grid-cols-4 gap-4'>
							{product.images.map((image, index) => (
								<button
									key={index}
									onClick={() =>
										!isImageTransitioning && setActiveImageIndex(index)
									}
									className={cn(
										"relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
										index === activeImageIndex
											? "border-primary ring-2 ring-primary/20"
											: "border-transparent hover:border-primary/50"
									)}
								>
									<Image
										src={image}
										alt={`${product.name} - Thumbnail ${index + 1}`}
										fill
										className='object-cover'
										sizes='(max-width: 768px) 25vw, 120px'
									/>
								</button>
							))}
						</div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className='flex flex-col'
					>
						<div className='mb-6'>
							<div className='inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm mb-4'>
								{product.category}
							</div>
							<h1 className='text-4xl font-bold mb-2'>{product.name}</h1>
							<div className='flex items-center gap-4 text-muted-foreground'>
								<div className='flex items-center'>
									<Star className='h-4 w-4 fill-yellow-500 text-yellow-500 mr-1' />
									<span className='font-medium'>{product.rating}</span>
									<span className='mx-1'>·</span>
									<span>{product.reviewCount} reviews</span>
								</div>
							</div>
						</div>

						<div className='mb-8'>
							<p className='text-3xl font-bold mb-2'>
								${currentVariant?.price.toFixed(2)}
							</p>
							<p
								className={cn(
									"text-sm font-medium mb-4",
									(currentVariant?.stock || 0) > 10
										? "text-green-600"
										: "text-orange-600"
								)}
							>
								{currentVariant?.stock} items left in stock
							</p>

							{product.variants && (
								<div className='space-y-4 mb-6'>
									{product.variants.map((variant) => (
										<div key={variant.name}>
											<label className='block text-sm font-medium mb-2'>
												{variant.name}
											</label>
											<div className='flex flex-wrap gap-2'>
												{variant.options.map((option) => (
													<button
														key={option}
														onClick={() =>
															setSelectedVariants((prev) => ({
																...prev,
																[variant.name]: option,
															}))
														}
														className={cn(
															"px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
															selectedVariants[variant.name] === option
																? "bg-primary text-primary-foreground ring-2 ring-primary/20"
																: "bg-secondary hover:bg-secondary/80"
														)}
													>
														{option}
													</button>
												))}
											</div>
										</div>
									))}
								</div>
							)}

							<div className='flex items-center gap-4 mb-6'>
								<label className='block text-sm font-medium'>Quantity</label>
								<div className='flex items-center border rounded-md'>
									<button
										onClick={() => setQuantity((q) => Math.max(1, q - 1))}
										className='p-2 hover:bg-secondary transition-colors'
										disabled={quantity <= 1}
									>
										<Minus className='h-4 w-4' />
									</button>
									<span className='px-4 py-2 text-center min-w-[3rem]'>
										{quantity}
									</span>
									<button
										onClick={() =>
											setQuantity((q) =>
												Math.min(currentVariant?.stock || 0, q + 1)
											)
										}
										className='p-2 hover:bg-secondary transition-colors'
										disabled={quantity >= (currentVariant?.stock || 0)}
									>
										<Plus className='h-4 w-4' />
									</button>
								</div>
							</div>

							<div className='prose prose-sm text-muted-foreground'>
								<h3 className='text-foreground text-lg font-semibold mb-2'>
									Product Description
								</h3>
								<p className='mb-4'>{product.description}</p>

								{product.faults && product.faults.length > 0 && (
									<>
										<h3 className='text-foreground text-lg font-semibold mb-2'>
											Known Issues
										</h3>
										<ul className='list-disc list-inside text-destructive space-y-1'>
											{product.faults.map((fault, index) => (
												<li key={index}>{fault}</li>
											))}
										</ul>
									</>
								)}
							</div>
						</div>

						<div className='border rounded-lg p-4 mb-8'>
							<div className='flex items-start gap-3'>
								<Store className='h-5 w-5 text-primary mt-1' />
								<div>
									<p className='font-medium'>{product.vendor.name}</p>
									<p className='text-sm text-muted-foreground'>
										Campus Verified Vendor
									</p>
								</div>
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
							<div className='flex items-start gap-3 p-4 rounded-lg bg-secondary/50'>
								<Clock className='h-5 w-5 text-primary mt-1' />
								<div>
									<p className='font-medium'>Fast Delivery</p>
									<p className='text-sm text-muted-foreground'>
										Same-day campus delivery
									</p>
								</div>
							</div>
							<div className='flex items-start gap-3 p-4 rounded-lg bg-secondary/50'>
								<Shield className='h-5 w-5 text-primary mt-1' />
								<div>
									<p className='font-medium'>Secure Payment</p>
									<p className='text-sm text-muted-foreground'>
										Protected transaction
									</p>
								</div>
							</div>
						</div>

						<button
							onClick={handleAddToCart}
							disabled={!currentVariant || currentVariant.stock === 0}
							className='bg-primary text-primary-foreground rounded-full px-8 py-4 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{currentVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
						</button>
					</motion.div>
				</div>
			</main>
		</div>
	);
}
