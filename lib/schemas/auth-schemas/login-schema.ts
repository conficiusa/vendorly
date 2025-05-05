import { z } from "zod";

export const LoginSchema = z.object({
	email: z
		.string()
		.min(1, "Email address is required")
		.email("Enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
