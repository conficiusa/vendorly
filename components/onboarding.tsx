"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SelectRole from "@/components/select-role";
import {
  OnboardingFormData,
  onboardingSchema,
} from "@/lib/schemas/auth-schemas/onboarding-schema";
import AddressForm from "./address-form";
import ImageUpload from "./image-upload";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const steps = [
  {
    id: "user-type",
    title: "How do you intend to use Vendorly?",
    description: "Tell us about your primary intention for using the platform",
  },
  {
    id: "address",
    title: "Where are you located?",
    description: "This helps us show you relevant products and services",
    optional: true,
  },
  {
    id: "profile",
    title: "Add a profile picture",
    description: "Help others recognize you",
    optional: true,
  },
];

export default function OnboardingPage() {
  const [step, setStep] = React.useState(0);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      role: "customer",
      address: {
        address_line1: "",
        address_line2: "",
        city: "",
        digital_address: "",
        region: "",
      },
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Welcome to Vendorly!");
      router.replace("/discover");
    } catch (error) {
      toast.error("Failed to update profile", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (step === 1) {
      // Skip address step
      form.setValue("address", undefined);
    }
    nextStep();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-card rounded-xl shadow-lg p-6 md:p-8"
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{steps[step].title}</h1>
          </div>
          <p className="text-muted-foreground">
            {steps[step].description}
            {steps[step].optional && (
              <span className="ml-1 text-sm">(optional)</span>
            )}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 0 && <SelectRole form={form} />}

            {step === 1 && <AddressForm form={form} />}

            {step === 2 && (
              <ImageUpload
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                onSubmit={onSubmit}
                form={form}
              />
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 max-sm:items-start">
            <button
              type="button"
              onClick={prevStep}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                step === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary"
              }`}
              disabled={step === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="flex gap-3 text-muted-foreground text-sm max-sm:flex-col">
              {steps[step].optional && (
                <Button
                  variant={"ghost"}
                  onClick={handleSkip}
                  className="max-sm:order-2"
                >
                  Skip
                </Button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (step === steps.length - 1) {
                    form.handleSubmit(onSubmit)();
                  } else {
                    nextStep();
                  }
                }}
                disabled={(step === 0 && !form.watch("role")) || isSubmitting}
                className="inline-flex items-center px-4 py-2 max-sm:order-1 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    Updating...
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  </>
                ) : step === steps.length - 1 ? (
                  "Complete"
                ) : (
                  "Continue"
                )}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
