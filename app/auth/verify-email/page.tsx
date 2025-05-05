import Link from "next/link";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
	return (
		<div className='flex min-h-screen w-full items-center justify-center bg-white px-4 py-12'>
			<div className='mx-auto w-full max-w-md space-y-8 text-center'>
				<div className='space-y-2'>
					<div className='inline-block rounded-lg bg-rose-50 p-3'>
						<Mail className='h-6 w-6 text-rose-500' />
					</div>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900'>
						Check your email
					</h1>
					<p className='text-gray-500'>
						We've sent a verification link to your email address. Please click
						the link to verify your account.
					</p>
				</div>

				<div className='rounded-lg border border-gray-100 bg-gray-50 p-6'>
					<div className='flex items-center justify-center space-x-2'>
						<div className='h-2 w-2 animate-pulse rounded-full bg-rose-400'></div>
						<div className='h-2 w-2 animate-pulse rounded-full bg-rose-500 delay-75'></div>
						<div className='h-2 w-2 animate-pulse rounded-full bg-rose-600 delay-150'></div>
					</div>
					<p className='mt-4 text-sm text-gray-500'>
						Waiting for email verification...
					</p>
				</div>

				<div className='space-y-4'>
					<p className='text-sm text-gray-500'>
						Didn't receive an email? Check your spam folder or request a new
						verification link.
					</p>
					<Button
						variant='outline'
						className='border-rose-200 text-rose-600 hover:bg-rose-50'
					>
						Resend verification email
					</Button>
				</div>

				<div className='pt-4'>
					<Link
						href='/auth/sign-in'
						className='text-sm font-medium text-rose-600 hover:text-rose-500'
					>
						Back to sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
