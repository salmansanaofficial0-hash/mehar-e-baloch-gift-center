import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import api from '../lib/api';

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let items = [...products];

    if (query) {
      items = items.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
    }

    if (category !== 'all') {
      items = items.filter((product) => product.category?._id === category || product.category?.name === category);
    }

    if (sortBy === 'price-low') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') items.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return items;
  }, [query, category, sortBy, products]);

  const categories = ['all', ...new Set(products.map((product) => product.category?._id || product.category?.name).filter(Boolean))];

  return (
    <div className="section-shell py-16">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Shop</p>
          <h1 className="page-title mt-2">Curated collections</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-full border border-[#eadbc8] bg-white px-4 py-3">
            <Search size={16} className="text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="w-full bg-transparent text-sm outline-none sm:w-52" />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-full border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-3">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${category === item ? 'bg-burgundy text-white' : 'border border-[#eadbc8] bg-white text-slate-600'}`}
          >
            {item === 'all' ? 'All' : (products.find((product) => (product.category?._id || product.category?.name) === item)?.category?.name || item)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-500">Loading products...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product._id} className="card-luxe overflow-hidden">
              <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'} alt={product.name} className="h-80 w-full object-cover" />
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
                  <span>{product.category?.name || 'Gift'}</span>
                  <span className="flex items-center gap-1 text-gold"><Star size={14} fill="currentColor" /> {product.rating || 4.8}</span>
                </div>
                <h3 className="font-semibold text-slate-800">{product.name}</h3>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl font-bold text-burgundy">PKR {product.price}</span>
                  {product.comparePrice && <span className="text-sm text-slate-400 line-through">PKR {product.comparePrice}</span>}
                </div>
                <Link to={`/product/${product.slug}`} className="mt-5 inline-flex rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-white hover:bg-maroon">View Product</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-[#eadbc8] bg-white px-8 py-12 text-center text-slate-500">
          No products match your search yet.
        </div>
      )}
    </div>
  );
}

export default ShopPage;
