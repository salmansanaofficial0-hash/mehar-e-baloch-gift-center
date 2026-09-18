import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Gift, Heart, MapPin, MessageCircle,
  PackageCheck, Sparkles, Star, Truck,
} from 'lucide-react';
import api from '../lib/api';
import { brand, categories } from '../config/brand';
import { testimonials } from '../data/products';

function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-luxe">
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-cream">
        <img src={product.images?.[0] || '/logo.png'} alt={product.name} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy shadow-sm">
          {product.category?.name || 'Gift'}
        </span>
      </Link>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-1 text-gold">
          <Star size={14} fill="currentColor" />
          <span className="ml-1 text-xs font-semibold text-slate-500">{product.rating || '4.8'}</span>
        </div>
        <h3 className="font-display text-xl font-bold text-burgundy">{product.name}</h3>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg font-extrabold text-rust">PKR {Number(product.price).toLocaleString()}</span>
          {product.comparePrice && <span className="text-sm text-slate-400 line-through">PKR {Number(product.comparePrice).toLocaleString()}</span>}
        </div>
        <Link to={`/product/${product.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-burgundy transition hover:text-rust">
          View product <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true')
      .then(({ data }) => {
        const apiProducts = data.data?.products || [];
        setProducts(apiProducts);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-[#fffaf1]">
        <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-rust/10 blur-3xl" />
        <div className="section-shell relative grid min-h-[680px] items-center gap-12 py-14 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
          <div className="relative z-10">
            <div className="eyebrow flex items-center gap-2"><Sparkles size={15} /> Turbat's curated beauty & gift destination</div>
            <h1 className="mt-5 max-w-2xl font-display text-5xl font-bold leading-[1.05] text-burgundy sm:text-6xl lg:text-7xl">
              Gifts that feel <span className="italic text-rust">personal.</span><br />Beauty that feels like you.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover cosmetics, jewelry, handbags, perfumes and thoughtfully arranged gift hampers—selected with care at Mehr-e-Baloch.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="primary-btn px-7 py-4">Explore the collection <ArrowRight className="ml-2" size={18} /></Link>
              <a href={`${brand.primaryWhatsApp}?text=${encodeURIComponent('Assalamualaikum, I would like help choosing a gift.')}`} target="_blank" rel="noopener noreferrer" className="secondary-btn px-7 py-4">
                <MessageCircle className="mr-2" size={18} /> Ask on WhatsApp
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
              <span className="flex items-center gap-2"><BadgeCheck size={18} className="text-rust" /> Carefully selected</span>
              <span className="flex items-center gap-2"><Gift size={18} className="text-rust" /> Custom gifting</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-rust" /> Shop G-31, Turbat</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[570px] lg:mx-0">
            <div className="balochi-pattern absolute -inset-4 rotate-2 rounded-[2.5rem]" />
            <div className="relative overflow-hidden rounded-[2.2rem] border-4 border-white shadow-2xl">
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=88" alt="Premium cosmetics at Mehr-e-Baloch" className="h-[500px] w-full object-cover sm:h-[570px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/65 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-light">Mehr-e-Baloch</p>
                <p className="mt-2 font-display text-3xl font-bold">Made for memorable moments</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:-left-8">
              <div className="rounded-full bg-rust/10 p-3 text-rust"><Heart size={22} fill="currentColor" /></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Need help?</p><p className="font-semibold text-burgundy">We help you choose</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell relative z-10 py-10">
        <div className="grid overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-luxe md:grid-cols-3">
          {[
            { icon: Gift, title: 'Thoughtful gifting', text: 'Personalized hampers for every occasion.' },
            { icon: PackageCheck, title: 'Beautiful presentation', text: 'Carefully packed and ready to delight.' },
            { icon: Truck, title: 'Easy ordering', text: 'Order online or visit our Turbat shop.' },
          ].map(({ icon: Icon, title, text }, index) => (
            <div key={title} className={`flex gap-4 p-6 lg:p-8 ${index ? 'border-t border-[var(--color-border)] md:border-l md:border-t-0' : ''}`}>
              <div className="h-fit rounded-2xl bg-cream p-3 text-rust"><Icon size={23} /></div>
              <div><h3 className="font-display text-lg font-bold text-burgundy">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div><p className="eyebrow">Customer favourites</p><h2 className="page-title mt-2">A little luxury, chosen well</h2></div>
          <Link to="/shop" className="hidden items-center gap-2 text-sm font-bold text-burgundy hover:text-rust sm:flex">Shop all <ArrowRight size={17} /></Link>
        </div>
        {loadingProducts ? <p className="rounded-3xl bg-white p-10 text-center text-slate-500">Loading the collection...</p> : products.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />)}</div> : <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center"><p className="font-display text-2xl font-bold text-burgundy">New products are coming soon</p><p className="mt-2 text-slate-500">Contact us on WhatsApp for the latest available collection.</p></div>}
      </section>

      <section className="bg-[#f4eee2] py-20">
        <div className="section-shell">
          <div className="mx-auto mb-12 max-w-2xl text-center"><p className="eyebrow">Find your favourite</p><h2 className="page-title mt-2">Collections for every style</h2><p className="mt-4 text-slate-600">From everyday beauty essentials to gifts for life's biggest moments.</p></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link key={category.name} to={`/shop?category=${category.slug}`} className={`group relative overflow-hidden rounded-[2rem] ${index === 0 || index === 5 ? 'lg:col-span-2' : ''}`}>
                <img src={category.image} alt={category.name} className="h-80 w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-light">Explore</p><p className="mt-1 font-display text-3xl font-bold">{category.name}</p></div><span className="rounded-full border border-white/40 bg-white/10 p-3 backdrop-blur"><ArrowRight size={20} /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="grid items-center gap-10 rounded-[2.25rem] bg-burgundy px-7 py-10 text-white md:px-12 lg:grid-cols-[1fr_.85fr] lg:py-14">
          <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Made around your moment</p><h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Create a gift they will remember.</h2><p className="mt-4 max-w-xl leading-7 text-white/75">Tell us the occasion, your budget and the person you are celebrating. We will help you shape a beautiful custom gift.</p><Link to="/custom-gift" className="mt-7 inline-flex items-center rounded-full bg-rust px-6 py-3 font-bold text-white transition hover:bg-rust-dark">Plan a custom gift <ArrowRight className="ml-2" size={18} /></Link></div>
          <div className="balochi-pattern rounded-3xl border border-white/10 p-7"><div className="rounded-2xl bg-white/10 p-6 backdrop-blur"><Gift size={36} className="text-gold-light" /><p className="mt-5 font-display text-2xl font-bold">Birthdays, weddings, anniversaries & more</p><p className="mt-3 text-sm leading-6 text-white/70">Available through WhatsApp and in-store consultation.</p></div></div>
        </div>
      </section>

      <section className="section-shell pb-20">
        <div className="mb-10 text-center"><p className="eyebrow">Kind words</p><h2 className="page-title mt-2">Why customers choose us</h2></div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => <blockquote key={item.name} className="card-luxe p-7"><div className="mb-4 flex text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div><p className="leading-7 text-slate-600">“{item.text}”</p><footer className="mt-5 font-bold text-burgundy">{item.name}</footer></blockquote>)}
        </div>
      </section>

      <section className="section-shell mb-16">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-luxe md:flex md:items-stretch">
          <div className="balochi-pattern p-8 text-white md:w-[44%] md:p-10"><MapPin size={30} className="text-gold-light" /><p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-gold-light">Visit our shop</p><h3 className="mt-2 font-display text-3xl font-bold">Right here in Turbat</h3><p className="mt-4 leading-7 text-white/75">{brand.address}</p></div>
          <div className="flex flex-1 flex-col justify-center gap-4 p-8 md:flex-row md:items-center md:justify-center"><a href={brand.primaryWhatsApp} target="_blank" rel="noopener noreferrer" className="primary-btn"><MessageCircle className="mr-2" size={18} /> WhatsApp us</a><Link to="/contact" className="secondary-btn">Directions & contact</Link></div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
