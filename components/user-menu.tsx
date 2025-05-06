"use client";
import {
	LogOut,
	Package2,
	Settings,
	ShoppingCart,
	UserIcon,
} from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvater from "./user-avater";
import { User } from "better-auth";
import { authClient } from "@/lib/auth-client";

export default function UserMenu({ user }: { user: User }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<UserAvater user={user} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<UserIcon />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<ShoppingCart />
						<span>My Cart</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Package2 />
						<span>My Orders</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings />
						<span>Settings</span>
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={async () => authClient.signOut()}>
					<LogOut />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
