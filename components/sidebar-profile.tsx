import { useStore } from "@/lib/swr/fetchStore";
import { Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import React from "react";
import SidebarProfileSkeleton from "./skeletons/sidebar-profile-skeleton";
import { Session } from "@/lib/types/better-auth.types";

const SidebarProfile = ({
  session,
  collapsed,
}: {
  session: Session;
  collapsed: boolean;
}) => {
  const { error, isLoading, store } = useStore();

  if (isLoading) {
    return <SidebarProfileSkeleton />;
  }

  if (error || !store) {
    return (
      <div className="relative">
        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-destructive">
          <div className="h-full w-full flex items-center justify-center bg-destructive/10">
            <span className="text-destructive text-sm">Error</span>
          </div>
        </div>
      </div>
    );
  }

  return collapsed ? (
    <div className="flex justify-center my-4">
      <div className="relative">
        <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary">
          {store?.logo ? (
            <Image
              src={store.logo}
              alt={store.name}
              className="h-full w-full object-contain"
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
        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
          {store?.logo ? (
            <Image
              src={store.logo}
              alt={store.name}
              className="h-full w-full object-contain"
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
          {session?.user.first_name} {session?.user.last_name}
        </h3>
        <p className="text-xs text-muted-foreground">{store.name}</p>
      </div>
    </div>
  );
};

export default SidebarProfile;
