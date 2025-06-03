import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

const SESSION_COOKIE_NAME = "cart_session_id";
const SESSION_EXPIRY_DAYS = 30;

export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    sessionId = uuid();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      expires: new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return sessionId;
}

export async function clearSessionId() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
