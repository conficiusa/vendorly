import Link from "next/link";
import { ArrowRight, Store, ShoppingCart, Clock } from "lucide-react";

export default function Home() {
	return (
		<div className='min-h-screen'>
			<main>
				<section className='py-16 md:py-24'>
					<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='max-w-3xl mx-auto text-center'>
							<h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
								Your Shopping, <span className='text-primary'>Unified</span>
							</h1>
							<p className='mt-6 text-lg text-muted-foreground'>
								Discover products and services from all businesses on campus in
								one place. From food to stationery, haircuts to repairs — all in
								a single platform.
							</p>
							<div className='mt-10'>
								<Link
									href='/discover'
									className='inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-6 py-3 text-md font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm'
								>
									Explore Marketplace
									<ArrowRight className='h-4 w-4' />
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className='py-16 bg-secondary/50'>
					<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
							<div className='bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
								<div className='w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 p-3'>
									<ShoppingCart className='h-10 w-10 text-primary' />
								</div>
								<h3 className='text-xl font-semibold mb-2'>Shop Products</h3>
								<p className='text-muted-foreground mb-4'>
									Browse and purchase products from various campus stores and
									vendors.
								</p>
								<Link
									href='/discover'
									className='text-primary inline-flex items-center gap-1 hover:underline'
								>
									Browse Products <ArrowRight className='h-4 w-4' />
								</Link>
							</div>

							<div className='bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
								<div className='w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 p-3'>
									<Clock className='h-10 w-10 text-primary' />
								</div>
								<h3 className='text-xl font-semibold mb-2'>Book Services</h3>
								<p className='text-muted-foreground mb-4'>
									Find and book services like haircuts, repairs, tutoring and
									more.
								</p>
								<Link
									href='/discover?tab=services'
									className='text-primary inline-flex items-center gap-1 hover:underline'
								>
									Find Services <ArrowRight className='h-4 w-4' />
								</Link>
							</div>

							<div className='bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
								<div className='w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 p-3'>
									<Store className='h-10 w-10 text-primary' />
								</div>
								<h3 className='text-xl font-semibold mb-2'>Discover Vendors</h3>
								<p className='text-muted-foreground mb-4'>
									Explore all the vendors and businesses available on campus.
								</p>
								<Link
									href='#'
									className='text-primary inline-flex items-center gap-1 hover:underline'
								>
									View Vendors <ArrowRight className='h-4 w-4' />
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className='bg-card border-t py-12'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col md:flex-row justify-between items-center'>
						<div className='flex items-center space-x-2 mb-4 md:mb-0'>
							<Store className='h-6 w-6' />
							<span className='text-xl font-bold'>Vendorly</span>
						</div>
						<p className='text-sm text-muted-foreground'>
							© {new Date().getFullYear()} Vendorly. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
