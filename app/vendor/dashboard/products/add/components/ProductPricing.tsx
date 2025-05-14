"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateProductFormData } from "@/lib/schemas/products/create";
import { TextInput } from "@/components/text-input";
import { formatCurrency } from "@/lib/utils";

interface ProductPricingProps {
  form: UseFormReturn<CreateProductFormData>;
  error?: string;
}

export function ProductPricing({ form }: ProductPricingProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-2">
      <TextInput
        control={control}
        name="price"
        type="number"
        label="Price"
        placeholder="Enter product price"
        error={errors.price?.message}
      />
      {Number(form.watch("price")) > 0 && (
        <p className="font-medium">
          {formatCurrency(Number(form.watch("price")))}
        </p>
      )}
    </div>
  );
}
