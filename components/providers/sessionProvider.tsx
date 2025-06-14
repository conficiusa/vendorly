import { getSession } from "@/lib/auth";
import { fetchSessionId } from "@/lib/utils/session";
import { ReactNode } from "react";

const SessionProvider = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();

  if (!session) {
    const sessionId = await fetchSessionId();
    if (!sessionId) {
      await fetch(`${process.env.BASE_URL}/api/user/initializesession`);
    }
  }
  return <>{children}</>;
};

export default SessionProvider;
