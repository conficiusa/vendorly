"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./user-menu";
import { Search, Heart, X, Menu, Store, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Session } from "@/lib/types/better-auth.types";
import CartIcon from "@/app/components/CartIcon";

interface NavLinkItem {
  name: string;
  href: string;
}

const SearchBar = () => (
  <div className="relative flex-grow max-w-2xl">
    <input
      type="text"
      placeholder="Search products..."
      className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors outline-none text-sm bg-gray-50 focus:bg-white"
    />
    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
      <Search size={18} />
    </button>
  </div>
);

const WishlistIcon = ({ itemCount = 0 }: { itemCount?: number }) => (
  <Link href="/wishlist" className="relative">
    <button
      aria-label="Wishlist"
      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
    >
      <Heart size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  </Link>
);

const Navbar = ({ session }: { session: Session | null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const { scrollY } = useScroll();
  const navbarBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.95)"]
  );

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const navLinks: NavLinkItem[] = [
    { name: "Categories", href: "/categories" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Best Sellers", href: "/bestsellers" },
    { name: "Sale", href: "/sale" },
  ];

  return (
    <motion.header
      style={{ backgroundColor: navbarBackground }}
      className="fixed top-0 inset-x-0 backdrop-blur-sm border-b border-gray-200 z-50"
    >
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-32 h-8 sm:w-36 sm:h-9">
              <Image
                alt="Vendorly"
                src="/logo.png"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={toggleMobileSearch}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {session?.user?.role !== "VENDOR" && (
                <Link
                  href="/store/create"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2"
                >
                  Sell
                </Link>
              )}
              <WishlistIcon itemCount={3} />
              <CartIcon />
            </div>

            {/* Mobile Actions */}
            <div className="flex sm:hidden items-center space-x-2">
              <WishlistIcon itemCount={3} />
              <CartIcon />
            </div>

            {/* Auth Section */}
            {!session?.user ? (
              <div className="hidden sm:flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <Link href="/auth/login">
                  <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/sign-up">
                  <button className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="ml-4 pl-4 border-l border-gray-200">
                <UserMenu user={session.user} />
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors ml-2"
                  aria-label="Menu"
                >
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 flex flex-col">
                <SheetHeader className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg font-semibold">
                      Menu
                    </SheetTitle>
                    <SheetClose asChild>
                      <button className="p-1 hover:bg-gray-100 rounded-md">
                        <X size={18} />
                      </button>
                    </SheetClose>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                  {/* User Section */}
                  {session?.user ? (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Link
                            href="/auth/login"
                            className="block w-full text-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Sign In
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/auth/sign-up"
                            className="block w-full text-center py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Get Started
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  )}

                  {/* Main Navigation */}
                  <div className="px-6 py-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Browse
                    </h3>
                    <nav className="space-y-1">
                      {navLinks.map((item) => (
                        <SheetClose asChild key={item.name}>
                          <Link
                            href={item.href}
                            className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>

                  {/* Quick Actions */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Quick Actions
                    </h3>
                    <nav className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/cart"
                          className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="w-5 h-5 mr-3 flex items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H2M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6.01" />
                            </svg>
                          </div>
                          My Cart
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/wishlist"
                          className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Heart size={16} className="mr-3" />
                          Wishlist
                        </Link>
                      </SheetClose>
                      {session?.user && (
                        <SheetClose asChild>
                          <Link
                            href="/my-orders"
                            className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <div className="w-5 h-5 mr-3 flex items-center justify-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                                <rect
                                  x="8"
                                  y="2"
                                  width="8"
                                  height="4"
                                  rx="1"
                                  ry="1"
                                />
                              </svg>
                            </div>
                            My Orders
                          </Link>
                        </SheetClose>
                      )}
                    </nav>
                  </div>

                  {/* Business Section */}
                  {session?.user?.role !== "VENDOR" && (
                    <div className="px-6 py-4 border-t border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Business
                      </h3>
                      <SheetClose asChild>
                        <Link
                          href="/store/create"
                          className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Store size={16} className="mr-3" />
                          Become a Vendor
                        </Link>
                      </SheetClose>
                    </div>
                  )}

                  {/* Account Section */}
                  {session?.user && (
                    <div className="px-6 py-4 border-t border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Account
                      </h3>
                      <nav className="space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/dashboard"
                            className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <User size={16} className="mr-3" />
                            Dashboard
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            onClick={() => {
                              // Add logout functionality here
                              console.log("Logout clicked");
                            }}
                            className="flex items-center w-full py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <div className="w-5 h-5 mr-3 flex items-center justify-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                              </svg>
                            </div>
                            Sign Out
                          </button>
                        </SheetClose>
                      </nav>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-center">
                    <div className="relative w-24 h-6">
                      <Image
                        alt="Vendorly"
                        src="/logo.png"
                        fill
                        className="object-contain opacity-60"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    © 2024 Vendorly
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <SearchBar />
            <button
              onClick={toggleMobileSearch}
              className="ml-4 p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Navbar;
