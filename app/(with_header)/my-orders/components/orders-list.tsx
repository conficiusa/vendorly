"use client";

import { OrderCard } from "./order-card";
import {
  Order,
  OrderItem,
  Product,
  ProductVariantOption,
  Store,
  Address,
  Transaction,
} from "@/prisma/generated/prisma-client";

interface OrderWithDetails extends Order {
  orderItems: (OrderItem & {
    product: Pick<Product, "id" | "name" | "slug" | "images" | "price">;
    productVariantOption: Pick<
      ProductVariantOption,
      "id" | "attributes"
    > | null;
    store: Pick<Store, "id" | "name" | "slug" | "logo">;
  })[];
  address: Address;
  Transaction: Pick<
    Transaction,
    "id" | "status" | "paymentMethod" | "mobileMoneyProvider" | "createdAt"
  >[];
}

interface OrdersListProps {
  orders: OrderWithDetails[];
}

export function OrdersList({ orders }: OrdersListProps) {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
