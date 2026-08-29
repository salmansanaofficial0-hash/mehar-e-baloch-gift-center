function WishlistPage() {
  return (
    <div className="section-shell py-16">
      <h1 className="page-title">Wishlist</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {['Royal Hamper', 'Personalized Frame', 'Love Notes Card Set'].map((item) => (
          <div key={item} className="card-luxe overflow-hidden">
            <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80" alt={item} className="h-64 w-full object-cover" />
            <div className="p-5">
              <p className="font-semibold text-slate-800">{item}</p>
              <p className="mt-2 text-burgundy font-bold">PKR 1800</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
