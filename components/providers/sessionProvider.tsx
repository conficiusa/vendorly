"use client";

import { authClient } from "@/lib/auth-client";
import { ReactNode, useEffect } from "react";

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    const initializeSession = async () => {
      if (!isPending && !data?.user) {
        await fetch("/api/user/initializesession");
      }
    };
    initializeSession();
  }, [data, isPending]);

  return <>{children}</>;
};

export default SessionProvider;
