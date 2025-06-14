import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { uploadRouter } from "./api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
import Footer from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import Loader from "@/components/loader";

export const metadata: Metadata = {
  title: "Vendorly",
  description:
    "Vendorly is a platform for vendors to manage their business and customers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense fallback={<Loader />}>
          <TooltipProvider>

            <div className="min-h-screen">
              <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
              {children}
              <Toaster richColors />
            </div>
          </TooltipProvider>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
