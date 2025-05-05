import { z } from "zod";

export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z
			.string()
			.min(6, "Password must be at least 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"], // path of error
	});

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
