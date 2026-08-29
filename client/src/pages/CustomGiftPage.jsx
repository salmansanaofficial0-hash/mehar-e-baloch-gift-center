function CustomGiftPage() {
  return (
    <div className="section-shell py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#f0e7e0] bg-white p-8 shadow-luxe">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Custom gifting</p>
        <h1 className="page-title mt-3">Request a personalized gift</h1>
        <form className="mt-8 grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none" placeholder="Your name" />
          <input className="rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none" placeholder="Email" />
          <input className="rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none" placeholder="Occasion" />
          <input className="rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none" placeholder="Budget (PKR)" />
          <textarea className="md:col-span-2 min-h-[160px] rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none" placeholder="Tell us about your custom gift idea" />
          <input type="file" className="md:col-span-2 rounded-2xl border border-dashed border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none" />
          <button type="button" className="primary-btn md:col-span-2">Submit Request</button>
        </form>
      </div>
    </div>
  );
}

export default CustomGiftPage;
