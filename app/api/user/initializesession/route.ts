import { addUserToRecombee } from "@/lib/utils/recombee";
import { getSession } from "@/lib/auth";
import { getSessionId } from "@/lib/utils/session";
import Response from "../../utils/response";
import { AppError } from "../../utils/errors";

export async function GET() {
  try {
    const sessionId = await getSessionId();
    const session = await getSession();
    if (session) return Response.success("User already exist");
    await addUserToRecombee(sessionId).catch((err) => {
      throw new AppError("Failed to add user to recombee" + err.message);
    });
    return Response.success({ sessionId });
  } catch (error: any) {
    console.error(error);
    return Response.error({ message: error.message });
  }
}
