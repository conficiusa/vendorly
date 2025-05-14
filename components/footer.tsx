import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-[200px] relative h-[60px]">
              <Image src={"/logo.png"} fill alt="vendorly logo" priority sizes="200px"/>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vendorly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
