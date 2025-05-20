"use client";

import { Control, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInput } from "@/components/text-input";
import { CreateServiceFormData } from "@/lib/schemas/services/create";
import { WorkingDaysSelect } from "./WorkingDaysSelect";
import { TimeInput } from "./TimeInput";

interface ServiceSchedulingProps {
  control: Control<CreateServiceFormData>;
  errors: FieldErrors<CreateServiceFormData>;
}

export function ServiceScheduling({ control, errors }: ServiceSchedulingProps) {
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>Scheduling</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <WorkingDaysSelect
          control={control}
          error={errors.workingDays?.message}
        />

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Operating Hours</h3>
            <p className="text-sm text-muted-foreground">
              Set the time range when your service is available
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <TimeInput
              control={control}
              name="operatingHours.openAt"
              label="Start Time"
              error={errors.operatingHours?.openAt?.message}
            />

            <TimeInput
              control={control}
              name="operatingHours.closeAt"
              label="End Time"
              error={errors.operatingHours?.closeAt?.message}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <TextInput
            label="Daily Max"
            type="number"
            placeholder="Number of slots per day"
            control={control}
            name="dailyMax"
            error={errors.dailyMax?.message}
          />
          <TextInput
            label="Service Duration (minutes)"
            type="number"
            placeholder="Duration of each slot"
            control={control}
            name="serviceDuration"
            error={errors.serviceDuration?.message}
          />
        </div>
      </CardContent>
    </Card>
  );
}
