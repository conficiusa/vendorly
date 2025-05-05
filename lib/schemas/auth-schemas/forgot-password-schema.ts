import { z } from "zod";

export const ForgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "Email address is required to reset password")
		.email("Enter a valid email address"),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
