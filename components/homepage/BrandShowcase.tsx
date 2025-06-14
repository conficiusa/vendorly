const brands = [
  'BURBERRY', 'OMEGA', 'ROLEX', 'GUCCI', 'COSTA DEL MAR', 
  'BVLGARI', 'RAY-BAN', 'TISSOT', 'CREED'
];

export default function BrandShowcase() {
  return (
    <section className="py-16">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {brands.map((brand, index) => (
            <button
              key={index}
              className="text-slate-600 hover:text-rose-600 font-semibold text-sm tracking-wide transition-colors duration-200 whitespace-nowrap"
            >
              {brand}
            </button>
          ))}
          <button className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:from-rose-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            SHOW ALL BRANDS
          </button>
        </div>
      </div>
    </section>
  );
}