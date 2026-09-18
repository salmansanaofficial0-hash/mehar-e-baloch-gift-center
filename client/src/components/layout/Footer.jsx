import { Link } from 'react-router-dom';
import { Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { brand } from '../../config/brand';

function Footer() {
  return (
    <footer className="mt-20 bg-navy-dark text-white">
      <div className="h-2 bg-gradient-to-r from-rust via-gold to-rust" />
      <div className="section-shell grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-12 w-12 rounded-full object-cover object-center"
            />
            <div>
              <p className="font-display text-xl font-bold text-white">Mehr-e-Baloch</p>
              <p className="text-xs uppercase tracking-[0.2em] text-gold-light">Cosmetics & Gifts</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/65">{brand.tagline}. Thoughtfully chosen in the heart of Turbat.</p>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg font-semibold text-white">Explore</h3>
          <ul className="space-y-3 text-sm text-white/65">
            <li><Link to="/shop" className="hover:text-gold-light">Shop all collections</Link></li>
            <li><Link to="/about" className="hover:text-gold-light">Our story</Link></li>
            <li><Link to="/custom-gift" className="hover:text-gold-light">Create a custom gift</Link></li>
            <li><Link to="/contact" className="hover:text-gold-light">Visit & contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-white/65">
            {brand.whatsapp.map((num) => (
              <li key={num.display} className="flex items-center gap-2">
                <Phone size={15} className="text-gold-light" />
                <a href={num.link} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">
                  {num.display}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-gold-light" /> {brand.address}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg font-semibold text-white">Let us help</h3>
          <p className="text-sm leading-6 text-white/65">Unsure what to choose? Message us and we will help you find the right gift.</p>
          <div className="mt-5 flex gap-3">
            <a href={brand.primaryWhatsApp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full bg-white/10 p-3 transition hover:bg-[#25D366]"><MessageCircle size={19} /></a>
            <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-3 transition hover:bg-rust"><Instagram size={19} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="section-shell flex flex-col items-center justify-between gap-2 text-xs text-white/45 md:flex-row">
          <p>© 2026 {brand.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Owned by {brand.owner}</span>
            <span>Turbat, Balochistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
