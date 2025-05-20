import { Category, CategoryType } from "@/prisma/generated/prisma-client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories(type: CategoryType) {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    `/api/vendors/category?type=${type}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    categories: data,
    isLoading,
    isError: error,
    mutate,
  };
}
