"use client";

import { Control, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateServiceFormData } from "@/lib/schemas/services/create";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  control: Control<CreateServiceFormData>;
  name: any;
  label: string;
  error?: string;
}

export function TimeInput({ control, name, label, error }: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const formatTime = (
    hour: string = "12",
    minute: string = "00",
    period: string = "AM"
  ) => {
    const validHour = hour || "12";
    const validMinute = minute || "00";
    return `${validHour}:${validMinute} ${period}`;
  };

  const parseTime = (time: string) => {
    const [timeStr, period] = time?.split(" ") || ["00:00", "AM"];
    const [hour, minute] = timeStr.split(":") || ["00", "00"];
    return {
      hour: hour,
      minute: minute,
      period: period,
    };
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const { hour, minute, period } = parseTime(value || "");

        return (
          <div className="grid gap-3" ref={containerRef}>
            <label
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              )}
            >
              {label}
            </label>
            <div className="relative">
              <Input
                type="text"
                value={value || ""}
                placeholder="HH:MM AM/PM"
                readOnly
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "cursor-pointer py-5.5 focus-visible:ring-2 focus-visible:border-none focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  error && "border-2 border-destructive"
                )}
              />
              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-popover text-popover-foreground shadow-md rounded-md border">
                  <div className="p-2 grid grid-cols-[1fr_1fr_100px] gap-2">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground px-2">
                        Hours
                      </div>
                      <div className="grid grid-cols-2 gap-1 max-h-[200px] overflow-y-auto">
                        {hours.map((h) => (
                          <Button
                            type="button"
                            key={h}
                            variant={hour === h ? "default" : "ghost"}
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              onChange(formatTime(h, minute, period));
                            }}
                          >
                            {h}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground px-2">
                        Minutes
                      </div>
                      <div className="grid grid-cols-2 gap-1 max-h-[200px] overflow-y-auto">
                        {minutes.map((m) => (
                          <Button
                            type="button"
                            key={m}
                            variant={minute === m ? "default" : "ghost"}
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              onChange(formatTime(hour, m, period));
                            }}
                          >
                            {m}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground px-2">
                        Period
                      </div>
                      <div className="grid gap-1">
                        {periods.map((p) => (
                          <Button
                            type="button"
                            key={p}
                            variant={period === p ? "default" : "ghost"}
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              onChange(formatTime(hour, minute, p));
                            }}
                          >
                            {p}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      }}
    />
  );
}
