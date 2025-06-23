"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./user-menu";
import {
  Search,
  Heart,
  X,
  Menu,
  Star,
  Gift,
  Zap,
  BookOpen,
  UserCircle2,
  Store,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils"; // Import cn for conditional classes
import { Session } from "@/lib/types/better-auth.types";
import CartIcon from "@/app/components/CartIcon";

// Define the type for a navigation link item
interface NavLinkItem {
  name: string;
  href: string;
  icon: React.ReactNode; // Use React.ReactNode for broader compatibility
  color: string;
}

const SearchBar = ({ onSearchToggle }: { onSearchToggle?: () => void }) => (
  <div className="relative flex-grow max-w-lg group">
    <input
      type="text"
      placeholder="Whisper your desires..."
      className="w-full pl-5 pr-12 py-3 rounded-full border-2 border-gray-300 group-hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg focus:shadow-xl outline-none placeholder-gray-400 text-gray-700"
    />
    <button className="absolute right-0 top-0 h-full px-4 text-gray-400 group-hover:text-primary transition-colors duration-300 flex items-center justify-center">
      <Search size={20} strokeWidth={2.5} />
    </button>
    {onSearchToggle && (
      <button
        onClick={onSearchToggle}
        className="absolute left-0 top-0 h-full px-4 text-gray-500 hover:text-primary transition-colors duration-300 lg:hidden"
        aria-label="Close search"
      >
        <X size={24} />
      </button>
    )}
  </div>
);

// Enhanced Icons with Lucide
const WishlistIcon = ({ itemCount = 0 }: { itemCount?: number }) => (
  <Link href="/wishlist" className="relative">
    <button
      aria-label="Wishlist"
      className="p-3 hover:bg-pink-500/10 rounded-full text-gray-700 hover:text-pink-500 transition-all duration-300 transform hover:scale-125 hover:rotate-[10deg] focus:outline-none focus:ring-2 focus:ring-pink-500/50"
    >
      <Heart size={26} strokeWidth={2} />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0  h-5 w-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 ring-2 ring-white">
          {itemCount}
        </span>
      )}
    </button>
  </Link>
);

const Navbar = ({ session }: { session: Session | null }) => {
  // const session = await getSession(); // This needs to be handled client-side if Navbar is a client component
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Framer-motion scroll values for buttery-smooth animations
  const { scrollY } = useScroll();
  const announceHeight = useTransform(scrollY, [0, 120], [48, 0]); // 0-120px scroll shrinks the bar
  const announceOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const categoryHeight = useTransform(scrollY, [0, 120], [60, 0]);
  const categoryOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false); // Close menu if search opens
  };

  // Apply the NavLinkItem type to the navLinks array
  const navLinks: NavLinkItem[] = [
    {
      name: "New Arrivals",
      href: "/new-arrivals",
      icon: <Zap size={20} />,
      color: "text-yellow-400",
    },
    {
      name: "Bestsellers",
      href: "/bestsellers",
      icon: <Star size={20} />,
      color: "text-amber-400",
    },
    {
      name: "Special Offers",
      href: "/special-offers",
      icon: <Gift size={20} />,
      color: "text-red-400",
    },
    {
      name: "Collections",
      href: "/collections",
      icon: <BookOpen size={20} />,
      color: "text-purple-400",
    },
  ];

  // if (isPending) {
  //   // Optional: render a loading skeleton for the navbar
  //   return (
  //     <header className="sticky top-0 bg-white/80 backdrop-blur-xl shadow-lg z-30 animate-pulse">
  //       <div className="h-[50px] bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"></div>
  //       <nav className="container mx-auto h-[84px] px-6 flex justify-between items-center gap-6"></nav>
  //       <div className="h-[65px] border-t border-gray-200/30 bg-white/60 backdrop-blur-sm"></div>
  //     </header>
  //   );
  // }

  return (
    <motion.header
      className={cn(
        "fixed top-0 inset-x-0 bg-white/80 backdrop-blur-xl z-30 font-sans"
      )}
    >
      <motion.div
        style={{ height: announceHeight, opacity: announceOpacity }}
        className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white text-center flex items-center justify-center px-4 text-sm sm:text-base font-semibold tracking-wide shadow-inner hover:opacity-95 overflow-hidden"
      >
        <Link
          href="/special-offers"
          className="flex items-center justify-center gap-2 group"
        >
          <Zap size={20} className="group-hover:animate-ping duration-1000" />
          <span>Celestial Deals: Discover Limited-Time Offers!</span>
          <Zap
            size={20}
            className="group-hover:animate-ping duration-1000 delay-200"
          />
        </Link>
      </motion.div>

      {/* Main Navigation */}
      <nav className="container mx-auto py-4 px-4 sm:px-6 flex justify-between items-center gap-2 sm:gap-4 relative">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group z-10">
          <div className="relative w-[170px] h-[60px] sm:w-[190px] sm:h-[65px] transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-lg">
            <Image
              alt="Vendorly Celestial Store Logo"
              src={"/logo.png"} // Ensure your logo is suitable for this theme
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Search Bar - centered */}
        <div className="hidden lg:flex flex-1 justify-center items-center max-w-xl mx-auto px-4">
          <SearchBar />
        </div>

        {/* Right-side Icons and User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 z-10 flex-shrink-0">
          {/* Mobile Search Icon */}
          <button
            aria-label="Search Products"
            onClick={toggleMobileSearch}
            className="lg:hidden p-2.5 hover:bg-gray-200/70 rounded-full text-gray-700 hover:text-primary transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <Search size={24} strokeWidth={2} />
          </button>
          <div className="hidden lg:flex items-center gap-4">
            {session?.user?.role !== "VENDOR" && (
              <Link
                href="/store/create"
                className="text-sm font-medium text-gray-600 whitespace-nowrap hover:text-primary transition-colors duration-300"
              >
                Become a Vendor
              </Link>
            )}
            <WishlistIcon itemCount={3} />
            <CartIcon />
          </div>
          {/* Mobile Icons */}
          <div className="flex lg:hidden items-center gap-2">
            <WishlistIcon itemCount={3} />
            <CartIcon />
          </div>
          {/* User Authentication / Menu */}
          {!session?.user ? (
            <div className="hidden sm:flex gap-2 items-center">
              <Link href={"/auth/login"}>
                <button className="text-sm font-bold px-5 py-2.5 rounded-full hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40">
                  Sign In
                </button>
              </Link>
              <Link href={"/auth/sign-up"}>
                <button className="text-sm font-bold px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full shadow-md hover:shadow-xl hover:from-primary-dark hover:to-pink-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="ml-1 sm:ml-2">
              <UserMenu user={session.user} />
            </div>
          )}
          {/* Mobile Menu Toggle using Sheet component */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Toggle Menu"
                  className="p-2.5 hover:bg-gray-200/70 rounded-full text-gray-700 hover:text-primary transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {isMobileMenuOpen ? (
                    <X size={26} strokeWidth={2} />
                  ) : (
                    <Menu size={26} strokeWidth={2} />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-4/5 z-50 max-w-sm bg-gradient-to-b from-white via-gray-50 to-gray-100 p-0 flex flex-col"
              >
                <SheetHeader className="p-6 pb-0">
                  <SheetTitle className="text-xl font-semibold text-primary">
                    Menu
                  </SheetTitle>
                  {/* SheetClose is automatically added by SheetContent, or you can place it manually */}
                </SheetHeader>
                <nav className="flex flex-col gap-y-1 p-6 flex-grow overflow-y-auto">
                  {navLinks.map((item) => (
                    <SheetClose asChild key={`mobile-${item.name}`}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200"
                      >
                        <span
                          className={`opacity-90 group-hover:opacity-100 ${item.color}`}
                        >
                          {item.icon}
                        </span>
                        <span className="text-gray-700 group-hover:text-primary font-medium text-lg">
                          {item.name}
                        </span>
                      </Link>
                    </SheetClose>
                  ))}
                  <hr className="my-4 border-gray-300/70" />
                  {session?.user?.role !== "VENDOR" && (
                    <SheetClose asChild>
                      <Link
                        href="/store/create"
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200"
                      >
                        <Store
                          size={22}
                          className="text-primary/80 group-hover:text-primary"
                        />
                        <span className="text-gray-700 group-hover:text-primary font-medium text-lg">
                          Become a Vendor
                        </span>
                      </Link>
                    </SheetClose>
                  )}

                  {!session?.user ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          href={"/auth/login"}
                          className="group flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200"
                        >
                          <UserCircle2
                            size={22}
                            className="text-primary/80 group-hover:text-primary"
                          />
                          <span className="text-gray-700 group-hover:text-primary font-medium text-lg">
                            Sign In
                          </span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href={"/auth/sign-up"}
                          className="group flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200"
                        >
                          <UserCircle2
                            size={22}
                            className="text-primary/80 group-hover:text-primary"
                          />
                          <span className="text-gray-700 group-hover:text-primary font-medium text-lg">
                            Sign Up
                          </span>
                        </Link>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        href={"/dashboard"}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200"
                      >
                        <UserCircle2
                          size={22}
                          className="text-primary/80 group-hover:text-primary"
                        />
                        <span className="text-gray-700 group-hover:text-primary font-medium text-lg">
                          My Account
                        </span>
                      </Link>
                    </SheetClose>
                  )}
                </nav>
                <SheetFooter className="p-6 pt-0 mt-auto">
                  <Link
                    href="/"
                    className="flex-shrink-0 group flex items-center justify-center"
                  >
                    <div className="relative w-[150px] h-[50px] transition-transform duration-300 group-hover:scale-105">
                      <Image
                        alt="Vendorly Logo"
                        src={"/logo.png"}
                        fill
                        className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </Link>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    © {new Date().getFullYear()} Vendorly. All rights reserved.
                  </p>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay - Fullscreen and Animated */}
      {isMobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-[90] flex flex-col items-center justify-center p-6 animate-fadeIn">
          <div className="w-full max-w-md">
            <SearchBar onSearchToggle={toggleMobileSearch} />
          </div>
          <p className="mt-4 text-sm text-gray-500">Press Esc or X to close</p>
        </div>
      )}

      {/* Desktop Category/Navigation Links */}
      <motion.div
        style={{ height: categoryHeight, opacity: categoryOpacity }}
        className="hidden lg:block border-t border-gray-200/50 bg-white/70 backdrop-blur-sm shadow-inner overflow-hidden"
      >
        <div className="container mx-auto px-6 flex justify-center items-center gap-x-8 xl:gap-x-12 text-gray-700 font-medium py-4 transition-all duration-300 ease-in-out">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center gap-2.5 text-base hover:text-primary transition-all duration-300 transform hover:-translate-y-0.5 hover:drop-shadow-md"
            >
              <span
                className={`opacity-90 group-hover:opacity-100 group-hover:animate-pulseOnce transition-opacity duration-300 ${item.color}`}
              >
                {item.icon}
              </span>
              <span className="group-hover:underline underline-offset-[6px] decoration-primary/60 decoration-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-500 group-hover:to-orange-500">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;
