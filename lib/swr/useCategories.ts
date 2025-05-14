import { Category } from "@/prisma/generated/prisma-client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/api/vendors/category",
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
