import { useState } from 'react';
import { Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { brand } from '../config/brand';

const mapQuery = encodeURIComponent('New Star Plus Market Shop G-31 Near PTCL Office Turbat');

function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const text = `Assalamualaikum, my name is ${form.name}.\nPhone: ${form.phone}\nSubject: ${form.subject}\nMessage: ${form.message}`;
    window.open(`${brand.primaryWhatsApp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="section-shell py-14 sm:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center"><p className="eyebrow">Visit or message us</p><h1 className="page-title mt-2">We would love to help</h1><p className="mt-4 leading-7 text-slate-600">Ask about products, availability, custom gifts or directions to our Turbat shop.</p></div>
      <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr]">
        <div className="balochi-pattern rounded-[2rem] p-8 text-white sm:p-10">
          <h2 className="font-display text-3xl font-bold">Mehr-e-Baloch Cosmetics</h2>
          <p className="mt-2 text-sm text-white/60">Owner: {brand.owner}</p>
          <div className="mt-8 space-y-6">
            <div className="flex gap-4"><MapPin className="mt-1 shrink-0 text-gold-light" size={21} /><div><p className="font-bold">Visit the shop</p><p className="mt-1 text-sm leading-6 text-white/65">{brand.address}</p></div></div>
            <div className="flex gap-4"><Phone className="mt-1 shrink-0 text-gold-light" size={21} /><div><p className="font-bold">Call or WhatsApp</p>{brand.whatsapp.map((num) => <a key={num.display} href={num.link} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-white/65 hover:text-gold-light">{num.display}</a>)}</div></div>
            <div className="flex gap-4"><Instagram className="mt-1 shrink-0 text-gold-light" size={21} /><div><p className="font-bold">Follow us</p><a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-white/65 hover:text-gold-light">{brand.social.handle}</a></div></div>
            <div className="flex gap-4"><Clock className="mt-1 shrink-0 text-gold-light" size={21} /><div><p className="font-bold">Opening hours</p><p className="mt-1 text-sm text-white/65">Contact us to confirm today's hours</p></div></div>
          </div>
        </div>

        <div className="card-luxe p-7 sm:p-10">
          <p className="eyebrow">Quick enquiry</p><h2 className="mt-2 font-display text-3xl font-bold text-burgundy">Send a WhatsApp message</h2>
          <form onSubmit={submit} className="mt-7 grid gap-5 md:grid-cols-2">
            <input required name="name" value={form.name} onChange={update} className="focus-ring rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5" placeholder="Your name" />
            <input required name="phone" value={form.phone} onChange={update} className="focus-ring rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5" placeholder="Phone number" />
            <input required name="subject" value={form.subject} onChange={update} className="focus-ring rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5 md:col-span-2" placeholder="What can we help with?" />
            <textarea required name="message" value={form.message} onChange={update} className="focus-ring min-h-[150px] rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5 md:col-span-2" placeholder="Write your message" />
            <button type="submit" className="primary-btn py-4 md:col-span-2"><MessageCircle className="mr-2" size={19} /> Open in WhatsApp</button>
          </form>
        </div>
      </div>
      <div className="mt-8 overflow-hidden rounded-[2rem] border border-[var(--color-border)] shadow-luxe">
        <iframe title="Mehr-e-Baloch Cosmetics location" src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`} className="h-[420px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    </div>
  );
}

export default ContactPage;
