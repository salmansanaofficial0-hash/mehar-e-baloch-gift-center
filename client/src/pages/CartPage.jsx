import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

function CartPage() {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    try {
      const response = await api.get('/users/cart');
      setCart(response.data.data || { items: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load your cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, [isAuthenticated]);

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) return;
    try {
      const response = await api.put('/users/cart', { productId: item.product?._id || item.product, quantity, selectedVariant: item.selectedVariant });
      setCart(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update quantity');
    }
  };

  const removeItem = async (item) => {
    try {
      const response = await api.delete('/users/cart', { data: { productId: item.product?._id || item.product, selectedVariant: item.selectedVariant } });
      setCart(response.data.data);
      toast.success('Product removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove product');
    }
  };

  if (!isAuthenticated) return <div className="section-shell py-24 text-center"><ShoppingBag className="mx-auto text-rust" size={42} /><h1 className="page-title mt-5">Your cart is waiting</h1><p className="mt-3 text-slate-500">Sign in to add and manage products in your cart.</p><Link to="/login" className="primary-btn mt-7">Sign in</Link></div>;
  if (loading) return <div className="section-shell py-24 text-center text-slate-500">Loading your cart...</div>;

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  return (
    <div className="section-shell py-14 sm:py-20">
      <h1 className="page-title">Your cart</h1>
      {!items.length ? <div className="mt-10 rounded-[2rem] border border-dashed border-[var(--color-border)] bg-white p-12 text-center"><ShoppingBag className="mx-auto text-slate-300" size={42} /><p className="mt-4 font-display text-2xl font-bold text-burgundy">Your cart is empty</p><Link to="/shop" className="primary-btn mt-6">Explore products</Link></div> : <div className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_.9fr]">
        <div className="space-y-4">{items.map((item) => <article key={`${item.product?._id || item.product}-${item.selectedVariant || ''}`} className="card-luxe flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><img src={item.image || item.product?.images?.[0] || '/logo.png'} alt={item.name} className="h-28 w-full rounded-2xl object-cover sm:w-28" /><div className="flex-1"><h3 className="font-bold text-burgundy">{item.name}</h3><p className="mt-2 font-bold text-rust">PKR {Number(item.price).toLocaleString()}</p></div><div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-3 py-2"><button onClick={() => updateQuantity(item, item.quantity - 1)} className="rounded-full p-2 hover:bg-cream"><Minus size={16} /></button><span className="w-5 text-center font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item, item.quantity + 1)} className="rounded-full p-2 hover:bg-cream"><Plus size={16} /></button></div><button onClick={() => removeItem(item)} aria-label={`Remove ${item.name}`} className="rounded-full p-3 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={18} /></button></article>)}</div>
        <aside className="card-luxe h-fit p-6"><h2 className="subtle-title">Order summary</h2><div className="mt-6 flex justify-between text-slate-600"><span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span></div><p className="mt-3 text-xs leading-5 text-slate-400">Delivery charges are confirmed based on your location before the order is placed.</p><div className="my-5 h-px bg-[var(--color-border-light)]" /><div className="flex justify-between text-lg font-bold text-burgundy"><span>Products total</span><span>PKR {subtotal.toLocaleString()}</span></div><Link to="/checkout" className="primary-btn mt-6 w-full">Continue to checkout</Link></aside>
      </div>}
    </div>
  );
}

export default CartPage;
