"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useProducts } from "@/lib/swr/useProducts";
import { ProductsTableSkeleton } from "@/components/skeletons/products-table-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useDeleteProducts } from "@/lib/swr/mutations/useDeleteProducts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, formatCurrency } from "@/lib/utils";

export function ProductsTable() {
  const limit = 20;
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce the search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { error, isLoading, products, pagination, isValidating } = useProducts({
    page: currentPage,
    search: debouncedSearch,
    limit,
    sortBy,
    sortOrder,
  });
  const { deleteProducts, isMutating } = useDeleteProducts();

  // Reset to first page when search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    if (!products) return;
    setSelectedProducts((prev) =>
      prev.length === products.length ? [] : products.map((p) => p.id)
    );
  };

  const handleDelete = async (ids: string[]) => {
    await deleteProducts(ids);
    setSelectedProducts([]);
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleSingleDelete = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  console.log(isLoading, isValidating);
  const renderContent = () => {
    if (isLoading) {
      return <ProductsTableSkeleton />;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <Icons.AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load products. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!products || products.length === 0) {
      return (
        <Alert>
          <Icons.Info className="h-4 w-4" />
          <AlertTitle>No Products</AlertTitle>
          <AlertDescription>
            {searchQuery
              ? "No products found matching your search."
              : "You haven't added any products yet. Click the 'Add Product' button to get started."}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <div className="rounded-md bg-background p-4 sm:p-6 md:p-8">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedProducts.length === products.length}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none w-[200px]"
                      onClick={() => {
                        if (sortBy === "name") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("name");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Product
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <Icons.ChevronUp className="inline ml-1 h-4 w-4" />
                        ) : (
                          <Icons.ChevronDown className="inline ml-1 h-4 w-4" />
                        ))}
                    </TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead
                      className="cursor-pointer select-none w-[100px]"
                      onClick={() => {
                        if (sortBy === "price") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("price");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Price
                      {sortBy === "price" &&
                        (sortOrder === "asc" ? (
                          <Icons.ChevronUp className="inline ml-1 h-4 w-4" />
                        ) : (
                          <Icons.ChevronDown className="inline ml-1 h-4 w-4" />
                        ))}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none w-[100px]"
                      onClick={() => {
                        if (sortBy === "stock") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("stock");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Stock
                      {sortOrder === "asc" ? (
                        <Icons.ChevronUp className="inline ml-1 h-4 w-4" />
                      ) : (
                        <Icons.ChevronDown className="inline ml-1 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead
                      className="cursor-pointer select-none w-[120px]"
                      onClick={() => {
                        if (sortBy === "createdAt") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("createdAt");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      Date Added
                      {sortBy === "createdAt" &&
                        (sortOrder === "asc" ? (
                          <Icons.ChevronUp className="inline ml-1 h-4 w-4" />
                        ) : (
                          <Icons.ChevronDown className="inline ml-1 h-4 w-4" />
                        ))}
                    </TableHead>
                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="w-[40px]">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md overflow-hidden relative flex-shrink-0">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Icons.Image className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate text-sm">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[120px]">
                        <Badge variant="secondary" className="text-xs">
                          {product.Category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[100px] text-sm">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className="w-[100px] text-sm">
                        {product.stock}
                      </TableCell>
                      <TableCell className="w-[100px]">
                        <Badge
                          variant={product.stock > 0 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[120px] text-sm">
                        {format(product.createdAt.toLocaleString(), "do MMM, yyyy")}
                      </TableCell>
                      <TableCell className="text-right w-[80px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
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
                              <Icons.Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Icons.Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleSingleDelete(product.id)}
                            >
                              <Icons.Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {products.length} of {pagination.total} products
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex-1 sm:flex-none"
              >
                <Icons.ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <div className="text-sm">
                Page {currentPage} of {pagination.pages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={currentPage === pagination.pages}
                className="flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">Next</span>
                <Icons.ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 focus-visible:ring-offset-2 focus-visible:border-none bg-background w-full"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 flex-1 sm:flex-none"
            >
              <Icons.Archive className="h-4 w-4" />
              <span className="hidden sm:inline">Archive</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 flex-1 sm:flex-none"
              onClick={handleBulkDelete}
              disabled={isMutating}
            >
              <Icons.Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        )}
      </div>

      {renderContent()}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete
                ? "This action cannot be undone. This will permanently delete the product."
                : `This action cannot be undone. This will permanently delete ${selectedProducts.length} selected products.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleDelete(
                  productToDelete ? [productToDelete] : selectedProducts
                )
              }
              className={cn(buttonVariants({ variant: "destructive" }))}
              disabled={isMutating}
            >
              {isMutating ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
