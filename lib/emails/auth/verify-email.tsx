import * as React from "react";
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
	Tailwind,
	Img,
} from "@react-email/components";

export const VerificationEmail = ({
	url = "https://vendorly.com/verify-email?token=123456789",
	userName = "there",
}) => {
	const currentYear = new Date().getFullYear();

	return (
		<Html>
			<Tailwind>
				<Head>
					<title>Verify Your Email for Vendorly</title>
				</Head>
				<Preview>
					Please verify your email address to complete your Vendorly
					registration
				</Preview>
				<Body className='bg-[#f5f5f5] font-sans py-[40px]'>
					<Container className='max-w-[600px] mx-auto bg-white rounded-[8px] overflow-hidden'>
						<Section className='border-b border-[#e6e6e6] px-[24px] py-4'>
							<Img
								src='https://vendorly-omega.vercel.app/logo.png'
								alt='vendorly logo'
								width={150}
								className='h-auto object-cover'
							/>
						</Section>

						<Section className='px-[24px] pb-2'>
							<Heading className='text-[20px] font-bold text-[#333] mb-[16px]'>
								Verify Your Email Address
							</Heading>

							<Text className='text-[16px] leading-[24px] text-[#333] mb-[16px]'>
								Hi {userName},
							</Text>

							<Text className='text-[16px] leading-[24px] text-[#333] mb-[24px]'>
								Thanks for signing up for Vendorly! To complete your
								registration and access our marketplace, please verify your
								email address by clicking the button below:
							</Text>

							<Button
								href={url}
								className='bg-[#db2777] text-white rounded-[4px] py-[12px] px-[24px] font-medium text-[16px] no-underline text-center block box-border'
							>
								Verify Email Address
							</Button>

							<Text className='text-[16px] leading-[24px] text-[#333] mt-[24px] mb-[8px]'>
								This link will expire in 24 hours. If you don't verify your
								email within this time, you'll need to request a new
								verification link.
							</Text>

							<Text className='text-[16px] leading-[24px] text-[#333] mb-[24px]'>
								Once verified, you'll be able to fully access Vendorly's
								marketplace features, whether you're joining as a vendor or a
								buyer.
							</Text>

							<Text className='text-[16px] leading-[24px] text-[#333]'>
								If you didn't create an account on Vendorly, you can safely
								ignore this email.
							</Text>
						</Section>

						<Section className='bg-[#f9f9f9] px-[24px] py-[32px] text-center'>
							<Text className='text-[14px] leading-[20px] text-[#666] m-0'>
								© {currentYear} Vendorly. All rights reserved.
							</Text>
							<Text className='text-[14px] leading-[20px] text-[#666] mt-[8px] mb-[8px]'>
								The multi-tenant marketplace connecting vendors and buyers
							</Text>
							<Text className='text-[14px] leading-[20px] text-[#666] m-0'>
								123 Market Street, Suite 100, Accra, Ghana
							</Text>
							<Text className='text-[14px] leading-[20px] text-[#666] mt-[16px]'>
								<Link
									href='https://vendorly.com/unsubscribe'
									className='text-[#666] underline'
								>
									Unsubscribe
								</Link>
								{" • "}
								<Link
									href='https://vendorly.com/privacy'
									className='text-[#666] underline'
								>
									Privacy Policy
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

VerificationEmail.PreviewProps = {
	url: "https://vendorly.com/verify-email?token=123456789",
	userName: "there",
};
