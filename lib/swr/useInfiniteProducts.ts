import useSWRInfinite from "swr/infinite";
import { ProductApiResponse } from "./useProducts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const useInfiniteProducts = (
    getKey: (pageIndex: number, previousPageData: any) => string | null
) => {
  const { data, error, isLoading, isValidating, setSize, size } =
    useSWRInfinite<ProductApiResponse>(getKey, fetcher);

  return { data, error, isLoading, isValidating, setSize, size };
};
