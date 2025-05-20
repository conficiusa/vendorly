"use client";

import { useState } from "react";
import { OrdersTable } from "@/components/orders-table";
import { BookingsTable } from "@/components/bookings-table";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("orders");

  // Mock counts for pending items
  const pendingOrders = 3;
  const pendingBookings = 2;

  const tabItems = [
    {
      id: "orders",
      label: "Orders",
      icon: <Icons.Package className="h-4 w-4" />,
      badge:
        pendingOrders > 0 ? (
          <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
            {pendingOrders} pending
          </Badge>
        ) : null,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: <Icons.Calendar className="h-4 w-4" />,
      badge:
        pendingBookings > 0 ? (
          <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
            {pendingBookings} pending
          </Badge>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders & Bookings</h1>
        <p className="text-muted-foreground">
          Manage your product orders and service bookings
        </p>
      </div>

      <div className="flex relative border-b">
        <div className="flex space-x-6">
          {tabItems.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-1 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary/80"
                }`}
              >
                <div className="flex items-center">
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                  {tab.badge}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "orders" ? <OrdersTable /> : <BookingsTable />}
      </div>
    </div>
  );
}
