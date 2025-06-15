import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "@/lib/emails/sendEmail";
import { resetPasswordEmail } from "@/lib/emails/auth/reset-password";
import { render } from "@react-email/components";
import { VerificationEmail as VerificationEmailComponent } from "@/lib/emails/auth/verify-email";
import { headers } from "next/headers";
import { prisma } from "@/prisma/prisma-client";
import {
  createAuthMiddleware,
  customSession,
  anonymous,
} from "better-auth/plugins";
import { tryCatch } from "./utils";
import { getUser } from "./queries/user/me";
import { QUEUE_URLS } from "@/app/api/utils/constants";
import { fetchSessionId } from "./utils/session";
import { QueueJob } from "@/app/api/utils/job";
import { decodeJwt } from "jose";

const options = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BASE_URL,
  appName: "Vendorly",
  rateLimit: {
    storage: "database",
    modelName: "rateLimit",
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      getUserInfo: async (token) => {
        if (!token?.idToken) {
          throw new Error("Invalid Google OAuth token");
        }

        const profile = decodeJwt(token.idToken) as Record<string, any>;

        return {
          user: {
            id: String(profile.sub),
            name: profile.name as string,
            first_name: profile.given_name as string,
            last_name: profile.family_name as string,
            email: profile.email as string,
            image: profile.picture as string,
            emailVerified: true,
          },
          data: profile,
        };
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          const sessionId = await fetchSessionId();
          await QueueJob(QUEUE_URLS.RECOMBEE, {
            type: "mergeUsers",
            userId: newSession.user.id,
            sessionId,
            newUser: {
              name: newSession.user.name,
              email: newSession.user.email,
              role: newSession.user.role,
              gender: newSession.user.gender,
            },
          }).catch((err) => {
            console.error(err);
          });
        }
      }
      if (ctx.path.startsWith("/sign-in")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          const sessionId = await fetchSessionId();
          await QueueJob(QUEUE_URLS.RECOMBEE, {
            type: "mergeUsers",
            userId: newSession.user.id,
            sessionId,
            newUser: {
              name: newSession.user.name,
              email: newSession.user.email,
              role: newSession.user.role,
              gender: newSession.user.gender,
            },
          }).catch((err) => {
            console.error(err);
          });
        }
      }
    }),
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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60,
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
      last_name: {
        type: "string",
        required: true,
      },
      gender: {
        type: "string",
        required: true,
      },
      phone: {
        type: "string",
        required: true,
      },
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    anonymous(),
    customSession(async ({ session, user }) => {
      const { data } = await tryCatch(getUser(session.userId));
      return {
        user: {
          ...user,
          first_name: data?.first_name ?? "",
          last_name: data?.last_name ?? "",
          phone: data?.phone ?? "",
          role: data?.role ?? "CUSTOMER",
          gender: data?.gender ?? "",
        },
        store: data?.store,
        session,
      };
    }),
  ],
});

export const getSession = async () =>
  await auth.api.getSession({ headers: await headers() });
