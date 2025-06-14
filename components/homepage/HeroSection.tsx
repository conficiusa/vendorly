import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative bg-gradient-to-r from-sky-200 via-sky-100 to-amber-100 rounded-2xl overflow-hidden shadow-xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-rose-300 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-amber-300 rounded-full blur-xl"></div>
          </div>

          <div className="relative flex items-center justify-between p-8 lg:p-16">
            {/* Left side content */}
            <div className="flex-1 z-10">
              <div className="mb-8">
                <h2 className="text-6xl lg:text-8xl font-bold text-slate-700 mb-4">
                  SUMMER
                </h2>
                <h2 className="text-6xl lg:text-8xl font-bold text-rose-600 mb-8">
                  SALE
                </h2>
                <Link href={"/discover"}>
                  <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                    SHOP NOW AT UP TO 80% OFF
                  </button>
                </Link>
              </div>
            </div>

            {/* Right side - Product images */}
            <div className="flex-1 relative flex items-center justify-end space-x-8">
              {/* Watch */}
              <div className="relative">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg"></div>
                <div className="absolute inset-2 bg-slate-800 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Sunglasses */}
              <div className="relative">
                <div className="w-32 h-16 lg:w-40 lg:h-20 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full shadow-lg"></div>
                <div className="absolute top-2 left-4 right-4 h-8 lg:h-10 bg-slate-600 rounded-full opacity-60"></div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-amber-200/50 to-rose-200/50 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}