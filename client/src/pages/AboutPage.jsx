import { brand } from '../config/brand';

function AboutPage() {
  return (
    <div className="section-shell py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Our story</p>
          <h1 className="page-title mt-3">{brand.name}</h1>
          <p className="mt-5 text-slate-600">
            {brand.alternateName} — also known as {brand.name} — was founded by {brand.owner} to bring beauty, elegance, and thoughtful gifts to the women of Turbat and beyond. {brand.tagline}.
          </p>
          <p className="mt-4 text-slate-600">
            From premium cosmetics and gold jewelry to stylish handbags and curated gift hampers, our shop at {brand.address} offers a one-stop destination for every special occasion.
          </p>
        </div>
        <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80" alt="Cosmetics and gifts" className="h-[500px] w-full rounded-[2rem] object-cover shadow-luxe" />
      </div>
    </div>
  );
}

export default AboutPage;
