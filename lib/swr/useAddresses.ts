import { Address } from "@/prisma/generated/prisma-client";
import useSWR from "swr";

export const useAddress = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
  };
  const { data, error, isLoading } = useSWR("/api/user/address", fetcher, {
    //set staletime to a long time
    revalidateOnFocus: false,
    
  });
  return {
    addresses: data?.data?.data as Address[],
    error,
    isLoading,
  };
};
