import Navbar from "@/components/navbar";
import { getSession } from "@/lib/auth";
import { fetchCartCount } from "@/lib/queries/user/cart";

import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const cartCount = await fetchCartCount(session?.user.id ?? "");
  return (
    <>
      <Suspense>
        <Navbar session={session} cartCount={cartCount} />
        {children}
      </Suspense>
    </>
  );
}
