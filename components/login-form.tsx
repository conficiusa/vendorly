"use client";
import { LoginSchema } from "@/lib/schemas/auth-schemas/login-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "./text-input";
import Link from "next/link";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type FormData = z.infer<typeof LoginSchema>;
const LoginForm = () => {
  const { data: session } = authClient.useSession();
  const redirect = useSearchParams().get("redirect");
  const router = useRouter();
  //form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (formdata: FormData) => {
    let loadingToastId: string | number;
    await authClient.signIn.email(
      {
        email: formdata.email,
        password: formdata.password,
        // callbackURL: redirect ?? "/discover",
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading("Logging In");
        },
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            console.log(ctx.error)
            toast.dismiss(loadingToastId);
            toast.warning("Email not verified", {
              description: "Please verify your email address to log in.",
            });
            router.push("/auth/verify-email");
            return;
          }
          toast.dismiss(loadingToastId);
          toast.error(ctx.error.statusText, { description: ctx.error.message });
        },
        onSuccess: async (ctx) => {
          const {
            data: { user },
          } = ctx;
          toast.dismiss(loadingToastId);
          toast.success("Logged In Successfully");

          if (!user.emailVerified) {
            await authClient.sendVerificationEmail({
              email: user.email,
              callbackURL: redirect ?? "/discover", // The redirect URL after verification
            });
            router.push("/auth/verify-email");
            return;
          }

          if (session?.user.role === "VENDOR") {
            router.push(redirect || "/vendor/dashboard");
          } else {
            router.push(redirect || "/discover");
          }
        },
      }
    );
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        control={control}
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        error={errors.email?.message}
      />
      <div className="space-y-2">
        <TextInput
          control={control}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
        />
        <div className="flex  justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-primary hover:text-rose-500"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      <Button
        className="w-full bg-primary text-white hover:bg-rose-600"
        type="submit"
      >
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
