import { brand } from '../config/brand';

const mapQuery = encodeURIComponent('New Star Plus Market Shop G-31 Near PTCL Office Turbat');

function ContactPage() {
  return (
    <div className="section-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-luxe p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Contact us</p>
          <h1 className="page-title mt-3">We'd love to hear from you</h1>
          <div className="mt-6 space-y-4 text-slate-600">
            <p><span className="font-semibold text-slate-800">Owner:</span> {brand.owner}</p>
            {brand.whatsapp.map((num) => (
              <p key={num.display}>
                <span className="font-semibold text-slate-800">WhatsApp:</span>{' '}
                <a href={num.link} target="_blank" rel="noopener noreferrer" className="text-rust hover:underline">
                  {num.display}
                </a>
              </p>
            ))}
            <p><span className="font-semibold text-slate-800">Address:</span> {brand.address}</p>
            <p>
              <span className="font-semibold text-slate-800">Instagram / TikTok:</span>{' '}
              <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="text-rust hover:underline">
                {brand.social.handle}
              </a>
            </p>
            <p><span className="font-semibold text-slate-800">Hours:</span> Mon–Sat, 10:00 AM – 8:00 PM</p>
          </div>
        </div>

        <div className="card-luxe p-8">
          <form className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-rust" placeholder="Your name" />
            <input className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-rust" placeholder="Phone number" />
            <input className="md:col-span-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-rust" placeholder="Subject" />
            <textarea className="md:col-span-2 min-h-[160px] rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-rust" placeholder="Your message" />
            <button type="button" className="primary-btn md:col-span-2">Send Message</button>
          </form>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--color-border)] shadow-luxe">
        <iframe
          title="Mehr-e-Baloch Cosmetics location"
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          className="h-[400px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default ContactPage;
