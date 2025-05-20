'use client'
import { useState } from "react";
import Link from "next/link";
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

// Mock orders data
const MOCK_ORDERS = [
  {
    id: "ORD-7892",
    customer: "John Doe",
    email: "john@example.com",
    status: "Processing",
    total: 999.99,
    items: 2,
    date: "2024-03-25T08:45:20Z",
  },
  {
    id: "ORD-7891",
    customer: "Jane Smith",
    email: "jane@example.com",
    status: "Shipped",
    total: 249.99,
    items: 1,
    date: "2024-03-24T15:30:10Z",
  },
  {
    id: "ORD-7890",
    customer: "Mike Johnson",
    email: "mike@example.com",
    status: "Delivered",
    total: 1499.99,
    items: 3,
    date: "2024-03-23T12:15:45Z",
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "processing":
      return "default";
    case "shipped":
      return "secondary";
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
};

export function OrdersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-4 ">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
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
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md bg-background p-4 md:p-6 lg:p-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ORDERS.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.items} items</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(order.date), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Icons.Eye className="h-4 w-4" />
                      <span className="sr-only">View order</span>
                    </Link>
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