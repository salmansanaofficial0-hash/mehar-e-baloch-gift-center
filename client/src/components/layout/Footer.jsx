import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';

function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border-light)] bg-ivory">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-12 w-12 rounded-full object-cover object-center"
            />
            <div>
              <p className="font-display text-xl font-bold text-burgundy">Mehr-e-Baloch</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cosmetics</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">{brand.tagline}</p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/shop" className="hover:text-rust">Shop</Link></li>
            <li><Link to="/about" className="hover:text-rust">About</Link></li>
            <li><Link to="/custom-gift" className="hover:text-rust">Custom Gift</Link></li>
            <li><Link to="/contact" className="hover:text-rust">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Contact</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Owner: {brand.owner}</li>
            {brand.whatsapp.map((num) => (
              <li key={num.display}>
                <a href={num.link} target="_blank" rel="noopener noreferrer" className="hover:text-rust">
                  WhatsApp: {num.display}
                </a>
              </li>
            ))}
            <li>{brand.address}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">Follow Us</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-rust">
                Instagram: {brand.social.handle}
              </a>
            </li>
            <li>
              <a href={brand.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-rust">
                TikTok: {brand.social.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-border-light)] py-4">
        <div className="section-shell flex flex-col items-center justify-between gap-2 text-sm text-slate-500 md:flex-row">
          <p>© 2026 {brand.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-rust">Instagram</a>
            <a href={brand.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-rust">TikTok</a>
            <a href={brand.primaryWhatsApp} target="_blank" rel="noopener noreferrer" className="hover:text-rust">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
