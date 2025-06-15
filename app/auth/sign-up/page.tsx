import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Carousel } from "@/components/carousel";
import { carouselSlides } from "@/lib/constants/carousel-data";
import Image from "next/image";
import SignupForm from "@/components/signup-form";
import GoogleSignInButton from "@/components/google-button";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      {/* Left side - Decorative */}
      <div className="hidden w-1/2 bg-gradient-to-br from-rose-400 to-rose-600 md:block">
        <div className="flex h-full flex-col items-center justify-center px-12 lg:px-16 text-white">
          <div className="w-full">
            <Carousel slides={carouselSlides} />
          </div>
        </div>
      </div>
      {/* Right side - Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 md:w-1/2 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <div className="relative w-[150px] h-[40px] mx-auto">
              <Image
                alt="logo of vendorly"
                src={"/logo.png"}
                fill
                priority
                className="object-contain"
                sizes="150px"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create an account
            </h1>
            <p className="text-gray-500">Sign up to start your journey</p>
          </div>

          <SignupForm />

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

          <div>
            <GoogleSignInButton className="w-full flex justify-center" />
          </div>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-rose-600 hover:text-rose-500"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
