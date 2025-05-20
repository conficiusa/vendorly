import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { toast } from "sonner";

interface DeleteProductsResponse {
  status: "success";
  message: string;
  data: {
    deletedCount: number;
  };
}

const deleteProductsFetcher = async (
  url: string,
  { arg }: { arg: { ids: string[] } }
): Promise<DeleteProductsResponse> => {
  const response = await fetch(`${url}?ids=${arg.ids.join(",")}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete products");
  }

  return response.json();
};

export const useDeleteProducts = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error, data } = useSWRMutation<
    DeleteProductsResponse,
    Error,
    string,
    { ids: string[] }
  >("/api/vendors/products", deleteProductsFetcher, {
    onSuccess: (data) => {
      // Optimistically update the products list
      mutate(
        (key) =>
          typeof key === "string" && key.startsWith("/api/vendors/products"),
        undefined,
        { revalidate: true }
      );
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteProducts = async (ids: string[]) => {
    try {
      await trigger({ ids });
    } catch (error) {
      // Error is handled by onError callback
      console.error("Error deleting products:", error);
    }
  };

  return {
    deleteProducts,
    isMutating,
    error,
    data,
  };
};
