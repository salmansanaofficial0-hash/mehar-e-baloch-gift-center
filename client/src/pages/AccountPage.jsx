function AccountPage() {
  return (
    <div className="section-shell py-16">
      <h1 className="page-title">My Account</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="card-luxe p-6">
          <div className="mb-6 h-20 w-20 rounded-full bg-[#f8efe7] text-2xl font-bold text-burgundy grid place-items-center">A</div>
          <h2 className="font-semibold text-slate-800">Ayesha Malik</h2>
          <p className="mt-2 text-sm text-slate-500">ayesha@example.com</p>
        </aside>
        <div className="space-y-6">
          <div className="card-luxe p-6">
            <h3 className="subtle-title">Order History</h3>
            <div className="mt-4 space-y-3 text-slate-600">
              <div className="flex justify-between rounded-2xl bg-[#fffaf7] p-3"><span>Royal Celebration Hamper</span><span>Delivered</span></div>
              <div className="flex justify-between rounded-2xl bg-[#fffaf7] p-3"><span>Golden Bloom Vase</span><span>Processing</span></div>
            </div>
          </div>
          <div className="card-luxe p-6">
            <h3 className="subtle-title">Saved Addresses</h3>
            <p className="mt-4 text-slate-600">House 20, Street 5, Gulberg, Lahore</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
