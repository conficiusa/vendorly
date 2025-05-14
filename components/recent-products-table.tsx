import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as Icons from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/constants/mock";
import Image from "next/image";
export function RecentProductsTable() {
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/50">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                <Checkbox id="select-all" aria-label="Select all" />
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Product
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Category
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Price
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Stock
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Sales
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Date Added
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {MOCK_PRODUCTS.map((product) => (
              <tr
                key={product.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle">
                  <Checkbox
                    id={`select-${product.id}`}
                    aria-label={`Select ${product.name}`}
                  />
                </td>
                <td className="p-4 align-middle font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[180px]">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.variants.length} variants
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="bg-secondary/50">
                    {product.category}
                  </Badge>
                </td>
                <td className="p-4 align-middle font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center">
                    {product.stock < 10 ? (
                      <Badge variant="destructive" className="gap-1">
                        <Icons.AlertTriangle className="h-3 w-3" /> Low
                      </Badge>
                    ) : product.stock < 20 ? (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      >
                        {product.stock}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                      >
                        {product.stock}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4 align-middle">{product.sales}</td>
                <td className="p-4 align-middle text-muted-foreground">
                  {formatDistanceToNow(new Date(product.createdAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="p-4 align-middle text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icons.MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Icons.Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Icons.Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Icons.Copy className="mr-2 h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Icons.Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            Next
            <Icons.ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
