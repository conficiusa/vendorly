'use client';

import { useState } from 'react';
import { Search, User, ShoppingBag, Phone, MessageCircle } from 'lucide-react';

const navigationItems = [
  'Shop By Brand', "Men's", 'Ladies', 'Watches', 'Jewelry', 'Handbags', 
  'Sunglasses', 'Beauty', 'Apparel', 'Shoes', 'Pre-owned', 'Gifts', 
  'Clearance', 'Sale'
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(3);

  return (
    <header className="bg-white shadow-sm border-b border-rose-100">
      {/* Top row with contact and account info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 text-sm text-slate-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
              <span>or</span>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Call (877) 834-1434</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-wider text-transparent bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text">
              JOMASHOP
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by brand or model"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-rose-400" />
            </div>
          </div>

          {/* Account and Cart */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors duration-200">
              <User className="w-5 h-5 text-slate-600" />
            </button>
            <button className="relative p-2 hover:bg-rose-50 rounded-lg transition-colors duration-200">
              <ShoppingBag className="w-5 h-5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gradient-to-r from-rose-50 to-amber-50 border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 overflow-x-auto">
            <div className="flex space-x-8 min-w-max">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  className={`text-sm font-medium whitespace-nowrap hover:text-rose-600 transition-colors duration-200 ${
                    item === 'Sale' ? 'text-rose-600' : 'text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}