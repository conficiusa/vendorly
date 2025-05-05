import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const SignUpSchema = z
	.object({
		first_name: z.string().min(1, "First name is required"),
		last_name: z.string().min(1, "Last name is required"),
		phone: z
			.string()
			.min(1, "Phone number is required")
			.refine((value) => isValidPhoneNumber(value, "GH"), {
				message: "Invalid phone number",
			}),
		email: z
			.string()
			.min(1, "Email address is required")
			.email("Enter a valid email address"),
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

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
