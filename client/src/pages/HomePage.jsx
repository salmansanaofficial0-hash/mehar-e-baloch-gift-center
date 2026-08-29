import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Sparkles, Star, Truck } from 'lucide-react';
import api from '../lib/api';
import { categories as fallbackCategories, testimonials } from '../data/products';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get('/products?featured=true');
        setProducts(data);
      } catch (error) {
        console.error('Failed to load featured products', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <section className="section-shell grid items-center gap-8 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex rounded-full border border-[#d7b988] bg-[#fff7ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
            Thoughtful gifting, beautifully wrapped
          </span>
          <h1 className="mt-6 max-w-xl font-display text-5xl font-bold leading-tight text-burgundy md:text-6xl">
            Gifts That Speak From The Heart
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Discover handcrafted gifts, luxury hampers, and personalized keepsakes for every meaningful moment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/shop" className="primary-btn">Shop Collection <ArrowRight className="ml-2" size={18} /></Link>
            <Link to="/custom-gift" className="secondary-btn">Request Custom Gift</Link>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
            <div><p className="font-display text-3xl font-bold text-burgundy">2k+</p><p className="text-sm text-slate-500">Happy Gifts</p></div>
            <div><p className="font-display text-3xl font-bold text-burgundy">4.9/5</p><p className="text-sm text-slate-500">Customer Rating</p></div>
            <div><p className="font-display text-3xl font-bold text-burgundy">24/7</p><p className="text-sm text-slate-500">Support</p></div>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] shadow-luxe">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
              alt="Gift hamper"
              className="h-[560px] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Curated for</p>
            <p className="font-display text-2xl font-bold text-burgundy">Special Moments</p>
          </div>
        </div>
      </section>

      <section className="section-shell py-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Gift, title: 'Luxury Gift Hampers', text: 'Beautifully curated premium selections.' },
            { icon: Sparkles, title: 'Custom Keepsakes', text: 'Personalized gifting for every occasion.' },
            { icon: Truck, title: 'Fast Delivery', text: 'Reliable nationwide shipping and care.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-luxe flex items-start gap-4 p-6">
              <div className="rounded-full bg-[#f8efe7] p-3 text-burgundy"><Icon size={22} /></div>
              <div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Featured</p>
            <h2 className="page-title mt-2">Best Sellers</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-burgundy">View all</Link>
        </div>

        {loading ? (
          <div className="text-slate-500">Loading products...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="card-luxe overflow-hidden">
                <div className="relative">
                  <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'} alt={product.name} className="h-72 w-full object-cover" />
                  <div className="absolute right-4 top-4 rounded-full bg-white/90 px-2 py-1 text-sm font-medium text-burgundy">{product.category?.name || 'Gift'}</div>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <h3 className="font-semibold text-slate-800">{product.name}</h3>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xl font-bold text-burgundy">PKR {product.price}</span>
                    {product.comparePrice && <span className="text-sm text-slate-400 line-through">PKR {product.comparePrice}</span>}
                  </div>
                  <Link to={`/product/${product.slug}`} className="mt-5 inline-flex rounded-full border border-burgundy px-4 py-2 text-sm font-medium text-burgundy transition hover:bg-[#faf3f5]">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#f7efe9] py-20">
        <div className="section-shell">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Shop by category</p>
            <h2 className="page-title mt-2">Gift collections for every occasion</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {fallbackCategories.map((category) => (
              <div key={category.name} className="group relative overflow-hidden rounded-[2rem]">
                <img src={category.image} alt={category.name} className="h-80 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a0b17]/80 via-[#2a0b17]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="font-display text-2xl font-semibold">{category.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Testimonials</p>
          <h2 className="page-title mt-2">Loved by our customers</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="card-luxe p-7">
              <div className="mb-4 flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600">“{item.text}”</p>
              <p className="mt-5 font-semibold text-burgundy">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell mb-20">
        <div className="rounded-[2rem] bg-burgundy px-8 py-10 text-white md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#f7d7b0]">Exclusive offer</p>
            <h3 className="mt-2 font-display text-3xl font-bold">Save up to 25% on curated hampers</h3>
          </div>
          <Link to="/shop" className="mt-5 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-burgundy md:mt-0">Shop now</Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;
