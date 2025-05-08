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
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: CreateStoreFormData) => {
    try {
      console.log("Form submitted:", data);
      // Here you would typically upload images and create the store
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    } catch (error) {
      console.error("Error creating store:", error);
    } finally {
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
