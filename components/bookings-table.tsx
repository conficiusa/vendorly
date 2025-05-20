"use client";
import { useState } from "react";
import * as Icons from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock bookings data
const MOCK_BOOKINGS = [
  {
    id: "BK-001",
    service: "iPhone Screen Repair",
    customer: "John Doe",
    email: "john@example.com",
    date: "2024-03-28T10:00:00Z",
    status: "Upcoming",
    price: 149.99,
  },
  {
    id: "BK-002",
    service: "Data Recovery",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2024-03-27T15:30:00Z",
    status: "Completed",
    price: 199.99,
  },
  {
    id: "BK-003",
    service: "Computer Diagnostics",
    customer: "Mike Johnson",
    email: "mike@example.com",
    date: "2024-03-26T14:00:00Z",
    status: "Cancelled",
    price: 79.99,
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "upcoming":
      return "default";
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

export function BookingsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md bg-background p-4 md:p-6 lg:p-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_BOOKINGS.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(booking.date), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>${booking.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Icons.MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
