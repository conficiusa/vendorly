import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import ForgotpasswordForm from "@/components/forgotpassword-form";

export default function ForgotPasswordPage() {
	return (
		<div className='flex min-h-screen w-full items-center justify-center px-4 py-12'>
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
					<h1 className='text-3xl font-bold tracking-tight'>Forgot password</h1>
					<p className='text-muted-foreground'>
						Enter your email to reset your password
					</p>
				</div>
				<ForgotpasswordForm />
				<div className='text-center'>
					<Link
						href='/auth/login'
						className='inline-flex items-center text-sm font-medium text-primary hover:text-rose-600'
					>
						<ArrowLeft className='mr-1 h-4 w-4' />
						Back to sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
