'use client';

import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  model: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  coupon?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Discount Badge */}
          <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            {product.discount}% OFF
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 z-10"
          >
            <Heart 
              className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} 
            />
          </button>

          {/* Quick Add to Cart - appears on hover */}
          <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-2 z-10">
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="font-semibold text-slate-800 mb-2 text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mb-4">{product.model}</p>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-800">
                ${product.currentPrice.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500 line-through">
                Was: ${product.originalPrice.toFixed(2)}
              </span>
            </div>
            
            {product.coupon && (
              <div className="text-xs text-rose-600 font-medium">
                after {product.coupon}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}