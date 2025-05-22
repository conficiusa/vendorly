import Link from "next/link";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import VendorUserDp from "@/components/vendor-user-dp";
import Image from "next/image";
export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-8 border-b bg-background px-6 py-10">
      <div className="md:hidden flex items-center gap-3 flex-1">
        <Button size={"icon"} variant={"outline"}>
          <Icons.Menu />
        </Button>
        <div className=" py-2">
          <div className="relative w-[200px] h-[60px] ">
            <Image src={"/logo.png"} alt="vendorly logo " fill />
          </div>
        </div>
      </div>

      <div className="justify-end w-full flex gap-3">
        <div className="relative max-w-2xl md:w-[300px] hidden md:flex justify-end">
          <Icons.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, orders..."
            className="w-full rounded-full bg-secondary pl-8 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Icons.Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary">
                  <span className="text-[10px]">3</span>
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {Array.from({ length: 3 }).map((_, i) => (
                  <DropdownMenuItem
                    key={i}
                    className="flex flex-col items-start p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icons.ShoppingCart className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          New order received
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Order #ORD-7892 for iPhone 15 Pro
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        2m ago
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center" asChild>
                <Link href="/dashboard/notifications">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        
          <VendorUserDp />
        </div>
      </div>
    </header>
  );
}
