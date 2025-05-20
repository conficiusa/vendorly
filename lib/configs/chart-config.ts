import { ChartConfig } from "@/components/ui/chart";

export const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const pieChartConfig = {
  value: {
    label: "Value",
  },
  smartphones: {
    label: "Smartphones",
    color: "var(--color-chart-1)",
  },
  laptops: {
    label: "Laptops ",
    color: "var(--color-chart-2)",
  },
  audio: {
    label: "Audio",
    color: "var(--color-chart-3)",
  },
  tablets: {
    label: "Tablets",
    color: "var(--color-chart-4)",
  },
} satisfies ChartConfig;

export const AreaChartConfig = {
  name: {
    label: "name",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;
