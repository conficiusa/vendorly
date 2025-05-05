"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
  className?: string;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onChange, 
  className 
}: CategoryFilterProps) {
  return (
    <div className={cn("flex overflow-x-auto pb-2 hide-scrollbar", className)}>
      <div className="flex space-x-2">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;
          return (
            <button
              key={category}
              onClick={() => onChange(category)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="selectedCategory"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  style={{ zIndex: -1 }}
                />
              )}
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}