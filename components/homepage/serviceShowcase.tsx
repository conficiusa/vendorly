const services = [
  "ELECTRICIANS",
  "PLUMBERS",
  "PAINTERS",
  "CLEANERS",
  "GARDENERS",
  "HANDYMAN",
  "MOVERS",
  "TUTORS",
];

export default function ServiceShowcase() {
  return (
    <section className="py-16 flex justify-center items-center">
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl shadow-lg p-8 border border-rose-100">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Trusted Service Professionals
          </h3>
          <p className="text-slate-600">
            All service providers are verified and insured
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {services.map((service, index) => (
            <button
              key={index}
              className="text-slate-600 hover:text-rose-600 font-semibold text-sm tracking-wide transition-colors duration-200 whitespace-nowrap"
            >
              {service}
            </button>
          ))}
          <button className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:from-rose-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            FIND ALL SERVICES
          </button>
        </div>
      </div>
    </section>
  );
}
