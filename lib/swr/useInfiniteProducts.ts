import useSWRInfinite from "swr/infinite";
import { ProductCard } from "../types/product.types";

type PaginationData = {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
  hasMore?: boolean;
};

export type ProductApiResponse = {
  status: string;
  data: ProductCard;
  pagination: PaginationData;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const useInfiniteProducts = (
  getKey: (pageIndex: number, previousPageData: any) => string | null
) => {
  const { data, error, isLoading, isValidating, setSize, size } =
    useSWRInfinite<ProductApiResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
    });

  return { data, error, isLoading, isValidating, setSize, size };
};
