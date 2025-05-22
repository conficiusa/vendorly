import { Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Session } from "@/lib/types/better-auth.types";

const SidebarProfile = ({
  collapsed,
  session,
}: {
  collapsed: boolean;
session: Session;
}) => {
  return collapsed ? (
    <div className="flex justify-center my-4">
      <div className="relative">
        <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-primary">
          {session.store?.logo ? (
            <Image
              src={session?.store.logo}
              alt={session?.store.name}
              className="object-cover rounded-full"
              fill
            />
          ) : (
            <div className="bg-primary/10 flex w-full h-full items-center justify-center">
              <ShoppingBag size={16} className="text-primary/90" />
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card"></div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center p-4 mb-4">
      <div className="relative">
        <div className="h-16 w-16 relative rounded-full overflow-hidden border-2 border-primary">
          {session?.store?.logo ? (
            <Image
              src={session?.store.logo}
              alt={session?.store.name}
              className="rounded-full object-cover"
              fill
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 ">
              <ShoppingBag className="text-primary/90" />
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      </div>
      <div className="mt-3 text-center">
        <h3 className="font-semibold">
          {session?.user?.first_name} {session?.user?.last_name}
        </h3>
        <p className="text-xs text-muted-foreground">{session?.store?.name}</p>
      </div>
    </div>
  );
};

export default SidebarProfile;
