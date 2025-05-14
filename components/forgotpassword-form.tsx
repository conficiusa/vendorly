"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/text-input";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/lib/schemas/auth-schemas/forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const ForgotpasswordForm = () => {
  //TODO: add forgot password functionality
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formdata: ForgotPasswordSchemaType) => {
    await authClient.forgetPassword(
      {
        email: formdata.email,
        redirectTo: "/auth/reset-password",
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.statusText || "UNKOWN ERROR", {
            description: ctx.error.message,
          });
        },
        onSuccess: () => {
          toast.success("Reset link sent to your email");
        },
      }
    );
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <TextInput
          control={control}
          name="email"
          label="Email address"
          error={errors.email?.message}
          placeholder="Enter your email address"
        />
      </div>
      <Button
        className="w-full bg-primary text-white hover:bg-rose-600"
        disabled={isSubmitting}
      >
        Send reset link
      </Button>
    </form>
  );
};

export default ForgotpasswordForm;
