"use client";
import { motion } from "framer-motion";
import { Store, ShoppingBag, UserCircle2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "@/lib/schemas/auth-schemas/onboarding-schema";

const SelectRole = ({ form }: { form: UseFormReturn<OnboardingFormData> }) => {
  return (
    <motion.div
      key="user-type"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <button
        type="button"
        onClick={() => form.setValue("role", "customer")}
        className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
          form.watch("role") === "customer"
            ? "border-primary bg-primary/5 text-primary"
            : "border-border hover:border-primary/50"
        }`}
      >
        <ShoppingBag className="h-8 w-8 mb-3 " />
        <span className="font-medium ">I'm here to shop</span>
      </button>

      <button
        type="button"
        onClick={() => form.setValue("role", "vendor")}
        className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
          form.watch("role") === "vendor"
            ? "border-primary bg-primary/5 text-primary"
            : "border-border hover:border-primary/50"
        }`}
      >
        <Store className="h-8 w-8 mb-3 " />
        <span className="font-medium ">I want to sell</span>
      </button>

      <button
        type="button"
        onClick={() => form.setValue("role", "other")}
        className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
          form.watch("role") === "other"
            ? "border-primary bg-primary/5 text-primary"
            : "border-border hover:border-primary/50"
        }`}
      >
        <UserCircle2 className="h-8 w-8 mb-3 " />
        <span className="font-medium ">I'm here to help</span>
      </button>
    </motion.div>
  );
};

export default SelectRole;
