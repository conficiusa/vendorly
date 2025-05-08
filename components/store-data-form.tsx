import { CreateStoreFormData } from "@/lib/schemas/stores/create";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TextInput } from "@/components/text-input";
import { TextAreaInput } from "@/components/textarea-input";

type storeDataFromProps = {
  form: UseFormReturn<CreateStoreFormData>;
};
const StoreDataForm = ({ form }: storeDataFromProps) => {
  const {
    control,
    formState: { errors },
  } = form;
  return (
    <>
      <TextInput
        control={control}
        name="name"
        label="Store Name"
        placeholder="Enter your store name"
        error={errors.name?.message}
      />
      <TextAreaInput
        control={control}
        name="bio"
        rows={20}
        label="Store Description"
        placeholder="Tell customers about your store"
        error={errors.bio?.message}
      />
    </>
  );
};

export default StoreDataForm;
