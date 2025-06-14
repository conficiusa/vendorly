"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateProductFormData } from "@/lib/schemas/products/create";
import { TextInput } from "@/components/text-input";
import { EnhancedPriceInput } from "@/components/enhanced-price-input";
import { CategoryTreeSelect } from "@/components/category-tree-select";
import { TextAreaInput } from "@/components/textarea-input";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductBasicInfoProps {
  form: UseFormReturn<CreateProductFormData>;
  error: any;
}

interface CategoryTreeNode {
  id: string;
  name: string;
  children?: CategoryTreeNode[];
}

export function ProductBasicInfo({ form, error }: ProductBasicInfoProps) {
  const { control, watch } = form;
  const hasVariants = watch("hasVariants");

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: categoryTree, isLoading } = useSWR<CategoryTreeNode[]>(
    "/api/vendors/category?type=PRODUCT&nested=true",
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            control={control}
            name="name"
            type="text"
            label="Product Name"
            placeholder="Enter product name"
            error={error.name?.message}
          />

          <CategoryTreeSelect
            label="Category"
            name="category"
            control={control}
            categories={categoryTree}
            isLoading={isLoading}
            error={error.category?.message}
          />
        </div>
        <div className="grid gap-2">
          <EnhancedPriceInput
            control={control}
            name="price"
            label="Price"
            error={error.price?.message}
          />
        </div>
        {!hasVariants && (
          <div className="grid gap-2">
            <TextInput
              control={control}
              name="stock"
              type="number"
              label="Stock"
              placeholder="Number of product in stock"
              error={error.stock?.message}
            />
            <p className="text-sm text-muted-foreground">
              How many of the products are in stock?
            </p>
          </div>
        )}

        <div className="space-y-2">
          <TextAreaInput
            rows={5}
            control={control}
            name="description"
            label="Description"
            placeholder="Enter product description"
            error={error.description?.message}
          />
        </div>
        <div className="space-y-2">
          <TextAreaInput
            control={control}
            name="faults"
            label="Known Faults"
            placeholder="Enter product known faults"
            error={error.faults?.message}
            rows={5}
            className="resize-none"
          />
          <p className="text-sm text-muted-foreground">
            This is used to help customers understand the product and its
            condition.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
