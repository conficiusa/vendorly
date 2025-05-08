"use client";
import { Controller } from "react-hook-form";
import type { Control, Path } from "react-hook-form";
import type { ZodSchema, z } from "zod";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const TextInput = <T extends ZodSchema<any, any, any>>({
  control,
  type = "text",
  placeholder,
  error,
  name,
  required = false,
  label,
  labelClassName,
}: {
  control: Control<z.infer<T>>;
  type?: "text" | "password" | "email" | "tel";
  placeholder?: string;
  required?: boolean;
  label?: string;
  error?: string;
  name: Path<z.infer<T>>;
  labelClassName?: string;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = () => {
    if (type === "password" && showPassword) return "text";
    return type;
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <div>
          <div className="space-y-2">
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  `block text-sm font-medium text-foreground `,
                  labelClassName
                )}
              >
                {label}
              </label>
            )}

            <div className="relative">
              <input
                aria-invalid={!!error}
                type={inputType()}
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                id={name}
                placeholder={placeholder}
                className={cn(
                  "w-full rounded-lg border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ",
                  error && "ring-2 ring-destructive",
                  type === "password" && "pr-10"
                )}
                required={required}
              />
              {type === "password" && (
                <WhichEye
                  showPassword={showPassword}
                  togglePassword={togglePassword}
                />
              )}
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  );
};

type WhichEyeProps = {
  showPassword: boolean;
  togglePassword: () => void;
};
const WhichEye = ({ showPassword, togglePassword }: WhichEyeProps) => {
  if (showPassword)
    return (
      <EyeOff
        className="absolute top-3 right-4"
        onClick={() => togglePassword()}
      />
    );
  return (
    <Eye className="absolute top-3 right-4" onClick={() => togglePassword()} />
  );
};
