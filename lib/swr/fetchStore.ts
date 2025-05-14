import useSWR from "swr";
import { Store } from "@/prisma/generated/prisma-client";

export const useStore = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
  };
  const { data, error, isLoading } = useSWR("/api/vendors/store", fetcher, {
    revalidateOnFocus: false,
  });

  console.log(data);
  return {
    store: data?.data as Store,
    error,
    isLoading,
  };
};
