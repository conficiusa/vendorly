import * as Icons from "lucide-react";
import { ServicesTable } from "@/components/services-table";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings and bookings
          </p>
        </div>
        <Button className="gap-2">
          <Icons.Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="space-y-4">
        <ServicesTable />
      </div>
    </>
  );
}
