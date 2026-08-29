import { Link } from 'react-router-dom';
import { Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';

const product = {
  name: 'Royal Celebration Hamper',
  slug: 'royal-celebration-hamper',
  price: 3500,
  comparePrice: 4200,
  category: 'Gift Baskets',
  rating: 4.8,
  description: 'A premium gifting basket with luxury treats, elegant packaging, and thoughtful finishing touches designed for unforgettable moments.',
  images: [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545231027-637d2f6210f8?auto=format&fit=crop&w=1200&q=80',
  ],
  stock: 12,
};

function ProductDetailPage() {
  return (
    <div className="section-shell py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-[#f1e6de] bg-white p-3 shadow-luxe">
            <img src={product.images[0]} alt={product.name} className="h-[520px] w-full rounded-[1.4rem] object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {product.images.map((image, index) => (
              <button key={image} className={`overflow-hidden rounded-2xl border ${index === 0 ? 'border-burgundy' : 'border-[#f0e7e0]'}`}>
                <img src={image} alt={`${product.name} ${index + 1}`} className="h-28 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-burgundy">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3 text-gold">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            <span className="text-sm font-medium text-slate-600">{product.rating} / 5</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-bold text-burgundy">PKR {product.price}</span>
            <span className="text-lg text-slate-400 line-through">PKR {product.comparePrice}</span>
          </div>

          <p className="mt-6 text-slate-600">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-[#eadbc8] bg-white px-3 py-2">
              <button className="rounded-full p-2 hover:bg-[#f8efe7]"><Minus size={16} /></button>
              <span className="w-5 text-center font-medium">1</span>
              <button className="rounded-full p-2 hover:bg-[#f8efe7]"><Plus size={16} /></button>
            </div>
            <button className="primary-btn"><ShoppingCart className="mr-2" size={18} /> Add to Cart</button>
          </div>

          <div className="mt-8 grid gap-3 rounded-[1.5rem] bg-[#fffaf6] p-4">
            <div className="flex items-center gap-3 text-slate-600"><Truck size={18} className="text-burgundy" /> Free shipping on orders above PKR 3500</div>
            <div className="flex items-center gap-3 text-slate-600"><ShieldCheck size={18} className="text-burgundy" /> Secure checkout and quality guarantee</div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {['No-compromise packaging', 'Custom gifting support', 'Trusted premium curation'].map((item) => (
          <div key={item} className="card-luxe p-6 text-center">
            <p className="font-semibold text-slate-800">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="subtle-title">Related products</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card-luxe overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80" alt="Related product" className="h-64 w-full object-cover" />
              <div className="p-5">
                <p className="font-semibold text-slate-800">Personalized Keepsake</p>
                <p className="mt-2 text-burgundy font-bold">PKR 1800</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
