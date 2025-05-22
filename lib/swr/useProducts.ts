import { Product, Category } from "@/prisma/generated/prisma-client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ProductWithCategory = Product & {
  Category: Category | null;
};

type PaginationData = {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
  hasMore?: boolean;
};

export type ProductApiResponse = {
  status: string;
  data: ProductWithCategory[];
  pagination: PaginationData;
};

type useProductArgs = {
  page?: number;
  search?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
export function useProducts({
  page = 1,
  search = "",
  limit = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
}: useProductArgs) {
  const { data, error, isLoading, isValidating } = useSWR<ProductApiResponse>(
    `/api/vendors/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    products: data?.data,
    pagination: data?.pagination,
    isValidating,
    isLoading,

    error: error,
  };
}
