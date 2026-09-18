import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { brand } from '../config/brand';

function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`)
      .then((response) => setProduct(response.data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast('Please sign in to add products to your cart');
      navigate('/login');
      return;
    }
    try {
      await api.post('/users/cart', { productId: product._id, quantity });
      toast.success('Added to your cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add this product');
    }
  };

  if (loading) return <div className="section-shell py-24 text-center text-slate-500">Loading product...</div>;
  if (!product) return <div className="section-shell py-24 text-center"><h1 className="page-title">Product not found</h1><Link to="/shop" className="primary-btn mt-6">Return to shop</Link></div>;

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80'];
  const whatsappText = encodeURIComponent(`Assalamualaikum, I want to order ${quantity} × ${product.name} (PKR ${product.price} each).`);

  return (
    <div className="section-shell py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white p-3 shadow-luxe"><img src={images[activeImage] || images[0]} alt={product.name} className="h-[500px] w-full rounded-[1.4rem] object-cover" /></div>
          {images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3">{images.map((image, index) => <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`overflow-hidden rounded-xl border-2 ${index === activeImage ? 'border-rust' : 'border-transparent'}`}><img src={image} alt={`${product.name} ${index + 1}`} className="h-24 w-full object-cover" /></button>)}</div>}
        </div>

        <div className="lg:py-6">
          <div className="flex flex-wrap items-center gap-2"><p className="eyebrow">{product.category?.name || 'Mehr-e-Baloch collection'}</p>{product.featured && <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase text-amber-700">Featured</span>}</div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-burgundy sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill={i < Math.round(product.rating || 5) ? 'currentColor' : 'none'} />)}<span className="text-sm font-medium text-slate-500">{product.numReviews || 0} reviews</span></div>
          <div className="mt-6 flex items-center gap-3"><span className="text-3xl font-extrabold text-rust">PKR {Number(product.price).toLocaleString()}</span>{product.comparePrice > product.price && <span className="text-lg text-slate-400 line-through">PKR {Number(product.comparePrice).toLocaleString()}</span>}</div>
          <p className="mt-7 whitespace-pre-line leading-8 text-slate-600">{product.description}</p>
          <p className={`mt-5 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{product.stock > 0 ? `${product.stock} available` : 'Currently out of stock'}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="flex w-fit items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-3 py-2"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="rounded-full p-2 hover:bg-cream"><Minus size={16} /></button><span className="w-6 text-center font-bold">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))} className="rounded-full p-2 hover:bg-cream"><Plus size={16} /></button></div>
            <button disabled={product.stock <= 0} onClick={addToCart} className="primary-btn disabled:cursor-not-allowed disabled:opacity-50"><ShoppingCart className="mr-2" size={18} /> Add to cart</button>
            <a href={`${brand.primaryWhatsApp}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white"><MessageCircle className="mr-2" size={18} /> WhatsApp order</a>
          </div>

          <div className="mt-8 grid gap-3 rounded-[1.5rem] bg-cream p-5"><div className="flex items-center gap-3 text-slate-600"><Truck size={19} className="text-rust" /> Delivery details confirmed before dispatch</div><div className="flex items-center gap-3 text-slate-600"><ShieldCheck size={19} className="text-rust" /> Quality checked and carefully packed</div></div>
          {(product.tags || []).length > 0 && <div className="mt-6 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-slate-500">{tag}</span>)}</div>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
