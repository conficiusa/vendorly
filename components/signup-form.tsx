"use client";
import {
  SignUpSchema,
  SignUpSchemaType,
} from "@/lib/schemas/auth-schemas/signup-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/text-input";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ErrorContext } from "better-auth/react";

const SignupForm = () => {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = React.useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  const onSubmit = async (formdata: SignUpSchemaType) => {
    let loadingToastId: string | number;
    await authClient.signUp.email(
      {
        email: formdata.email,
        password: formdata.password,
        name: `${formdata.first_name} ${formdata.last_name}`,
        first_name: formdata.first_name,
        last_name: formdata.last_name,
        phone: formdata.phone,
        callbackURL: "/discover",
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading("Creating account...");
        },
        onError: (ctx: ErrorContext) => {
          toast.dismiss(loadingToastId);
          toast.error(ctx.error.statusText || "UNKOWN ERROR", {
            description: ctx.error.message,
          });
        },
        onSuccess: async (ctx: any) => {
          toast.dismiss(loadingToastId);
          toast.success("Account created successfully");
          const {
            data: { user },
          } = ctx;
          await authClient.sendVerificationEmail({
            email: user.email,
            callbackURL: "/discover", // The redirect URL after verification
          });
          router.push("/auth/verify-email");
        },
      }
    );
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-2 gap-4">
        <TextInput
          control={control}
          name="first_name"
          type="text"
          label="First name"
          placeholder="Enter your first name"
          error={errors.first_name?.message}
        />
        <div className="space-y-2">
          <TextInput
            control={control}
            name="last_name"
            type="text"
            placeholder="Enter your last name"
            label="Last name"
            error={errors.last_name?.message}
          />
        </div>
      </div>
      <div className="space-y-2">
        <TextInput
          control={control}
          name="email"
          type="email"
          placeholder="your@email.com"
          label="Email"
          error={errors.email?.message}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          label="Phone Number"
          control={control}
          name="phone"
          type="tel"
          placeholder="eg. 050 123 4567"
          error={errors.phone?.message}
        />
      </div>
      <div className="space-y-2">
        <TextInput
          control={control}
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
        />
      </div>

      <div className="space-y-2">
        <TextInput
          control={control}
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onChange={() => setTermsAccepted(true)}
        />
        <label
          htmlFor="terms"
          className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <Link
            href="/terms"
            className="font-medium text-rose-600 hover:text-rose-500"
          >
            terms of service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-rose-600 hover:text-rose-500"
          >
            privacy policy
          </Link>
        </label>
      </div>
      <Button
        disabled={!termsAccepted || isSubmitting}
        className="w-full bg-rose-500 text-white hover:bg-rose-600"
        type="submit"
      >
        Create account
      </Button>
    </form>
  );
};

export default SignupForm;
