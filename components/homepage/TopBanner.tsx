'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  "SUMMER SALE: OUR BEST PRICES EVER | SHOP NOW",
  "FREE SHIPPING ON ORDERS OVER $99 | ORDER TODAY",
  "NEW ARRIVALS: EXCLUSIVE LUXURY WATCHES | EXPLORE NOW"
];

export default function TopBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-3 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-900/20 to-amber-900/20"></div>
      
      <div className="relative flex items-center justify-center">
        <button
          onClick={prevBanner}
          className="absolute left-4 p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="text-center">
          <p className="text-sm font-medium tracking-wide">
            {banners[currentBanner]}
          </p>
        </div>
        
        <button
          onClick={nextBanner}
          className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
          aria-label="Next banner"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}