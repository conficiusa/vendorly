"use client";

import { UseFormReturn } from "react-hook-form";
import { TextInput } from "@/components/text-input";
import { regions } from "@/lib/constants/regions";
import SelectComponent from "./select-component";
import { motion } from "framer-motion";
import { OnboardingFormData } from "@/lib/schemas/auth-schemas/onboarding-schema";

interface AddressFormProps {
  form: UseFormReturn<OnboardingFormData>;
}

export default function AddressForm({ form }: AddressFormProps) {
  return (
    <motion.div
      key="address"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4 max-sm:gap-2">
        <SelectComponent
          name="address.region"
          label="Region"
          control={form.control}
          error={form.formState.errors.address?.region?.message}
          items={regions}
          placeholder="Choose region"
        />

        <TextInput
          control={form.control}
          name="address.city"
          label="City"
          placeholder="Enter your city"
          error={form.formState.errors.address?.city?.message}
        />
      </div>

      <TextInput
        control={form.control}
        name="address.address_line1"
        label="Address Line 1"
        placeholder="Enter your street address"
        error={form.formState.errors.address?.address_line1?.message}
      />

      <TextInput
        control={form.control}
        name="address.address_line2"
        label="Address Line 2 (Optional)"
        placeholder="Apartment, suite, unit, etc. (optional)"
        error={form.formState.errors.address?.address_line2?.message}
      />

      <TextInput
        control={form.control}
        name="address.digital_address"
        label="Digital Address (Optional)"
        placeholder="Enter your digital address (optional)"
        error={form.formState.errors.address?.digital_address?.message}
      />
    </motion.div>
  );
}
