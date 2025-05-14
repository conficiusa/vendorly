import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Icons from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/constants/mock";

export function ProductCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {MOCK_PRODUCTS.slice(0, 2).map((product) => (
        <Card key={product.id} className="overflow-hidden group shadow-none">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                {product.category}
              </Badge>
              {product.stock < 10 && (
                <Badge
                  variant="destructive"
                  className="bg-destructive/80 backdrop-blur-sm"
                >
                  Low Stock
                </Badge>
              )}
            </div>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <div className="flex items-center text-sm">
                <Icons.DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-bold">{product.price.toFixed(2)}</span>
              </div>
            </div>
            <CardDescription className="line-clamp-2">
              {product.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <Icons.Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Stock:</span>
                <span className="font-medium">{product.stock}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sold:</span>
                <span className="font-medium">{product.sales}</span>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Variants
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.slice(0, 4).map((variant, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="rounded-sm text-xs bg-secondary/50"
                  >
                    {variant.value}
                  </Badge>
                ))}
                {product.variants.length > 4 && (
                  <Badge
                    variant="outline"
                    className="rounded-sm text-xs bg-secondary/50"
                  >
                    +{product.variants.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Icons.Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <Button size="sm" className="flex-1">
              <Icons.Eye className="h-3.5 w-3.5 mr-1.5" />
              View
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
