import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-20 border-t border-[#f0e7e0] bg-[#fffdfb]">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-burgundy">Mehar-e-Baloch</p>
          <p className="mt-3 text-sm text-slate-600">Gifts That Speak From The Heart.</p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/custom-gift">Custom Gift</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Contact</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>+92 300 1234567</li>
            <li>hello@meharbaloch.com</li>
            <li>Islamabad, Pakistan</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Newsletter</h3>
          <div className="flex overflow-hidden rounded-full border border-[#eadbc8] bg-white">
            <input className="w-full bg-transparent px-4 py-3 text-sm outline-none" placeholder="Your email" />
            <button className="bg-burgundy px-4 py-3 text-sm font-medium text-white">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-[#f0e7e0] py-4">
        <div className="section-shell flex flex-col items-center justify-between gap-2 text-sm text-slate-500 md:flex-row">
          <p>© 2026 Mehar-e-Baloch Gift Center. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
