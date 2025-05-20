import * as Icons from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Mock order data
  const order = {
    id: id,
    status: "Processing",
    date: "March 26, 2024",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St, City, Country",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: "1",
        name: "iPhone 15 Pro",
        variant: "Space Black / 256GB",
        price: 999.99,
        quantity: 1,
        image: "/products/iphone.jpg",
      },
      {
        id: "2",
        name: "AirPods Pro",
        variant: "White",
        price: 249.99,
        quantity: 1,
        image: "/products/airpods.jpg",
      },
    ],
    subtotal: 1249.98,
    shipping: 15.0,
    tax: 125.0,
    total: 1389.98,
    paymentMethod: "Credit Card (**** 4242)",
    estimatedDelivery: "March 28, 2024",
    trackingNumber: "1Z999AA10123456789",
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Processing: "bg-blue-500",
      Shipped: "bg-green-500",
      Delivered: "bg-emerald-500",
      Cancelled: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/orders">
              <Icons.ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Order #{order.id}
            </h1>
            <p className="text-muted-foreground">Placed on {order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Icons.Printer className="h-4 w-4" />
            Print
          </Button>
          <Button className="gap-2">
            <Icons.PackageCheck className="h-4 w-4" />
            Mark as Shipped
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="relative overflow-hidden shadow-none border-none">
            <div
              className={`absolute top-0 left-0 w-0.5 h-full bg-primary/50`}
            />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Order Status
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`font-medium ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icons.Calendar className="h-4 w-4" />
                  <span>Placed on {order.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icons.Hash className="h-4 w-4" />
                  <span>Order #{order.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icons.Truck className="h-4 w-4" />
                  <span>Est. Delivery: {order.estimatedDelivery}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icons.User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{order.customer.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-sm font-medium">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Shipping
                  </span>
                  <span className="text-sm font-medium">
                    ${order.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tax</span>
                  <span className="text-sm font-medium">
                    ${order.tax.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-2xl font-bold">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icons.CreditCard className="h-4 w-4" />
                    <span>{order.paymentMethod}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icons.Package className="h-4 w-4" />
                      <span>Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>List of items in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-16 w-16 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Icons.Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.variant}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
