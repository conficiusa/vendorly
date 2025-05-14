"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateProductFormData } from "@/lib/schemas/products/create";
import { TextInput } from "@/components/text-input";
import { Combobox } from "@/components/combo-box";
import { TextAreaInput } from "@/components/textarea-input";
import { formatCurrency } from "@/lib/utils";
import { useCategories } from "@/lib/swr/useCategories";

interface ProductBasicInfoProps {
  form: UseFormReturn<CreateProductFormData>;
  error: any;
}

export function ProductBasicInfo({ form, error }: ProductBasicInfoProps) {
  const { control } = form;
  const { categories, isLoading } = useCategories();

  const categoryOptions =
    categories?.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          control={control}
          name="name"
          type="text"
          label="Product Name"
          placeholder="Enter product name"
          error={error.name?.message}
        />

        <Combobox
          control={control}
          name="category"
          label="Category"
          placeholder="Select category"
          items={categoryOptions}
          isLoading={isLoading}
          emptyText="No categories found"
          searchPlaceholder="Search categories..."
        />
      </div>
      <div className="grid gap-2">
        <TextInput
          control={control}
          name="price"
          type="number"
          label="Price"
          placeholder="Enter product price"
          error={error.price?.message}
        />
        {Number(form.watch("price")) > 0 && (
          <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Preview Price</p>
            <p className="text-xl font-semibold text-primary">
              {formatCurrency(Number(form.watch("price")))}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <TextAreaInput
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
    </>
  );
}
