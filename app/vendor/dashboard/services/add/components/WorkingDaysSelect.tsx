"use client";

import { Control, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { CreateServiceFormData } from "@/lib/schemas/services/create";

const workingDays = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

interface WorkingDaysSelectProps {
  control: Control<CreateServiceFormData>;
  error?: string;
}

export function WorkingDaysSelect({ control, error }: WorkingDaysSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Working Days
      </label>
      <Controller
        control={control}
        name="workingDays"
        render={({ field: { value, onChange } }) => (
          <div className="flex flex-wrap gap-2">
            {workingDays.map((day) => (
              <Button
                key={day.value}
                type="button"
                variant={value?.includes(day.value) ? "default" : "outline"}
                className="gap-2"
                onClick={() => {
                  const newValue = value?.includes(day.value)
                    ? value.filter((v) => v !== day.value)
                    : [...(value || []), day.value];
                  onChange(newValue);
                }}
              >
                {value?.includes(day.value) && <Check className="h-4 w-4" />}
                {day.label}
              </Button>
            ))}
          </div>
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
