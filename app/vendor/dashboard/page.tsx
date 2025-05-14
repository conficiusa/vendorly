import * as Icons from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { OverviewChart } from "@/components/overview-chart";
import { RecentActivity } from "@/components/recent-activity";
import { ProductCards } from "@/components/product-cards";
import { RecentProductsTable } from "@/components/recent-products-table";
import { Button } from "@/components/ui/button";
import { MOCK_STORE } from "@/lib/constants/mock";

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${MOCK_STORE.totalSales.toLocaleString()}`}
            description="This month"
            icon="DollarSign"
            trend={{ value: 12.5, isPositive: true }}
            className="animate-fade-in"
          />
          <StatsCard
            title="Total Orders"
            value="432"
            description="This month"
            icon="ShoppingCart"
            trend={{ value: 8.2, isPositive: true }}
            className="animate-fade-in [animation-delay:100ms]"
          />
          <StatsCard
            title="Customers"
            value="265"
            description="Total customers"
            icon="Users"
            trend={{ value: 5.1, isPositive: true }}
            className="animate-fade-in [animation-delay:200ms]"
          />
          <StatsCard
            title="Product Views"
            value="1,824"
            description="This month"
            icon="Eye"
            trend={{ value: 2.3, isPositive: false }}
            className="animate-fade-in [animation-delay:300ms]"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5 mb-6">
        <OverviewChart />
        <div className="col-span-2">
          <RecentActivity />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-6">
        {/* <div className="md:col-span-1 lg:col-span-1">
          <StoreProfileCard />
        </div> */}
        <div className="md:col-span-2 lg:col-span-3">
          <ProductCards />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Products</h2>
          <Button variant="link" className="gap-1 text-primary">
            View All
            <Icons.ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <RecentProductsTable />
      </div>
    </>
  );
}
