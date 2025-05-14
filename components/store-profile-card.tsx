import * as Icons from "lucide-react";
import { MOCK_STORE } from "@/lib/constants/mock";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
export function StoreProfileCard() {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/80 to-accent/80" />
      <CardHeader className="pt-0 -mt-12">
        <div className="flex items-start gap-4 px-1">
          <div className="h-24 w-24 rounded-lg overflow-hidden border-4 border-card">
            <Image
              src={MOCK_STORE.logo}
              alt={MOCK_STORE.name}
              fill
              className="h-full w-full object-cover"
            />
          </div>
          <div className="pt-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{MOCK_STORE.name}</h3>
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                <Icons.Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">@{MOCK_STORE.slug}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-4">{MOCK_STORE.bio}</p>

        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="flex flex-col items-center justify-center p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center mb-1">
              <Icons.Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-bold">{MOCK_STORE.rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center mb-1">
              <Icons.ShoppingBag className="h-4 w-4 text-primary mr-1" />
              <span className="font-bold">{MOCK_STORE.totalProducts}</span>
            </div>
            <p className="text-xs text-muted-foreground">Products</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center mb-1">
              <Icons.Wrench className="h-4 w-4 text-accent mr-1" />
              <span className="font-bold">{MOCK_STORE.totalServices}</span>
            </div>
            <p className="text-xs text-muted-foreground">Services</p>
          </div>
        </div>

        <div className="mt-4 flex items-center">
          <div className="text-sm mr-2">Quick actions:</div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors">
              <Icons.Edit className="h-4 w-4" />
            </div>
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors">
              <Icons.Settings className="h-4 w-4" />
            </div>
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors">
              <Icons.Store className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
