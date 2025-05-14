"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DivideIcon as LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SIDEBAR_ITEMS } from "@/lib/constants/mock";
import SidebarProfile from "./sidebar-profile";
import { authClient } from "@/lib/auth-client";

type IconName = keyof typeof Icons;

interface SidebarItemProps {
  title: string;
  href: string;
  icon: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem = ({
  title,
  href,
  icon,
  isActive,
  isCollapsed,
}: SidebarItemProps) => {
  // Cast the icon name to IconName type
  const Icon = Icons[icon as IconName] as typeof LucideIcon;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "hover:bg-secondary hover:text-secondary-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-5 w-5",
            isActive ? "text-primary-foreground" : "text-muted-foreground"
          )}
        />
      )}
      {!isCollapsed && <span>{title}</span>}
    </Link>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300 h-screen sticky top-0",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 py-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Icons.ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Vendorly</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Icons.ShoppingBag className="h-4 w-4 text-white" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("h-8 w-8", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? (
            <Icons.ChevronRight className="h-4 w-4" />
          ) : (
            <Icons.ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <SidebarProfile session={session!} collapsed={isCollapsed} />

      <div className={cn("space-y-2 px-2 py-2 flex-1")}>
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            title={item.title}
            href={item.href}
            icon={item.icon}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <div
        className={cn(
          "mt-auto border-t flex items-center p-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <>
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">Vendor</span>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Icons.LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </>
        )}
        {isCollapsed && (
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Icons.LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        )}
      </div>
    </div>
  );
}
