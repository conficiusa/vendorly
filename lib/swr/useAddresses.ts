import useSWR from "swr";

export const useAddress = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
  };
  const { data, error, isLoading } = useSWR("/api/user/address", fetcher, {
    revalidateOnFocus: false,

    //set staletime to a long time
  });
  return {
    addresses: data?.data,
    error,
    isLoading,
  };
};
