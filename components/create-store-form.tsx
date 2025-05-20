"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  CreateStoreFormData,
  createStoreSchema,
} from "@/lib/schemas/stores/create";
import StoreDataForm from "./store-data-form";
import CreateStoreImages from "./create-store-images";
import CreateStoreAddress from "./create-store-address";
import StoreLogoUpload from "./store-logo-upload";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

export default function CreateStoreForm() {
  const router = useRouter();
  const { startUpload, isUploading: ImagesUploading } = useUploadThing(
    "StoreImages",
    {
      onUploadError: () => {
        toast.warning(
          "Failed to upload images. You can retry in your dashboard"
        );
      },
    }
  );
  const { startUpload: LogoUpload, isUploading } = useUploadThing(
    "storeLogoUploader",
    {
      onClientUploadComplete: () => {
        toast.success("You store has been set up", {
          description: "You can start adding products and services",
        });
        router.push("/vendor/dashboard");
      },
      onUploadError: () => {
        toast.warning("Failed to upload logo. You can retry in your dashboard");
        router.push("/vendor/dashboard");
      },
    }
  );
  const form = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      bio: "",
      logo: undefined,
      images: [],
      useExistingAddress: false,
      address: {
        region: "",
        city: "",
        address_line1: "",
        address_line2: "",
        digital_address: "",
      },
    },
  });
const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: CreateStoreFormData) => {
    const { images, logo, ...storeData } = data;
    try {
      // First create the store
      const storeRes = await fetch("/api/vendors/store", {
        method: "POST",
        body: JSON.stringify(storeData),
      });

      const store = await storeRes.json();
      if (!storeRes.ok) {
        throw new Error(store.error);
      }

      // Upload images if provided
      if (images.length > 0) {
        await startUpload(images);
      }
      // Upload logo if provided
      if (logo) {
        await LogoUpload([logo]);
    }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to create store");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Your Store
            </h1>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <StoreDataForm form={form} />
              <StoreLogoUpload form={form} />
              <CreateStoreImages form={form} />
              <CreateStoreAddress form={form} />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || isUploading || ImagesUploading}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting || isUploading || ImagesUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSubmitting ? "Creating Store..." : "Uploading Images..."}
                  </>
                ) : (
                  "Create Store"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
