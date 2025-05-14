import * as Icons from "lucide-react";
import { ProductsTable } from "@/components/products-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and variants.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/vendor/dashboard/products/add">
            <Icons.Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <ProductsTable />
      </div>
    </>
  );
}
