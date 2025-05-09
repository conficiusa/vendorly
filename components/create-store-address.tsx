"use client";
import { CreateStoreFormData } from "@/lib/schemas/stores/create";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertCircle } from "lucide-react";
import SelectComponent from "@/components/select-component";
import { TextInput } from "@/components/text-input";
import { regions } from "@/lib/constants/regions";
import { useAddress } from "@/lib/swr/useAddresses";
import { Address } from "@/prisma/generated/prisma-client";
import AddressSkeleton from "./skeletons/address-skeleton";

const CreateStoreAddress = ({
  form,
}: {
  form: UseFormReturn<CreateStoreFormData>;
}) => {
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const { addresses, isLoading, error } = useAddress();
  const toggleAddressType = (useExisting: boolean) => {
    setUseExistingAddress(useExisting);
    form.setValue("useExistingAddress", useExisting);
    if (useExisting) {
      // Clear address fields when using existing address
      form.setValue("address", undefined);
    } else {
      // Clear selected address when using new address
      form.setValue("selectedAddressId", undefined);
    }
  };

  const RenderError = (
    <div className="p-4 rounded-lg border-2 border-destructive bg-destructive/5">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <p>Failed to load addresses. Please try again later.</p>
      </div>
    </div>
  );
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-3">Store Address</label>
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => toggleAddressType(false)}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              !useExistingAddress
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            }`}
          >
            <h3 className="font-medium mb-1">Add New Address</h3>
            <p className="text-sm text-muted-foreground">
              Enter a new store address
            </p>
          </button>
          <button
            type="button"
            onClick={() => toggleAddressType(true)}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              useExistingAddress
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            }`}
          >
            <h3 className="font-medium mb-1">Use Existing Address</h3>
            <p className="text-sm text-muted-foreground">
              Select from your saved addresses
            </p>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {useExistingAddress ? (
            <motion.div
              key="existing-address"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {isLoading ? (
                // Loading skeleton for addresses
                <AddressSkeleton />
              ) : error ? (
                RenderError
              ) : (
                addresses.map((address: Address) => (
                  <label
                    key={address.id}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      form.watch("selectedAddressId") === address.id
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={address.id}
                      {...form.register("selectedAddressId")}
                    />
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium capitalize">
                          {address.address_line1}
                          {address.address_line2 &&
                            `, ${address.address_line2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.region + " Region"}
                        </p>
                        {address.digital_address && (
                          <p className="text-sm text-muted-foreground">
                            Digital Address: {address.digital_address}
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="new-address"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
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
                name="address.digital_address"
                label="Digital Address "
                placeholder="Enter your digital address"
                error={form.formState.errors.address?.digital_address?.message}
              />
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
                placeholder="Apartment, suite, unit, etc."
                error={form.formState.errors.address?.address_line2?.message}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateStoreAddress;
