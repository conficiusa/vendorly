"use client";
import { CreateStoreFormData } from "@/lib/schemas/stores/create";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { UseFormReturn } from "react-hook-form";

const MAX_IMAGES = 5;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
type storeImagesFormProps = {
  form: UseFormReturn<CreateStoreFormData>;
};
const CreateStoreImages = ({ form }: storeImagesFormProps) => {
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + imagePreviews.length > MAX_IMAGES) {
      form.setError("images", {
        type: "manual",
        message: `Cannot upload more than ${MAX_IMAGES} images`,
      });
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    form.setValue("images", [...(form.getValues("images") || []), ...files]);
  };

  React.useEffect(() => {
    return () => {
      // Cleanup image previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    form.setValue(
      "images",
      form.getValues("images").filter((_, i) => i !== index)
    );
  };
  return (
    <div>
      <label className="block text-sm font-medium mb-3">Store Images</label>
      <p className="text-sm text-muted-foreground mb-4">
        Add up to 5 images of your store or products. These images will be
        displayed on your store profile and help showcase your business to
        potential customers.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {imagePreviews.map((preview, index) => (
          <div
            key={preview}
            className="relative aspect-square rounded-lg overflow-hidden border border-input bg-background"
          >
            <Image
              src={preview}
              alt={`Store image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {imagePreviews.length < MAX_IMAGES && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-input bg-background hover:bg-secondary/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleImageChange}
              className="sr-only"
              multiple
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
              <ImagePlus className="h-8 w-8" />
              <span className="text-xs font-medium">Add Image</span>
            </div>
          </label>
        )}
      </div>
      {form.formState.errors.images && (
        <p className="mt-2 text-sm text-destructive">
          {form.formState.errors.images.message}
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Upload up to {MAX_IMAGES} images. Each image must be less than 5MB.
      </p>
    </div>
  );
};

export default CreateStoreImages;
