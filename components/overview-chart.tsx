"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_SALES_DATA, MOCK_POPULAR_CATEGORIES } from "@/lib/constants/mock";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChartConfig,
  chartConfig,
  pieChartConfig,
} from "@/lib/configs/chart-config";

export function OverviewChart() {
  const [activeTab, setActiveTab] = useState("revenue");

  const chartColors = {
    primary: "hsl(var(--chart-1))",
    accent: "hsl(var(--chart-2))",
    blue: "hsl(var(--chart-3))",
    yellow: "hsl(var(--chart-4))",
    orange: "hsl(var(--chart-5))",
  };

  const totalVisitors = useMemo(() => {
    return MOCK_POPULAR_CATEGORIES.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card className="col-span-3 shadow-none border-none">
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            View your store sales performance over time
          </CardDescription>
        </div>
        <Tabs
          defaultValue="revenue"
          className="w-[400px]"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        {activeTab === "revenue" && (
          <ChartContainer config={AreaChartConfig}>
            <AreaChart
              accessibilityLayer
              data={MOCK_SALES_DATA}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-4)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}

        {activeTab === "categories" && (
          <div className="flex h-full">
            <div className="w-1/2 h-full">
              {/* <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_POPULAR_CATEGORIES}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {MOCK_POPULAR_CATEGORIES.map((entry, index) => {
                      const colors = [
                        chartColors.primary,
                        chartColors.accent,
                        chartColors.blue,
                        chartColors.yellow,
                      ];
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer> */}
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={MOCK_POPULAR_CATEGORIES}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalVisitors.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Visitors
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="w-1/2 flex flex-col justify-center px-4">
              <h3 className="font-medium mb-4">Top Categories</h3>
              <div className="space-y-3">
                {MOCK_POPULAR_CATEGORIES.map((category, index) => {
                  const colors = [
                    chartColors.primary,
                    chartColors.accent,
                    chartColors.blue,
                    chartColors.yellow,
                  ];
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      <span className="text-sm">{category.name}</span>
                      <span className="text-sm font-medium ml-auto">
                        {category.value}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <>
            {/* <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "iPhone 15 Pro", sales: 78 },
                  { name: "MacBook Air M3", sales: 45 },
                  { name: "iPad Pro 13", sales: 32 },
                  { name: "Airpods Pro 2", sales: 120 },
                  { name: "Apple Watch", sales: 65 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill={chartColors.accent}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                  name="Units Sold"
                />
              </BarChart>
            </ResponsiveContainer> */}
            <ChartContainer config={chartConfig}>
              <BarChart
                // accessibilityLayer
                data={[
                  { name: "iPhone 15 Pro", sales: 78 },
                  { name: "MacBook Air M3", sales: 45 },
                  { name: "iPad Pro 13", sales: 32 },
                  { name: "Airpods Pro 2", sales: 120 },
                  { name: "Apple Watch", sales: 65 },
                ]}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
              </BarChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
