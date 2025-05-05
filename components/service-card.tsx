"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Service } from "@/lib/data";

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const priceDisplay = typeof service.price === 'number' 
    ? `$${service.price.toFixed(2)}` 
    : `$${service.price.startingAt.toFixed(2)}/${service.price.unit}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
            {service.category}
          </p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-card-foreground line-clamp-1">{service.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{service.provider.name}</p>
          </div>
          <p className="text-sm font-semibold">{priceDisplay}</p>
        </div>
        
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          {service.duration && (
            <div className="flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              <span>{service.duration}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-current text-yellow-500 mr-1" />
              <span className="text-xs font-medium">{service.rating}</span>
            </div>
            <span className="mx-1.5 text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{service.reviewCount} reviews</span>
          </div>
          <button className="rounded-full bg-secondary p-2 text-xs font-medium hover:bg-secondary/80 transition-colors">
            Book now
          </button>
        </div>
      </div>
    </motion.div>
  );
}