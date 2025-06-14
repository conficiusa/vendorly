import { Order, User } from "@/prisma/generated/prisma-client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type OrderWithCustomer = Order & {
  user: Pick<User, "id" | "first_name" | "last_name" | "email">;
  _count: {
    orderItems: number;
  };
  orderItems: {
    status: string;
  }[];
};

export type PaginationData = {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
  hasMore?: boolean;
};

export type OrdersApiResponse = {
  status: string;
  data: OrderWithCustomer[];
  pagination: PaginationData;
};

type UseOrdersArgs = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export const useOrders = ({
  page = 1,
  limit = 20,
  search = "",
  status = "all",
}: UseOrdersArgs = {}) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) query.append("search", search);
  if (status && status !== "all") query.append("status", status.toUpperCase());

  const { data, error, isLoading, isValidating } = useSWR<{
    success: boolean;
    data: {
      orders: OrderWithCustomer[];
      pagination: PaginationData;
    };
  }>(`/api/vendors/orders?${query.toString()}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return {
    orders: data?.data.orders,
    pagination: data?.data.pagination,
    isLoading,
    isValidating,
    error,
  };
};
