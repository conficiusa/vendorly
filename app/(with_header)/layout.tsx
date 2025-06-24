import Navbar from "@/components/navbar";
import { getSession } from "@/lib/auth";

import { Suspense } from "react";

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <>
      <Suspense>
        <Navbar session={session} />
        <main className="pt-18">{children}</main>
      </Suspense>
      {modal}
    </>
  );
}
