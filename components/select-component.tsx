"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { Label } from "./ui/label";

interface SelectComponentProps {
  items: { value: string; label: string }[];
  placeholder: string;
  name: string;
  control?: any;
  label: string;
  empty?: string;
  labelClassName?: string;
  error?: string;
  [key: string]: any;
}

export default function SelectComponent({
  items,
  placeholder,
  name,
  control,
  label,
  labelClassName,
  empty,
  error,
}: SelectComponentProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="w-full space-y-2">
          <Label
            className={cn(
              `block text-sm font-medium text-foreground `,
              labelClassName
            )}
          >
            {label}
          </Label>
          <div>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger
                className={cn(
                  "text-muted-foreground w-full py-[22px] rounded-lg",
                  field?.value && "text-black dark:text-white",
                  error && "border-2 border-destructive"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {items?.length > 0 ? (
                  items?.map((item, index) => (
                    <SelectItem value={item?.value.toString()} key={index}>
                      {item?.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem className="whitespace-wrap" value="">
                    {empty || "no items to choose from"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
            )}
          </div>
        </div>
      )}
    />
  );
}
