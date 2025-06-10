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
      images: string;
      category: string;
      rating: number | null;
      store: string;
      slug: string;
    }>;
    numberNextRecommsCalls: number;
  };
}

export const useRecombeeRecommendations = (scenario?: RecombeeScenario) => {
  const getKey = (
    pageIndex: number,
    previousPageData: RecommendationResponse | null
  ) => {
    // reached the end
    if (previousPageData?.data.recomms.length === 0) return null;

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/recommendations?scenario=${scenario}`;

    // add the recommId to the API endpoint
    return `/api/recommendations?scenario=${scenario}&recommId=${previousPageData?.data.recommId}`;
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
    isEmpty || (data && data[data.length - 1]?.data.recomms.length < 10);

  return {
    recommendations,
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
