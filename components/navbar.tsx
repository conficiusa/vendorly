import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./user-menu";

const Navbar = async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	return (
		<header>
			<nav className='py-3 px-6 flex justify-between items-center'>
				<div className='relative w-[250px] h-[80px]'>
					<Image
						alt='logo of vendorly'
						src={"/logo.png"}
						fill
						priority
						className='object-contain'
					/>
				</div>
				{!session ? (
					<div className='flex gap-8 items-center'>
						<Link href={"/auth/login"}>
							<button className='bg-transparent font-medium hover:scale-105 transition-transform duration-300'>
								Sign In
							</button>
						</Link>
						<Link href={"/auth/sign-up"}>
							<button className='bg-transparent px-3 py-2 sm:px-8 sm:py-4 outline-2 outline-primary text-primary hover:bg-primary duration-300 hover:text-white transition-colors'>
								Sign Up
							</button>
						</Link>
					</div>
				) : (
					<UserMenu user={session.user} />
				)}
			</nav>
		</header>
	);
};

export default Navbar;
