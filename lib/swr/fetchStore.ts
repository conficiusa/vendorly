import useSWR from "swr";
import { Store } from "@/prisma/generated/prisma-client";

export const useStore = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
  };
  const { data, error, isLoading } = useSWR<{ data: Store }>(
    "/api/vendors/store",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    store: data?.data,
    error,
    isLoading,
  };
};
