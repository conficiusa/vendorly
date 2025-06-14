import HeroSection from "@/components/homepage/HeroSection";
import CategoryGrid from "@/components/homepage/CategoryGrid";
import BrandShowcase from "@/components/homepage/BrandShowcase";
import FeaturedDeals from "@/components/homepage/FeaturedDeals";
import TopBanner from "@/components/homepage/TopBanner";
import ServiceShowcase from "@/components/homepage/serviceShowcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      <TopBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 text-center">
          <p className="text-sm text-slate-600">
            Authenticity Guaranteed and 1-5 Year Warranty On All Watches{" "}
            <span className="text-rose-600 hover:text-rose-700 cursor-pointer underline font-medium">
              Learn More
            </span>
          </p>
        </div>
      </div>

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategoryGrid />
        <ServiceShowcase />
        <BrandShowcase />
        <FeaturedDeals />
      </div>
    </main>
  );
}
