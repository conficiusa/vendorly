"use client";

import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { CreateProductFormData } from "@/lib/schemas/products/create";
import { useMemo } from "react";

interface ProductImagesProps {
  form: UseFormReturn<CreateProductFormData>;
  images: File[];
  onImagesChange: (images: File[]) => void;
  error?: string;
}

export function ProductImages({
  images,
  form,
  onImagesChange,
  error,
}: ProductImagesProps) {
  // Create object URLs only when images array changes
  const imageUrls = useMemo(() => {
    return images.map((file) => URL.createObjectURL(file));
  }, [images]);

  // Cleanup object URLs when component unmounts or images change
  useMemo(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.clearErrors("images");
    const files = Array.from(e.target.files || []);

    // Check total number of images
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate file sizes
    const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    // Check for duplicate images
    const duplicateFiles = files.filter((newFile) =>
      images.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size
      )
    );

    if (duplicateFiles.length > 0) {
      toast.error("Some images are already selected");
      return;
    }

    onImagesChange([...images, ...files]);
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Upload high-quality images to showcase your product (max 5 images, 5MB
          each).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-4 flex-wrap">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={imageUrls[index]}
                alt={`Product ${index + 1}`}
                className="h-24 w-24 object-cover rounded-lg"
                width={96}
                height={96}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 absolute -top-2 -right-2 rounded-full"
                onClick={() => removeImage(index)}
              >
                <Icons.X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="bg-background h-24 w-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <div className="text-center">
                <Icons.ImagePlus className="h-6 w-6 mx-auto text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">
                  Add Image
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
