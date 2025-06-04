import Navbar from "@/components/navbar";
import { getSession } from "@/lib/auth";
import { fetchCartCount } from "@/lib/queries/user/cart";
import { getSessionId } from "@/lib/utils/session";

import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const sessionId = await getSessionId();
  const cartCount = await fetchCartCount(session?.user.id, sessionId);
  return (
    <>
      <Suspense>
        <Navbar session={session} cartCount={cartCount} />
        {children}
      </Suspense>
    </>
  );
}
