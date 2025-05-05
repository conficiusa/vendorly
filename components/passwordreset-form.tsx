"use client";
import {
	ResetPasswordSchema,
	ResetPasswordSchemaType,
} from "@/lib/schemas/auth-schemas/reset-Password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "./text-input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const PasswordresetForm = () => {
	const token = useSearchParams().get("token") ?? undefined;
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordSchemaType>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (formdata: ResetPasswordSchemaType) => {
		let loadingToastId: string | number;
		await authClient.resetPassword(
			{
				newPassword: formdata.password,
				token,
			},
			{
				onRequest: () => {
					loadingToastId = toast.loading("Reseting your password");
				},
				onError: async (ctx) => {
					toast.dismiss(loadingToastId);
					toast.error(ctx.error.name || "ERROR RESETTING PASSWORD", {
						description: ctx.error.message,
					});
				},
				onSuccess: () => {
					toast.dismiss(loadingToastId);
					toast.success("Password Reset Successful");
				},
			}
		);
	};
	return (
		<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
			<div className='space-y-2'>
				<TextInput
					control={control}
					label='New Password'
					type='password'
					error={errors.password?.message}
					placeholder='Enter your new password'
					name='password'
				/>
				<p className='text-xs text-muted-foreground'>
					Password must be at least 6 characters long and include a number and
					an uppercase letter
				</p>
			</div>

			<TextInput
				control={control}
				label='Confirm New Password'
				type='password'
				placeholder='Confirm your new password'
				error={errors.confirmPassword?.message}
				name='confirmPassword'
			/>

			<Button
				className='w-full bg-primary text-white hover:bg-rose-600'
				disabled={isSubmitting}
			>
				Reset password
			</Button>
		</form>
	);
};

export default PasswordresetForm;
