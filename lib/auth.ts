import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "@/lib/emails/sendEmail";
import { resetPasswordEmail } from "@/lib/emails/auth/reset-password";
import { render } from "@react-email/components";
import { VerificationEmail as VerificationEmailComponent } from "@/lib/emails/auth/verify-email";
import { headers } from "next/headers";
import { prisma } from "@/prisma/prisma-client";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  appName: "Vendorly",
  rateLimit: {
    storage: "database",
    modelName: "rateLimit",
  },
  emailVerification: {
    expiresIn: 60 * 60 * 24, // 1 day
    sendVerificationEmail: async ({ user, url }) => {
      const body = await render(
        VerificationEmailComponent({
          url: url,
          userName: user.name.split(" ")[0],
        })
      );
      await sendEmail({
        recipient: user.email,
        subject: "Verify Your Email",
        body: body,
      });
    },
  },
  emailAndPassword: {
    resetPasswordTokenExpiresIn: 10 * 60, // 10 minutes
    enabled: true,
    sendResetPassword: async ({ url, user }) => {
      await sendEmail({
        recipient: user.email,
        subject: "Reset Your Password",
        body: resetPasswordEmail({ link: url }),
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
      },
      first_name: {
        type: "string",
        required: true,
      },
      onboarded: {
        type: "boolean",
        defaultValue: false,
      },
      last_name: {
        type: "string",
        required: true,
      },
      phone: {
        type: "string",
        required: true,
      },
    },
  },
});

export const getSession = async () =>
  await auth.api.getSession({ headers: await headers() });
