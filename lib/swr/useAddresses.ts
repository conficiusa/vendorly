import useSWR from "swr";

export const useAddress = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
  };
  const { data, error, isLoading } = useSWR("/api/user/address", fetcher);
  return {
    addresses: data?.data,
    error,
    isLoading,
  };
};
