import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Carousel } from "@/components/carousel";
import { PasswordResetSlides } from "@/lib/constants/carousel-data";
import Image from "next/image";
import PasswordresetForm from "@/components/passwordreset-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
	return (
		<div className='flex min-h-screen w-full flex-col bg-white md:flex-row'>
			{/* Left side - Form */}
			<div className='flex w-full flex-col items-center justify-center px-4 py-12 md:w-1/2 md:px-8 lg:px-12'>
				<div className='mx-auto w-full max-w-md space-y-6'>
					<div className='space-y-2 text-center'>
						<div className='relative w-[150px] h-[40px] mx-auto'>
							<Image
								alt='logo of vendorly'
								src={"/logo.png"}
								fill
								priority
								className='object-contain'
							/>
						</div>

						<h1 className='text-3xl font-bold tracking-tight text-gray-900'>
							Reset password
						</h1>
						<p className='text-gray-500'>
							Create a new password for your account
						</p>
					</div>
					<Suspense>
						<PasswordresetForm />
					</Suspense>
					<div className='text-center'>
						<Link
							href='/auth/login'
							className='inline-flex items-center text-sm font-medium text-rose-600 hover:text-rose-500'
						>
							<ArrowLeft className='mr-1 h-4 w-4' />
							Back to sign in
						</Link>
					</div>
				</div>
			</div>

			{/* Right side - Decorative Carousel */}
			<div className='hidden w-1/2 bg-gradient-to-br from-rose-400 to-rose-600 md:block'>
				<div className='flex h-full flex-col items-center justify-center px-12 lg:px-16 text-white'>
					<div className='w-full'>
						<Carousel slides={PasswordResetSlides} />
					</div>
				</div>
			</div>
		</div>
	);
}
