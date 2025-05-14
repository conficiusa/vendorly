"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateProductFormData } from "@/lib/schemas/products/create";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useVariants } from "@/lib/swr/useVariants";

interface ProductVariantsProps {
  form: UseFormReturn<CreateProductFormData>;
  error?: string;
}

export function ProductVariants({ form }: ProductVariantsProps) {
  const { setValue, watch } = form;
  const hasVariants = watch("hasVariants");
  const variants = watch("variants");
  const {
    variants: availableAttributes,
    isLoading,
    isError,
    error: useVariantsError,
  } = useVariants(form.watch("category"));
  const [newValue, setNewValue] = useState("");
  const [editingValue, setEditingValue] = useState<{
    attribute: string;
    value: string;
  } | null>(null);

  if (isLoading) {
    return <div>Loading variants...</div>;
  }

  if (isError) {
    return <div>Error loading variants: {useVariantsError}</div>;
  }

  if (!variants) {
    return <div>No variants found</div>;
  }

  const handleAttributeSelect = (attribute: string) => {
    if (!variants?.selectedAttributes) return;

    if (variants.selectedAttributes.includes(attribute)) {
      setValue(
        "variants.selectedAttributes",
        variants.selectedAttributes.filter((a) => a !== attribute)
      );
      // Remove the attribute from attributeValues
      const newAttributeValues = { ...variants.attributeValues };
      delete newAttributeValues[attribute];
      setValue("variants.attributeValues", newAttributeValues);
    } else {
      if (variants.selectedAttributes.length >= 2) return;
      setValue("variants.selectedAttributes", [
        ...variants.selectedAttributes,
        attribute,
      ]);
      // Initialize with the available values from availableAttributes
      const selectedAttribute = availableAttributes?.find(
        (attr) => attr.name === attribute
      );
      setValue("variants.attributeValues", {
        ...variants.attributeValues,
        [attribute]: selectedAttribute?.values || [],
      });
    }
  };

  const addValue = (attribute: string, value: string) => {
    if (!value.trim() || !variants?.attributeValues) return;

    const currentValues = variants.attributeValues[attribute] || [];
    setValue("variants.attributeValues", {
      ...variants.attributeValues,
      [attribute]: [...currentValues, value.trim()],
    });
    setNewValue("");
  };

  const removeValue = (attribute: string, valueToRemove: string) => {
    if (!variants?.attributeValues) return;

    const currentValues = variants.attributeValues[attribute] || [];
    setValue("variants.attributeValues", {
      ...variants.attributeValues,
      [attribute]: currentValues.filter((value) => value !== valueToRemove),
    });
  };

  const editValue = (attribute: string, oldValue: string, newValue: string) => {
    if (!newValue.trim() || !variants?.attributeValues) return;

    const currentValues = variants.attributeValues[attribute] || [];
    setValue("variants.attributeValues", {
      ...variants.attributeValues,
      [attribute]: currentValues.map((value) =>
        value === oldValue ? newValue : value
      ),
    });
  };

  const renderVariantValues = (attribute: string) => {
    const values = variants?.attributeValues?.[attribute] || [];

    return (
      <div className="space-y-3">
        <Label>{attribute}</Label>
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1"
            >
              {editingValue?.attribute === attribute &&
              editingValue?.value === value ? (
                <Input
                  className="h-6 w-24 bg-background border-0 p-0 focus-visible:ring-0"
                  defaultValue={value}
                  autoFocus
                  onBlur={(e) => {
                    editValue(attribute, value, e.target.value);
                    setEditingValue(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      editValue(attribute, value, e.currentTarget.value);
                      setEditingValue(null);
                    }
                  }}
                />
              ) : (
                <div
                  className="h-6 px-2 flex items-center cursor-pointer"
                  onClick={() => setEditingValue({ attribute, value })}
                >
                  {value}
                </div>
              )}
              <Button
                variant="outline"
                type="button"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => removeValue(attribute, value)}
              >
                <Icons.X className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={`Add new ${attribute.toLowerCase()}`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && addValue(attribute, newValue)
            }
          />
          <Button onClick={() => addValue(attribute, newValue)}>Add</Button>
        </div>
      </div>
    );
  };

  const renderVariantMatrix = () => {
    if (
      !variants?.selectedAttributes ||
      variants.selectedAttributes.length !== 2
    ) {
      return null;
    }

    const attr1 = variants.selectedAttributes[0];
    const attr2 = variants.selectedAttributes[1];
    const values1 = variants.attributeValues?.[attr1] || [];
    const values2 = variants.attributeValues?.[attr2] || [];

    if (values1.length === 0 || values2.length === 0) {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Variant Stock Management</CardTitle>
            <CardDescription className="text-destructive">
              Please add values for both {attr1} and {attr2} to manage stock
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Variant Stock Management</CardTitle>
          <CardDescription>
            Enter the stock quantity for each combination of {attr1} and {attr2}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-3 border-b border-r bg-muted/50 text-left min-w-[120px]">
                    {attr1} \ {attr2}
                  </th>
                  {values2.map((val2) => (
                    <th
                      key={val2}
                      className="p-3 border-b text-center bg-muted/50 min-w-[100px]"
                    >
                      {val2}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {values1.map((val1) => (
                  <tr key={val1}>
                    <td className="p-3 border-r font-medium bg-muted/50">
                      {val1}
                    </td>
                    {values2.map((val2) => {
                      const key = `${val1}-${val2}`;
                      return (
                        <td key={key} className="p-2 text-center">
                          <Input
                            type="number"
                            min="0"
                            className="w-20 mx-auto text-center"
                            value={variants.variantStock?.[key] || 0}
                            onChange={(e) => {
                              setValue("variants.variantStock", {
                                ...variants.variantStock,
                                [key]: parseInt(e.target.value) || 0,
                              });
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasVariants"
            checked={hasVariants}
            onCheckedChange={(checked) => {
              setValue("hasVariants", checked as boolean);
              if (!checked) {
                setValue("variants", {
                  selectedAttributes: [],
                  attributeValues: {},
                  variantStock: {},
                });
              }
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="hasVariants"
              className="text-base font-medium leading-none"
            >
              This product has variants
            </label>
            <p className="text-sm text-muted-foreground">
              Enable if your product comes in different variations (e.g., sizes,
              colors)
            </p>
          </div>
        </div>
      </CardHeader>
      {hasVariants && (
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select Variant Types (Choose 2)</Label>
            <div className="flex flex-wrap gap-2">
              {availableAttributes?.map((attribute) => (
                <Badge
                  key={attribute.name}
                  variant={
                    variants?.selectedAttributes?.includes(attribute.name)
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer ${
                    (variants?.selectedAttributes?.length ?? 0) >= 2 &&
                    !variants?.selectedAttributes?.includes(attribute.name)
                      ? "opacity-50"
                      : ""
                  }`}
                  onClick={() => handleAttributeSelect(attribute.name)}
                >
                  {attribute.name}
                </Badge>
              ))}
            </div>
          </div>

          {variants?.selectedAttributes?.map((attribute) => (
            <div key={attribute}>{renderVariantValues(attribute)}</div>
          ))}

          {renderVariantMatrix()}
        </CardContent>
      )}
    </Card>
  );
}
