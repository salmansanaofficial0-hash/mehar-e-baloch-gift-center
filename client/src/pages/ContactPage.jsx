function ContactPage() {
  return (
    <div className="section-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-luxe p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Contact us</p>
          <h1 className="page-title mt-3">Let’s make your gifting moment special</h1>
          <div className="mt-6 space-y-4 text-slate-600">
            <p>Phone: +92 300 1234567</p>
            <p>Email: hello@meharbaloch.com</p>
            <p>Address: F-7, Islamabad, Pakistan</p>
            <p>Hours: Mon-Sat, 10:00 AM - 8:00 PM</p>
          </div>
        </div>

        <div className="card-luxe p-8">
          <form className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="Your name" />
            <input className="rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="Email address" />
            <input className="md:col-span-2 rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="Subject" />
            <textarea className="md:col-span-2 min-h-[160px] rounded-2xl border border-[#eadbc8] bg-white px-4 py-3 text-sm outline-none" placeholder="Your message" />
            <button type="button" className="primary-btn md:col-span-2">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
