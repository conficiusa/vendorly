'use client'
import { useRecombeeRecommendations } from '@/lib/swr/useRecombeeRecommendations';
import ProductCard from './ProductCard';

// const products = [
//   {
//     id: 1,
//     name: "OMEGA Constellation Automatic Chronometer Grey Dial Men's Watch",
//     model: "O12320382106001",
//     image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600",
//     originalPrice: 5150.00,
//     currentPrice: 4850.00,
//     discount: 25,
//     coupon: "$300 coupon"
//   },
//   {
//     id: 2,
//     name: "MICHAEL KORS Colburn Polarized Dark Grey Rectangular Men's Sunglasses",
//     model: "MK2141 300181 56",
//     image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600",
//     originalPrice: 59.00,
//     currentPrice: 39.00,
//     discount: 70
//   },
//   {
//     id: 3,
//     name: "TISSOT T-Classic Automatic III Date Men's Watch",
//     model: "T065.407.11.051.00",
//     image: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=600",
//     originalPrice: 284.99,
//     currentPrice: 199.99,
//     discount: 52
//   },
//   {
//     id: 4,
//     name: "MONTBLANC 4810 Westside Men's Briefcase",
//     model: "118238",
//     image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
//     originalPrice: 819.00,
//     currentPrice: 744.00,
//     discount: 47,
//     coupon: "$75 coupon"
//   }
// ];

export default function FeaturedDeals() {
  const {recommendations}= useRecombeeRecommendations()
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Featured Daily Deals</h2>
        <button className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
          SHOP ALL DEALS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}