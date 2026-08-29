import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';

const cartItems = [
  {
    id: 1,
    name: 'Royal Celebration Hamper',
    price: 3500,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Golden Bloom Vase',
    price: 2200,
    qty: 2,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
  },
];

function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="section-shell py-16">
      <h1 className="page-title">Your Cart</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="card-luxe flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img src={item.image} alt={item.name} className="h-28 w-full rounded-2xl object-cover sm:w-28" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{item.name}</h3>
                <p className="mt-2 text-burgundy font-bold">PKR {item.price}</p>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-[#eadbc8] bg-white px-3 py-2">
                <button className="rounded-full p-2 hover:bg-[#f8efe7]"><Minus size={16} /></button>
                <span className="w-5 text-center font-medium">{item.qty}</span>
                <button className="rounded-full p-2 hover:bg-[#f8efe7]"><Plus size={16} /></button>
              </div>
              <button className="rounded-full p-2 text-slate-400 hover:bg-[#fdf1f1] hover:text-red-500"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>

        <aside className="card-luxe p-6">
          <h2 className="subtle-title">Order Summary</h2>
          <div className="mt-6 space-y-3 text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>PKR {subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>PKR 350</span></div>
            <div className="flex justify-between"><span>Tax</span><span>PKR 0</span></div>
          </div>
          <div className="my-5 h-px bg-[#f0e7e0]" />
          <div className="flex justify-between text-lg font-semibold text-slate-800"><span>Total</span><span>PKR {subtotal + 350}</span></div>
          <input placeholder="Coupon code" className="mt-6 w-full rounded-full border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" />
          <Link to="/checkout" className="primary-btn mt-6 w-full">Proceed to Checkout</Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
