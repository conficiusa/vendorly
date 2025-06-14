import Image from "next/image";

const productCategories = [
  {
    name: "Men's Watches",
    image:
      "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-slate-600 to-slate-800",
    type: "product",
  },
  {
    name: "Ladies Watches",
    image:
      "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-rose-400 to-rose-600",
    type: "product",
  },
  {
    name: "Sunglasses",
    image:
      "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-amber-500 to-orange-600",
    type: "product",
  },
  {
    name: "Handbags",
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-amber-600 to-orange-700",
    type: "product",
  },
  {
    name: "Luxury Pens",
    image:
      "https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-slate-700 to-slate-900",
    type: "product",
  },
  {
    name: "Beauty",
    image:
      "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-rose-300 to-rose-500",
    type: "product",
  },
];

const serviceCategories = [
  {
    name: "Electricians",
    image:
      "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-yellow-500 to-orange-600",
    type: "service",
    icon: "⚡",
  },
  {
    name: "Plumbers",
    image:
      "https://images.pexels.com/photos/8486944/pexels-photo-8486944.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-blue-500 to-blue-700",
    type: "service",
    icon: "🔧",
  },
  {
    name: "Painters",
    image:
      "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-green-500 to-green-700",
    type: "service",
    icon: "🎨",
  },
  {
    name: "Cleaners",
    image:
      "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-purple-500 to-purple-700",
    type: "service",
    icon: "🧽",
  },
  {
    name: "Gardeners",
    image:
      "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-green-400 to-green-600",
    type: "service",
    icon: "🌱",
  },
  {
    name: "Handyman",
    image:
      "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-orange-500 to-red-600",
    type: "service",
    icon: "🔨",
  },
];

function CategoryCard({
  category,
  className = "",
}: {
  category: any;
  className?: string;
}) {
  return (
    <div className={`group cursor-pointer  ${className}`}>
      <div className="text-center flex flex-col items-center justify-center">
        <div className="relative mx-auto mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              sizes="80px"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>
            
          </div>
          
        </div>
        <p className="text-sm font-medium text-slate-700 group-hover:text-rose-600 transition-colors duration-200">
          {category.name}
        </p>
      </div>
    </div>
  );
}

export default function CategoryGrid() {
  return (
    <div className="space-y-16">
      {/* Products section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Shop Premium Products
          </h2>
          <p className="text-slate-600">
            Authentic luxury goods at unbeatable prices
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {productCategories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>

      {/* Services section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Find Professional Services
          </h2>
          <p className="text-slate-600">
            Verified professionals ready to help
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mx-auto">
          {serviceCategories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
