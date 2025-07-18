import useSWRInfinite from "swr/infinite";
import { RecombeeScenario } from "@/lib/types/recombee-types";

interface RecommendationResponse {
  success: boolean;
  data: {
    recommId: string;
    recomms: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
      rating: number | null;
      store: string;
      slug: string;
    }>;
    numberNextRecommsCalls: number;
  };
}

export const useRecombeeRecommendations = (
  scenario?: RecombeeScenario,
  itemId?: string
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: RecommendationResponse | null
  ) => {
    // reached the end
    if (previousPageData?.data.recomms.length === 0) return null;
    const params = new URLSearchParams();
    if (scenario) params.append("scenario", scenario);
    if (itemId) params.append("itemId", itemId);

    if (pageIndex === 0) {
      // first page, we don't have `previousPageData`
      params.append("page", pageIndex.toString());
      return `/api/recommendations?${params.toString()}`;
    }

    // add the recommId to the API endpoint for subsequent pages
    if (previousPageData?.data.recommId) {
      params.append("recommId", previousPageData.data.recommId);
    }

    // always append the current page index so each page has a unique key
    params.append("page", pageIndex.toString());

    return `/api/recommendations?${params.toString()}`;
  };

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<RecommendationResponse>(
      getKey,
      async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        return res.json();
      },
      {
        revalidateFirstPage: false,
        revalidateOnFocus: false,
      }
    );

  const recommendations = data
    ? data.map((page) => page.data.recomms).flat()
    : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data.recomms.length === 0;
  const isReachingEnd =
    isEmpty ||
    (data && data[data.length - 1]?.data.numberNextRecommsCalls === 0);

  return {
    recommendations,
    recommId: data?.[0]?.data.recommId,
    isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    size,
    setSize,
    isValidating,
    error,
  };
};
