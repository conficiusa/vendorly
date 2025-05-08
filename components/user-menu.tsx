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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvater from "./user-avater";
import { authClient } from "@/lib/auth-client";
import { User } from "@/lib/types/better-auth.types";
import { useRouter } from "next/navigation";

export default function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const logout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvater user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" collisionPadding={20}>
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
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
