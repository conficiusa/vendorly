"use client";
import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { Product } from "@/prisma/generated/prisma-client";
import { cn } from "@/lib/utils";

const ProductImages = ({product}:{product:Product}) => {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isImageTransitioning, setIsImageTransitioning] = React.useState(false);
  const [slideDirection, setSlideDirection] = React.useState<
    "left" | "right" | undefined
        >("left");
    
  const handlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => previousImage(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

    const nextImage = () => {
      if (!isImageTransitioning) {
        setSlideDirection("left");
        setIsImageTransitioning(true);
        setActiveImageIndex((prev) =>
          prev === product.images.length - 1 ? 0 : prev + 1
        );
        setTimeout(() => setIsImageTransitioning(false), 300);
      }
    };

    const previousImage = () => {
      if (!isImageTransitioning) {
        setSlideDirection("right");
        setIsImageTransitioning(true);
        setActiveImageIndex((prev) =>
          prev === 0 ? product.images.length - 1 : prev - 1
        );
        setTimeout(() => setIsImageTransitioning(false), 300);
      }
    };

  

  return (
    <div className="space-y-4">
      <div
        {...handlers}
        className="relative aspect-square rounded-xl overflow-hidden bg-secondary"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeImageIndex}
            initial={{
              opacity: 0,
              x: slideDirection === "left" ? 300 : -300,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: slideDirection === "left" ? -300 : 300,
            }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[activeImageIndex]}
              alt={`${product.name} - Image ${activeImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <button
          onClick={previousImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background/90 transition-colors"
          disabled={isImageTransitioning}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background/90 transition-colors"
          disabled={isImageTransitioning}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => !isImageTransitioning && setActiveImageIndex(index)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
              index === activeImageIndex
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-primary/50"
            )}
          >
            <Image
              src={image}
              alt={`${product.name} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
