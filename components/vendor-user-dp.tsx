"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as Icons from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types/better-auth.types";
import { authClient } from "@/lib/auth-client";

const VendorUserDp = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user as User;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 overflow-hidden focus-visible:ring-0 focus-visible:ring-offset-0 group">
        <Avatar>
          {user?.image && <AvatarImage src={user?.image} />}
          <AvatarFallback>
            {user?.first_name.charAt(0).toUpperCase()}
            {user?.last_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icons.User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icons.Store className="mr-2 h-4 w-4" />
          <span>Store Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icons.CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await authClient.signOut()}>
          <Icons.LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VendorUserDp;
