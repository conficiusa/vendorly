"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ProductImages } from "./ProductImages";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductVariants } from "./ProductVariants";
import {
  CreateProductFormData,
  createProductSchema,
} from "@/lib/schemas/products/create";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useEffect, useState } from "react";

export function AddProductForm() {
  const router = useRouter();
  const [triggerUpload, setTriggerUpload] = useState<{
    status: boolean;
    images: Array<File> | null;
    productId: string | null;
  }>({
    status: false,
    images: null,
    productId: null,
  });
  const { startUpload } = useUploadThing("productImages", {
    onUploadError: () => {
      toast.error("Failed to upload product images", {
        description: "You can retry to upload images by updating the product",
      });
    },
  });
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      stock: 0,
      images: [],
      hasVariants: false,
      variants: {
        selectedAttributes: [],
        attributeValues: {},
        variantStock: {},
      },
    },
  });

  const {
    formState: { isSubmitting, errors },
  } = form;

  useEffect(() => {
    const uploadImages = async () => {
      if (
        triggerUpload.status &&
        triggerUpload.images &&
        triggerUpload.productId
      ) {
        await startUpload(triggerUpload.images, {
          productId: triggerUpload.productId,
        });
      }
    };

    uploadImages();
  }, [triggerUpload, startUpload, router]);

  const onSubmit = async (data: CreateProductFormData) => {
    const { images, ...productData } = data;
    try {
      const res = await fetch("/api/vendors/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
      const product = await res.json();
      if (!res.ok) {
        throw new Error(product.error);
      }
      setTriggerUpload({
        status: true,
        images,
        productId: product.data.id,
      });
      toast.success("Product created successfully");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to create product");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your store. Fill in the details and configure
          variants if needed.
        </p>
      </div>

      <div className="grid gap-6">
        <ProductImages
          images={form.watch("images")}
          onImagesChange={(images) => form.setValue("images", images)}
          error={errors.images?.message}
          form={form}
        />

        <ProductBasicInfo form={form} error={errors} />
        <ProductVariants form={form} error={errors.variants?.message} />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 mt-8">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Product...
            </>
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
    </form>
  );
}
