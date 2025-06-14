import Navbar from "@/components/navbar";
import { getSession } from "@/lib/auth";

import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <>
      <Suspense>
        <Navbar session={session} />
        <main className="pt-36 lg:pt-54">{children}</main>
      </Suspense>
    </>
  );
}
