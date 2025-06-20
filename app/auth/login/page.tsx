"use client";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Carousel } from "@/components/carousel";
import Image from "next/image";
import { carouselSlides } from "@/lib/constants/carousel-data";
import LoginForm from "@/components/login-form";
import { Suspense } from "react";
import GoogleButton from "@/components/google-button";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      {/* Left side - Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 md:w-1/2 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <div className="relative w-[150px] h-[40px] mx-auto">
              <Image
                alt="logo of vendorly"
                src={"/logo.png"}
                fill
                sizes="150px"
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="w-full">
            <GoogleButton className="w-full flex justify-center " />
          </div>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?
            <Link
              href="/auth/sign-up"
              className="font-medium text-rose-600 hover:text-rose-500"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Decorative Carousel */}
      <div className="hidden w-1/2 bg-gradient-to-br from-rose-400 to-rose-600 md:block">
        <div className="flex h-full flex-col items-center justify-center px-12 lg:px-16 text-white">
          <div className="w-full">
            <Carousel slides={carouselSlides} />
          </div>
        </div>
      </div>
    </div>
  );
}
