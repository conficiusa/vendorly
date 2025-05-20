import { Service, Category } from "@/prisma/generated/prisma-client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ServiceWithCategory = Service & {
  Category: Category | null;
};

type PaginationData = {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
  hasMore?: boolean;
};

export type ServiceApiResponse = {
  status: string;
  data: ServiceWithCategory[];
  pagination: PaginationData;
};

type useServiceArgs = {
  page?: number;
  search?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
export function useServices({
  page = 1,
  search = "",
  limit = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
}: useServiceArgs) {
  const { data, error, isLoading, isValidating } = useSWR<ServiceApiResponse>(
    `/api/vendors/services?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    services: data?.data,
    pagination: data?.pagination,
    isValidating,
    isLoading,
    error: error,
  };
}
