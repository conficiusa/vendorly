"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Store, ArrowRight } from "lucide-react";

export default function StoreSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="rounded-full bg-primary/10 p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <Store className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Store Created Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Your store has been created and is now ready for customers.
          Start adding your products and services to begin selling.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/store/dashboard"
            className="block w-full bg-primary text-primary-foreground rounded-lg px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Store Dashboard
          </Link>
          
          <Link
            href="/marketplace"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Back to Marketplace
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}