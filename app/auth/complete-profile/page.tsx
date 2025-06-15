import CompleteProfileForm from "@/components/complete-profile-form";
import Image from "next/image";
import Link from "next/link";

export default function CompleteProfilePage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-8 rounded-xl bg-white p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <div className="relative mx-auto h-10 w-40">
            <Image
              src="/logo.png"
              alt="Vendorly logo"
              fill
              priority
              className="object-contain"
              sizes="160px"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Finish setting up your account
          </h1>
          <p className="text-gray-500 text-sm">
            Provide a few more details so we can personalize your experience.
          </p>
        </div>

        {/* Form (address fields are visible by default) */}
        <CompleteProfileForm />

        <div className="text-center text-sm pt-4">
          Already done?{" "}
          <Link
            href="/discover"
            className="font-medium text-rose-600 hover:text-rose-500"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
