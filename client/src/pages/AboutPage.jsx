function AboutPage() {
  return (
    <div className="section-shell py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Our story</p>
          <h1 className="page-title mt-3">Thoughtful gifting born from care</h1>
          <p className="mt-5 text-slate-600">
            Mehar-e-Baloch Gift Center was created to bring beauty, sentiment, and memorable surprises into the lives of families and friends. We believe every gift should feel personal, elegant, and meaningful.
          </p>
          <p className="mt-4 text-slate-600">
            From curated hampers to custom keepsakes, our shop balances luxury presentation with heartfelt service so every selection feels special.
          </p>
        </div>
        <img src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=1200&q=80" alt="Gift store" className="h-[500px] w-full rounded-[2rem] object-cover shadow-luxe" />
      </div>
    </div>
  );
}

export default AboutPage;
