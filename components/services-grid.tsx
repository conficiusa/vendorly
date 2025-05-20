'use client'
import { useState } from "react";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MOCK_SERVICES } from "@/lib/constants/mock";
import Image from "next/image";

export function ServicesGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="technical-support">Technical Support</SelectItem>
              <SelectItem value="data-services">Data Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_SERVICES.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover w-full h-full"
              />
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm"
              >
                {service.category}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <div className="flex items-center text-sm">
                  <Icons.DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-bold">{service.price.toFixed(2)}</span>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <Icons.Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">1 hour</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icons.Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Bookings:</span>
                  <span className="font-medium">{service.sales}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2">
                <Icons.Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button className="flex-1 gap-2">
                <Icons.Calendar className="h-4 w-4" />
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}