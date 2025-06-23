import { NextRequest } from "next/server";
import { fetchRecommendations } from "@/lib/utils/recombee";
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
    const itemId = searchParams.get("itemId");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // Get user ID from session or generate anonymous ID
    const session = await getSession();
    const userId = session?.user?.id || (await getSessionId());

    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const response = (await fetchRecommendations(userId, {
      scenario: scenario || undefined,
      itemId: itemId || undefined,
      recommId: recommId || undefined,
      limit,
    })) as any;

    const recommendations = response.recomms.map(
      (recommendation: { id: string; values: Record<string, unknown> }) => ({
        id: recommendation.id,
        ...recommendation.values,
      })
    );

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
