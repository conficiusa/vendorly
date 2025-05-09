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
import { toast } from "sonner";

export default function CreateStoreForm() {
  const form = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      bio: "",
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
    formState: { isSubmitting, errors },
  } = form;

  console.log(errors);
  console.log(form.getValues());
  const onSubmit = async (data: CreateStoreFormData) => {
    const { images, ...storeData } = data;
    try {
      // First create the store
      const storeRes = await fetch("/api/stores/create", {
        method: "POST",
        body: JSON.stringify(storeData),
      });

      const store = await storeRes.json();
      if (!storeRes.ok) {
        throw new Error(store.error);
      }

      // Then create upload job for images
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("storeId", store.store.id);

      const uploadRes = await fetch("/api/jobs/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to queue image upload");
      }

      toast.success("Store Created Successfully", {
        description: "Your store images are being processed",
      });
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
              <CreateStoreImages form={form} />
              <CreateStoreAddress form={form} />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Store...
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
