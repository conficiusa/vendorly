import { ShoppingBag, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className="mb-12">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        <div className="relative flex flex-col md:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="flex-1 text-white mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-yellow-300" />
              <span className="text-lg font-medium">Limited Time Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Summer Sale
              <span className="block text-2xl md:text-3xl text-yellow-300">
                Up to 70% OFF
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-6 max-w-md">
              Discover amazing deals on trending products. Don't miss out on
              exclusive offers!
                      </p>
            <div className="flex space-x-4">
            <Link href="/discover?category=trending">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg">
                Shop Trending Now
              </button>
            </Link>
            <Link href="/discover?category=sale">
              <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200">
                  View All Deals
                </button>
              </Link>
            </div>
          </div>
          {/* Right Content - Stats */}
          <div className="flex space-x-8 text-white">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-blue-100">Products</div>
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="text-2xl font-bold">70%</div>
              <div className="text-blue-100">Max Discount</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
