import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductImages from "./components/product-images";
import ProductDetails from "./components/product-details";
import { tryCatch } from "@/lib/utils";
import { fetchProduct } from "@/lib/queries/products/fetchProduct";
import { fetchSessionId } from "@/lib/utils/session";
import { getSession } from "@/lib/auth";

export default async function Page({ params }: { params: Promise<any> }) {
  const [{ slug }, sessionId, session] = await Promise.all([
    params,
    fetchSessionId(),
    getSession(),
  ]);
  const { data: product, error } = await tryCatch(
    fetchProduct(slug, undefined, session?.user?.id, sessionId)
  );

  if (!product || error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/discover"
            className="text-primary hover:text-primary/80 inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImages product={product} />
          <ProductDetails product={product} />
        </div>
      </main>
    </div>
  );
}
