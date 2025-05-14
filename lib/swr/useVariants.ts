import { VariantAttribute } from "@/prisma/generated/prisma-client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useVariants(categoryId: string | undefined) {
  const { data, error, isLoading } = useSWR<VariantAttribute[]>(
    categoryId
      ? `/api/vendors/products/template-variants/?categoryId=${categoryId}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    variants: data,
    isLoading,
    isError: error,
    error: error ? (error as Error).message : null,
  };
}
