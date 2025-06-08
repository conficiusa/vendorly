import { getSession } from "@/lib/auth";
import { getSessionId } from "@/lib/utils/session";
import Response from "../../utils/response";
import { queueAddUser } from "@/lib/actions/recombee";

export async function GET() {
  try {
    const sessionId = await getSessionId();
    const session = await getSession();
    if (session) return Response.success("User already exist");
    await queueAddUser(sessionId);
    return Response.success({ sessionId });
  } catch (error: any) {
    console.error(error);
    return Response.error({ message: error.message });
  }
}
