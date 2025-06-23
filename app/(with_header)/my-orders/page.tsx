import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/prisma/generated/prisma-client";
import { OrdersList } from "./components/orders-list";
import { Package, ClipboardList } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function MyOrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch user's orders with all related data
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
              price: true,
            },
          },
          productVariantOption: {
            select: {
              id: true,
              attributes: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
        },
      },
      address: true,
      Transaction: {
        select: {
          id: true,
          status: true,
          paymentMethod: true,
          mobileMoneyProvider: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage your purchases
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>
    </div>
  );
}
