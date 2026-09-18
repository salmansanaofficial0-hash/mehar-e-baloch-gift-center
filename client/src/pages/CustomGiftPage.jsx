import { useState } from 'react';
import { Gift, MessageCircle, Sparkles } from 'lucide-react';
import { brand } from '../config/brand';

function CustomGiftPage() {
  const [form, setForm] = useState({ name: '', phone: '', occasion: '', budget: '', details: '' });
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    const message = [
      'Assalamualaikum, I would like a custom gift from Mehr-e-Baloch.',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Occasion: ${form.occasion}`,
      `Budget: PKR ${form.budget}`,
      `Gift idea: ${form.details}`,
    ].join('\n');
    window.open(`${brand.primaryWhatsApp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="section-shell py-14 sm:py-20">
      <div className="grid overflow-hidden rounded-[2.25rem] border border-[var(--color-border)] bg-white shadow-luxe lg:grid-cols-[.78fr_1.22fr]">
        <aside className="balochi-pattern p-8 text-white sm:p-10 lg:p-12">
          <div className="inline-flex rounded-2xl bg-white/10 p-4 text-gold-light"><Gift size={34} /></div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Custom gifting</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">Made especially for their moment.</h1>
          <p className="mt-5 leading-7 text-white/70">Share a few details and continue directly on WhatsApp. Our team will help you choose products, presentation and finishing touches.</p>
          <div className="mt-8 space-y-3 text-sm text-white/80">
            <p className="flex items-center gap-3"><Sparkles size={17} className="text-gold-light" /> Gift ideas within your budget</p>
            <p className="flex items-center gap-3"><Sparkles size={17} className="text-gold-light" /> Personalized selection and packing</p>
            <p className="flex items-center gap-3"><Sparkles size={17} className="text-gold-light" /> Direct confirmation on WhatsApp</p>
          </div>
        </aside>
        <div className="p-7 sm:p-10 lg:p-12">
          <p className="eyebrow">Tell us what you have in mind</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-burgundy">Plan your custom gift</h2>
          <form onSubmit={submit} className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Your name<input required name="name" value={form.name} onChange={update} className="focus-ring mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5 font-normal" placeholder="Full name" /></label>
            <label className="text-sm font-semibold text-slate-700">Phone number<input required name="phone" value={form.phone} onChange={update} className="focus-ring mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5 font-normal" placeholder="03XX-XXXXXXX" /></label>
            <label className="text-sm font-semibold text-slate-700">Occasion<input required name="occasion" value={form.occasion} onChange={update} className="focus-ring mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5 font-normal" placeholder="Birthday, wedding..." /></label>
            <label className="text-sm font-semibold text-slate-700">Budget (PKR)<input required name="budget" type="number" min="1" value={form.budget} onChange={update} className="focus-ring mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5 font-normal" placeholder="e.g. 5000" /></label>
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">Describe the person or gift idea<textarea required name="details" value={form.details} onChange={update} className="focus-ring mt-2 min-h-[150px] w-full rounded-2xl border border-[var(--color-border)] bg-cream/40 px-4 py-3.5 font-normal" placeholder="Favourite colours, products, style or any special request" /></label>
            <button type="submit" className="primary-btn py-4 md:col-span-2"><MessageCircle className="mr-2" size={19} /> Continue on WhatsApp</button>
            <p className="text-center text-xs text-slate-400 md:col-span-2">Your request will open in WhatsApp for review before you send it.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomGiftPage;
