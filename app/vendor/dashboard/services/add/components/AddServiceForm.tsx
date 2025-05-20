"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  CreateServiceFormData,
  createServiceSchema,
} from "@/lib/schemas/services/create";
import { ServiceBasicInfo } from "./ServiceBasicInfo";
import { ServiceScheduling } from "./ServiceScheduling";
import { ServiceImages } from "./serviceImages";
import { useUploadThing } from "@/lib/uploadthing";
export function AddServiceForm() {
  const form = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      rate: 0,
      unit: "session",
      images: [],
      workingDays: [],
      dailyMax: 0,
      serviceDuration: 0,
      operatingHours: {
        openAt: "",
        closeAt: "",
      },
    },
  });

  const {
    formState: { isSubmitting, errors },
  } = form;

  const { startUpload } = useUploadThing("serviceImages", {
    onUploadError: () => {
      toast.error("Failed to upload service images", {
        description: "You can retry to upload images by updating the service",
      });
    },
  });

  const onSubmit = async (data: CreateServiceFormData) => {
    const { images, ...serviceData } = data;
    try {
      const res = await fetch("/api/vendors/services", {
        method: "POST",
        body: JSON.stringify(serviceData),
      });
      const service = await res.json();
      if (!res.ok) {
        throw new Error(service.error);
      }
      await startUpload(images, { serviceId: service.data.id });
      toast.success("Service created successfully");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to create service");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Service</h1>
          <p className="text-muted-foreground">
            Add a new service to your store. Fill in the details and configure
            scheduling options.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <ServiceImages
          images={form.watch("images")}
          onImagesChange={(images) => form.setValue("images", images)}
          error={errors.images?.message}
          form={form}
        />
        <ServiceBasicInfo control={form.control} errors={errors} />
        <ServiceScheduling control={form.control} errors={errors} />
      </div>
      <div className="flex justify-end mt-4">
        <Button
          className="w-full"
          size={"lg"}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Service...
            </>
          ) : (
            "Add Service"
          )}
        </Button>
      </div>
    </form>
  );
}
