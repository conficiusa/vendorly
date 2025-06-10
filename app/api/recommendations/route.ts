import { NextRequest } from "next/server";
import { fetchRecommendedProducts } from "@/lib/utils/recombee";
import { RecombeeScenario } from "@/lib/types/recombee-types";
import { getSession } from "@/lib/auth";
import { getSessionId } from "@/lib/utils/session";
import { BadRequestError } from "../utils/errors";
import Response from "../utils/response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const recommId = searchParams.get("recommId");
    const scenario = searchParams.get("scenario") as RecombeeScenario | null;

    // Get user ID from session or generate anonymous ID
    const session = await getSession();
    const userId = session?.user?.id || (await getSessionId());

    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const response = await fetchRecommendedProducts(
      userId,
      scenario || undefined,
      recommId || undefined
    );

    const recommendations = response.recomms.map((recommendation) => ({
      id: recommendation.id,
      ...recommendation.values,
    }));

    return Response.success({
      recommId: response.recommId,
      recomms: recommendations,
      numberNextRecommsCalls: response.numberNextRecommsCalls,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return Response.error("Failed to fetch recommendations", 500);
  }
}
