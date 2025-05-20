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
import { cn, getStatusColor } from "@/lib/utils";
import { useServices } from "@/lib/swr/useServices";

export function ServicesTable() {
  const limit = 20;
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ServicesToDelete, setServicesToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce the search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { error, isLoading, services, pagination, isValidating } = useServices({
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
    setSelectedServices((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    if (!services) return;
    setSelectedServices((prev) =>
      prev.length === services.length ? [] : services.map((p) => p.id)
    );
  };

  const handleDelete = async (ids: string[]) => {
    await deleteProducts(ids);
    setSelectedServices([]);
    setShowDeleteDialog(false);
    setServicesToDelete(null);
  };

  const handleSingleDelete = (productId: string) => {
    setServicesToDelete(productId);
    setShowDeleteDialog(true);
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  const renderContent = () => {
    if (isLoading && !isValidating) {
      return <ProductsTableSkeleton />;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <Icons.AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load services. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!services || services.length === 0) {
      return (
        <Alert>
          <Icons.Info className="h-4 w-4" />
          <AlertTitle>No Products</AlertTitle>
          <AlertDescription>
            {searchQuery
              ? "No services found matching your search."
              : "You haven't added any services yet. Click the 'Add Product' button to get started."}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <div className="rounded-md bg-background p-4 sm:p-6 md:p-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedServices.length === services.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => {
                    if (sortBy === "name") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("name");
                      setSortOrder("asc");
                    }
                  }}
                >
                  Service
                  {sortBy === "name" &&
                    (sortOrder === "asc" ? (
                      <Icons.ChevronUp className="inline ml-1 h-4 w-4" />
                    ) : (
                      <Icons.ChevronDown className="inline ml-1 h-4 w-4" />
                    ))}
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => {
                    if (sortBy === "rate") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("rate");
                      setSortOrder("asc");
                    }
                  }}
                >
                  Rate
                  {sortBy === "rate" &&
                    (sortOrder === "asc" ? (
                      <Icons.ChevronUp className="inline ml-1 h-4 w-4" />
                    ) : (
                      <Icons.ChevronDown className="inline ml-1 h-4 w-4" />
                    ))}
                </TableHead>
                <TableHead>Operating hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => {
                    if (sortBy === "createdAt") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("createdAt");
                      setSortOrder("desc");
                    }
                  }}
                >
                  Date Dated
                  {sortBy === "createdAt" &&
                    (sortOrder === "asc" ? (
                      <Icons.ChevronUp className="inline ml-1 h-4 w-4" />
                    ) : (
                      <Icons.ChevronDown className="inline ml-1 h-4 w-4" />
                    ))}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleProduct(service.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden relative">
                        {service.images[0] ? (
                          <Image
                            src={service.images[0]}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Icons.Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {service.Category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {service.rate.toFixed(2)} per {service.unit}
                  </TableCell>
                  <TableCell>
                    {typeof service.operatingHours === "object" &&
                    service.operatingHours !== null
                      ? `${(service.operatingHours as { openAt?: string; closeAt?: string }).openAt || "N/A"} - ${(service.operatingHours as { openAt?: string; closeAt?: string }).closeAt || "N/A"}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(service.isActive)}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {format(service.createdAt.toLocaleString(), "do MMM, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
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
                          <Icons.Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Icons.Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleSingleDelete(service.id)}
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

        {pagination && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {services.length} of {pagination.total} services
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <Icons.ChevronLeft className="h-4 w-4" />
                Previous
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
              >
                Next
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
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 focus-visible:ring-offset-2 focus-visible:border-none bg-background"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
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

        {selectedServices.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Icons.Archive className="h-4 w-4" />
              Archive
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleBulkDelete}
              disabled={isMutating}
            >
              <Icons.Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {renderContent()}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {ServicesToDelete
                ? "This action cannot be undone. This will permanently delete the service."
                : `This action cannot be undone. This will permanently delete ${selectedServices.length} selected services.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleDelete(
                  ServicesToDelete ? [ServicesToDelete] : selectedServices
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
