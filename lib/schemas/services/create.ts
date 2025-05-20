import { z } from "zod";

const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

const convertTo24Hour = (time: string) => {
  const [timeStr, period] = time.split(" ");
  const [hours, minutes] = timeStr.split(":");
  let hour = parseInt(hours);

  if (period === "PM" && hour !== 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + parseInt(minutes);
};

export const createServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  rate: z.number().gt(0, "Rate must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  workingDays: z
    .array(z.string())
    .min(1, "At least one working day is required"),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each image must be less than 5MB"
    ),
  dailyMax: z.number().optional(),
  serviceDuration: z.number().optional(),
  operatingHours: z
    .object({
      openAt: z
        .string()
        .min(1, "Open time is required")
        .regex(timeRegex, "Invalid time format. Use HH:MM AM/PM format"),
      closeAt: z
        .string()
        .min(1, "Close time is required")
        .regex(timeRegex, "Invalid time format. Use HH:MM AM/PM format"),
    })
    .refine(
      (data) => {
        const openMinutes = convertTo24Hour(data.openAt);
        const closeMinutes = convertTo24Hour(data.closeAt);
        return closeMinutes > openMinutes;
      },
      {
        message: "Close time must be after open time",
        path: ["closeAt"],
      }
    ),
});

export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
