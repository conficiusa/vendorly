"use client";
import { Controller } from "react-hook-form";
import type { Control, Path } from "react-hook-form";
import type { ZodSchema, z } from "zod";
import { cn } from "@/lib/utils";

export const TextAreaInput = <T extends ZodSchema<any, any, any>>({
  control,
  placeholder,
  error,
  rows = 10,
  name,
  required = false,
  label,
  labelClassName,
  className,
}: {
  control: Control<z.infer<T>>;
  className?: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
  rows?: number;
  error?: string;
  name: Path<z.infer<T>>;
  labelClassName?: string;
}) => {
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
                  labelClassName,
                  error && "text-destructive"
                )}
              >
                {label}
              </label>
            )}

            <textarea
              aria-invalid={!!error}
              rows={rows}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              id={name}
              placeholder={placeholder}
              className={cn(
                "w-full rounded-lg border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ",
                error && "border-2 border-destructive focus:border-0",
                className
              )}
              required={required}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  );
};
