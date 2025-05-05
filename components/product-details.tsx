import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/lib/types/product.types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

interface ProductDetailsProps {
	product: Product | null;
	isOpen: boolean;
	onClose: () => void;
}

export function ProductDetails({
	product,
	isOpen,
	onClose,
}: ProductDetailsProps) {
	if (!product) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-3xl'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-bold'>
						{product.name}
					</DialogTitle>
				</DialogHeader>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
					<div className='relative aspect-square overflow-hidden rounded-lg'>
						<Image
							src={product.image}
							alt={product.name}
							fill
							className='object-cover w-full h-full hover:scale-105 transition-transform duration-300'
						/>
					</div>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Badge variant='secondary' className='text-lg px-4 py-1'>
								{product.category}
							</Badge>
							<div className='flex items-center gap-1'>
								<Star className='w-5 h-5 fill-yellow-400 stroke-yellow-400' />
								<span className='text-lg font-medium'>{product.rating}</span>
							</div>
						</div>
						<p className='text-3xl font-bold text-primary'>${product.price}</p>
						<p className='text-gray-600'>{product.description}</p>
						<div className='space-y-2'>
							<p className='text-sm text-gray-500'>
								Vendor:{" "}
								<span className='font-medium text-gray-900'>
									{product.vendor}
								</span>
							</p>
							<p className='text-sm text-gray-500'>
								Location:{" "}
								<span className='font-medium text-gray-900'>
									{product.location}
								</span>
							</p>
							<p className='text-sm text-gray-500'>
								Stock:{" "}
								<span className='font-medium text-gray-900'>
									{product.stock} units
								</span>
							</p>
						</div>
						<div className='flex gap-4 pt-4'>
							<Button size='lg' className='flex-1'>
								Add to Cart
							</Button>
							<Button size='lg' variant='outline' className='flex-1'>
								Contact Vendor
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
