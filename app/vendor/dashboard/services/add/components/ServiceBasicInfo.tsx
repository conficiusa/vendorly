"use client";

import { Control, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInput } from "@/components/text-input";
import { Combobox } from "@/components/combo-box";
import { CreateServiceFormData } from "@/lib/schemas/services/create";
import { TextAreaInput } from "@/components/textarea-input";
import { useCategories } from "@/lib/swr/useCategories";
import { useMemo } from "react";

const units = [
  { label: "Per Session", value: "session" },
  { label: "Per Hour", value: "hour" },
  { label: "Per Day", value: "day" },
];

interface ServiceBasicInfoProps {
  control: Control<CreateServiceFormData>;
  errors: FieldErrors<CreateServiceFormData>;
}

export function ServiceBasicInfo({ control, errors }: ServiceBasicInfoProps) {
  const { categories, isLoading } = useCategories("SERVICE");

  const categoryOptions = useMemo(() => {
    return (
      categories?.map((category) => ({
        value: category.id,
        label: category.name,
      })) || []
    );
  }, [categories]);

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <TextInput
            control={control}
            name="name"
            label="Service Name"
            placeholder="Enter service name"
            error={errors.name?.message}
          />

          <Combobox
            label="Category"
            placeholder="Select category"
            error={errors.category?.message}
            control={control}
            name="category"
            searchPlaceholder="Search category"
            items={categoryOptions}
            isLoading={isLoading}
            emptyText="No categories found"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Rate"
            placeholder="Enter rate"
            type="number"
            control={control}
            name="rate"
            error={errors.rate?.message}
          />

          <Combobox
            label="Unit"
            placeholder="Select unit"
            control={control}
            name="unit"
            searchPlaceholder="Search unit"
            items={units}
            error={errors.unit?.message}
          />
        </div>
        <TextAreaInput
          label="Description"
          placeholder="Enter service description"
          control={control}
          name="description"
          rows={6}
          error={errors.description?.message}
          className="resize-none"
        />
      </CardContent>
    </Card>
  );
}
