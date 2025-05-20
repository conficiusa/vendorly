"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, Controller } from "react-hook-form";
import { Label } from "./ui/label";

type ComboboxProps = {
  items: {
    value: string;
    label: string;
  }[];
  placeholder?: string;
  control: Control<any>;
  name: string;
  label?: string;
  isLoading?: boolean;
  emptyText?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
};

export function Combobox({
  items,
  placeholder,
  control,
  name,
  label,
  isLoading,
  error,
  emptyText = "No items found.",
  searchPlaceholder = "Search...",
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <div className="space-y-3">
            {label && (
              <Label className={cn(error && "text-destructive")}>{label}</Label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between py-[22px] font-normal rounded-lg bg-background shadow-none",
                    !field.value && "font-normal text-muted-foreground",
                    error && "border-destructive border-2"
                  )}
                  disabled={disabled || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : field.value ? (
                    items.find((item) => item.value === field.value)?.label
                  ) : (
                    <span className="text-muted-foreground font-normal">
                      {placeholder || "Select item..."}
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-popover-content-width-same-as-its-trigger max-h-popover-content-max-height-same-as-its-trigger"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    disabled={isLoading}
                  />
                  <CommandList>
                    <CommandEmpty isLoading={isLoading}>
                      {emptyText}
                    </CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          keywords={[item.label]}
                          onSelect={(currentValue) => {
                            field.onChange(
                              currentValue === field.value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          {item.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              field.value === item.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
            {error && (
              <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
            )}
        </div>
      )}
    />
  );
}
