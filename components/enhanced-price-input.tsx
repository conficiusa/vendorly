"use client";

import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import type { Control, Path } from "react-hook-form";
import type { ZodSchema, z } from "zod";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Delete } from "lucide-react";

export const EnhancedPriceInput = <T extends ZodSchema<any, any, any>>({
  control,
  name,
  label,
  error,
  currency = "₵",
}: {
  control: Control<z.infer<T>>;
  name: Path<z.infer<T>>;
  label?: string;
  error?: string;
  currency?: string;
}) => {
  const [open, setOpen] = useState(false);
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <div className="space-y-2 w-full">
          {label && (
            <label className="block text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          <Popover onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between py-[22px] font-normal rounded-lg bg-background shadow-none",
                  error && "border-destructive border-2"
                )}
              >
                <span className={cn(!value && "text-muted-foreground")}>
                  {value
                    ? `${currency} ${formatter.format(value).replace("$", "").trim()}`
                    : `${currency} 0.00`}
                </span>
                <ChevronsUpDown className="size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PriceKeypad
              open={open}
              currency={currency}
              initial={value as number | undefined}
              onConfirm={(val) => onChange(val)}
            />
          </Popover>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  );
};

function PriceKeypad({
  currency,
  initial,
  onConfirm,
  open,
}: {
  currency: string;
  initial?: number;
  open: boolean;
  onConfirm: (val: number | undefined) => void;
}) {
  const [raw, setRaw] = useState(
    initial !== undefined ? initial.toString() : ""
  );

  useEffect(() => {
    if (!open) {
      onConfirm(raw === "" ? undefined : parseFloat(raw));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, raw]);

  const addChar = (ch: string) => {
    setRaw((prev) => {
      if (ch === "." && prev.includes(".")) return prev;
      return prev + ch;
    });
  };

  const removeChar = () => setRaw((prev) => prev.slice(0, -1));

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  });

  const display =
    raw === "" || raw === "0"
      ? "Enter amount"
      : `${currency} ${formatter.format(parseFloat(raw)).replace("GHS", "").trim()}`;

  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

  return (
    <PopoverContent sideOffset={8} align="start" className="p-4 w-80">
      <div className="text-center text-2xl font-semibold mb-3">{display}</div>
      <div className="grid grid-cols-3 gap-3">
        {buttons.map((b) => (
          <Button
            key={b}
            type="button"
            variant="secondary"
            onClick={() => addChar(b)}
            className="py-6 text-lg active:bg-primary/10"
          >
            {b === "." ? "." : b}
          </Button>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={removeChar}
          className="col-span-3 py-3 flex items-center justify-center"
        >
          <Delete className="size-4 mr-1" /> Delete
        </Button>
      </div>
    </PopoverContent>
  );
}
