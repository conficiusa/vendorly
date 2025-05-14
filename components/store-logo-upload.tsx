"use client";
import { CreateStoreFormData } from "@/lib/schemas/stores/create";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { UseFormReturn } from "react-hook-form";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

type StoreLogoUploadProps = {
  form: UseFormReturn<CreateStoreFormData>;
};

export default function StoreLogoUpload({ form }: StoreLogoUploadProps) {
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      form.setError("logo", {
        type: "manual",
        message: "Logo must be less than 4MB",
      });
      return;
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("logo", {
        type: "manual",
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      });
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
    form.setValue("logo", file);
  };

  React.useEffect(() => {
    return () => {
      // Cleanup preview
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <div>
      <label className="block text-sm font-medium mb-3">Store Logo</label>
      <p className="text-sm text-muted-foreground mb-4">
        Your store logo will be displayed in your store profile and product
        listings. This helps customers identify your brand.
      </p>
      <div className="flex items-center gap-4">
        {logoPreview ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-input bg-background">
            <Image
              src={logoPreview}
              alt="Store logo preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setLogoPreview(null);
                form.setValue("logo", undefined);
              }}
              className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <label className="relative w-24 h-24 rounded-lg border-2 border-dashed border-input bg-background hover:bg-secondary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleLogoChange}
              className="sr-only"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs font-medium">Add Logo</span>
            </div>
          </label>
        )}
      </div>
      {form.formState.errors.logo && (
        <p className="mt-2 text-sm text-destructive">
          {form.formState.errors.logo.message}
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Upload a logo for your store. Must be less than 4MB.
      </p>
    </div>
  );
}
