"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  completeProfileSchema,
  CompleteProfileData,
} from "@/lib/schemas/auth-schemas/complete-profile-schema";
import { TextInput } from "@/components/text-input";
import SelectComponent from "@/components/select-component";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CompleteProfileForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      gender: undefined,
      phone: "",
      address: {
        region: "",
        city: "",
        address_line1: "",
        address_line2: "",
        digital_address: "",
      },
    },
  });

  const onSubmit = async (data: CompleteProfileData) => {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading("Submitting...");

      // Strip empty address fields or omit address if all empty
      const hasAddressValues = data.address
        ? Object.values(data.address).some((val) => val)
        : false;

      const payload: any = {
        gender: data.gender,
        phone: data.phone,
      };
      if (hasAddressValues) {
        payload.address = data.address;
      }

      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed");
      }

      toast.dismiss(toastId);
      toast.success("Profile completed");
      router.push("/discover");
    } catch (error: any) {
      if (toastId) toast.dismiss(toastId);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <SelectComponent
        label="Select your gender"
        control={control}
        items={[
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
        ]}
        name="gender"
        placeholder="Select gender"
        error={errors.gender?.message}
      />

      <TextInput
        control={control}
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="eg. 050 123 4567"
        error={errors.phone?.message}
      />

      <Accordion type="single" collapsible defaultValue="">
        <AccordionItem value="address">
          <AccordionTrigger className="text-sm font-medium text-gray-700 py-2">
            Add address (optional)
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <TextInput
                control={control}
                name="address.region"
                type="text"
                label="Region"
                placeholder="Region"
              />
              <TextInput
                control={control}
                name="address.city"
                type="text"
                label="City"
                placeholder="City"
              />
            </div>

            <TextInput
              control={control}
              name="address.address_line1"
              type="text"
              label="Address Line 1"
              placeholder="Address line 1"
            />

            <TextInput
              control={control}
              name="address.address_line2"
              type="text"
              label="Address Line 2 (optional)"
              placeholder="Address line 2"
            />

            <TextInput
              control={control}
              name="address.digital_address"
              type="text"
              label="Digital Address (optional)"
              placeholder="GA-000-0000"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-rose-500 text-white hover:bg-rose-600"
      >
        Save & Continue
      </Button>
    </form>
  );
};

export default CompleteProfileForm;
