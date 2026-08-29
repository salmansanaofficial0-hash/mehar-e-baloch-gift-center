import { Link } from 'react-router-dom';

function CheckoutPage() {
  return (
    <div className="section-shell py-16">
      <h1 className="page-title">Checkout</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="card-luxe p-6">
          <h2 className="subtle-title">Shipping Details</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="Full name" />
            <input className="rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="Phone number" />
            <input className="md:col-span-2 rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="Address" />
            <input className="rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="City" />
            <input className="rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="Postal code" />
          </div>

          <div className="mt-8">
            <h3 className="mb-3 font-semibold text-slate-800">Payment method</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <label className="flex items-center gap-3 rounded-2xl border border-[#eadbc8] bg-white p-3"><input type="radio" name="payment" checked /> Cash on Delivery</label>
              <label className="flex items-center gap-3 rounded-2xl border border-[#eadbc8] bg-white p-3"><input type="radio" name="payment" /> JazzCash</label>
              <label className="flex items-center gap-3 rounded-2xl border border-[#eadbc8] bg-white p-3"><input type="radio" name="payment" /> EasyPaisa</label>
            </div>
          </div>
        </div>

        <aside className="card-luxe p-6">
          <h2 className="subtle-title">Order Summary</h2>
          <div className="mt-5 space-y-4 text-slate-600">
            <div className="flex justify-between"><span>Royal Celebration Hamper</span><span>PKR 3500</span></div>
            <div className="flex justify-between"><span>Golden Bloom Vase</span><span>PKR 4400</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>PKR 350</span></div>
            <div className="flex justify-between"><span>Tax</span><span>PKR 0</span></div>
          </div>
          <div className="my-5 h-px bg-[#f0e7e0]" />
          <div className="flex justify-between text-lg font-semibold text-slate-800"><span>Total</span><span>PKR 8250</span></div>
          <button className="primary-btn mt-6 w-full">Place Order</button>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
