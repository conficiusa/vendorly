"use server";
import { CreateServiceFormData } from "@/lib/schemas/services/create";
import { Prisma } from "@/prisma/generated/prisma-client";
import { generateUniqueSlug } from "@/lib/utils";
import { prisma } from "@/prisma/prisma-client";

type ServiceFormDataWithoutImages = Omit<CreateServiceFormData, "images">;

export async function transformServiceFormData(
  formData: ServiceFormDataWithoutImages,
  storeId: string
): Promise<Prisma.ServiceCreateInput> {
  // Generate unique slug
  const slug = await generateUniqueSlug(formData.name, (slug) =>
    prisma.service.findUnique({ where: { slug } })
  );

  // Base service data
  const serviceData: Prisma.ServiceCreateInput = {
    name: formData.name,
    slug,
    description: formData.description,
    rate: formData.rate,
    unit: formData.unit,
    workingDays: formData.workingDays,
    dailyMax: formData.dailyMax || 0,
    serviceDuration: formData.serviceDuration || 0,
    operatingHours: formData.operatingHours,
    images: [], // Initialize with empty array, will be updated after image upload
    store: {
      connect: {
        id: storeId,
      },
    },
    Category: formData.category
      ? {
          connect: {
            id: formData.category,
          },
        }
      : undefined,
  };

  return serviceData;
}
