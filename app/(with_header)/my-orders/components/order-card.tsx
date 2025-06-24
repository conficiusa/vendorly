"use client";

import { formatCurrency, cn } from "@/lib/utils";
import {
  Package,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Check,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

interface OrderCardProps {
  order: OrderWithDetails;
}

const getOrderStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        icon: Clock,
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-100 dark:bg-yellow-900/20",
        label: "Pending",
      };
    case "PROCESSING":
      return {
        icon: Package,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900/20",
        label: "Processing",
      };
    case "SHIPPED":
      return {
        icon: Truck,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-900/20",
        label: "Shipped",
      };
    case "DELIVERED":
      return {
        icon: CheckCircle,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-100 dark:bg-green-900/20",
        label: "Delivered",
      };
    case "CANCELLED":
      return {
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/20",
        label: "Cancelled",
      };
    default:
      return {
        icon: AlertCircle,
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-100 dark:bg-gray-900/20",
        label: "Unknown",
      };
  }
};

const getPaymentStatusConfig = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return {
        color: "text-green-600 dark:text-green-400",
        label: "Paid",
      };
    case "FAILED":
      return {
        color: "text-red-600 dark:text-red-400",
        label: "Failed",
      };
    case "PENDING":
    default:
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        label: "Pending",
      };
  }
};

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Get the most recent transaction status
  const latestTransaction = order.Transaction?.[0];
  const paymentStatus = getPaymentStatusConfig(
    latestTransaction?.status || "PENDING"
  );

  // Group items by store
  const itemsByStore = order.orderItems.reduce(
    (acc, item) => {
      const storeId = item.store.id;
      if (!acc[storeId]) {
        acc[storeId] = {
          store: item.store,
          items: [],
        };
      }
      acc[storeId].items.push(item);
      return acc;
    },
    {} as Record<
      string,
      {
        store: (typeof order.orderItems)[0]["store"];
        items: typeof order.orderItems;
      }
    >
  );

  const handleConfirmDelivery = async (itemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      const res = await fetch("/api/orders/confirm-delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(
          response.error?.message || "Failed to confirm delivery"
        );
      }

      toast.success("Delivery confirmed successfully!");
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm delivery");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleWriteReview = () => {
    // For now, we'll just show a toast. You can implement a review modal or redirect to a review page
    toast.info("Review feature coming soon!");
    // Example: router.push(`/products/${productSlug}/review`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{order.id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span
                  className={cn("text-sm font-medium", paymentStatus.color)}
                >
                  {paymentStatus.label}
                </span>
                {latestTransaction?.paymentMethod && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {latestTransaction.paymentMethod.replace("_", " ")}
                    {latestTransaction.mobileMoneyProvider &&
                      ` • ${latestTransaction.mobileMoneyProvider}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 max-sm justify-between">
            <div className="text-right flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(order.total)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.orderItems.length} item
                {order.orderItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Order Items by Store */}
          {Object.entries(itemsByStore).map(([storeId, { store, items }]) => (
            <div key={storeId} className="space-y-4">
              {/* Store Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={store.name}
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <Link
                  href={`/store/${store.slug}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {store.name}
                </Link>
              </div>

              {/* Store Items */}
              <div className="space-y-3">
                {items.map((item) => {
                  const itemStatus = getOrderStatusConfig(item.status);
                  const StatusIcon = itemStatus.icon;
                  const isUpdating = updatingItems.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        {item.productVariantOption?.attributes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {Object.entries(
                              item.productVariantOption.attributes as Record<
                                string,
                                string
                              >
                            )
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                            itemStatus.bg
                          )}
                        >
                          <StatusIcon
                            className={cn("w-4 h-4", itemStatus.color)}
                          />
                          <span className={itemStatus.color}>
                            {itemStatus.label}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          {/* Confirm Delivery Button */}
                          {(item.status === "PROCESSING" ||
                            item.status === "SHIPPED") && (
                            <Button
                              onClick={() => handleConfirmDelivery(item.id)}
                              disabled={isUpdating}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs"
                            >
                              {isUpdating ? (
                                <>
                                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                                  Confirming...
                                </>
                              ) : (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Confirm Delivery
                                </>
                              )}
                            </Button>
                          )}

                          {/* Review Button */}
                          {item.status === "DELIVERED" && (
                            <Button
                              onClick={() => handleWriteReview()}
                              size="sm"
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-8 px-3 text-xs"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Write Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Delivery Address */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Delivery Address
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.address_line1}
                  {order.address.address_line2 &&
                    `, ${order.address.address_line2}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.city}, {order.address.region}
                </p>
                {order.address.digital_address && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Digital Address: {order.address.digital_address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Order Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Delivery Fee
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatCurrency(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
