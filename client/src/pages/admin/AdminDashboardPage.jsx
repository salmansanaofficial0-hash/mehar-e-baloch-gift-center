import { useEffect, useState } from 'react';
import api from '../../lib/api';

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState({ stats: {}, recentOrders: [] });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardRes, productsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/products'),
        ]);

        setDashboard(dashboardRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Failed to load dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = dashboard.stats || {};
  const recentOrders = dashboard.recentOrders || [];

  return (
    <div className="min-h-screen bg-[#f9f5f2] p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Admin</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-burgundy">Dashboard Overview</h1>
          </div>
          <button className="primary-btn">Export Report</button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-slate-500">Loading dashboard data...</div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['Total Sales', `PKR ${stats.totalSales || 0}`],
                ['Total Orders', String(stats.totalOrders || 0)],
                ['Customers', String(stats.totalCustomers || 0)],
                ['Products', String(stats.totalProducts || 0)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.75rem] border border-[#f0e7e0] bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-3 font-display text-3xl font-bold text-burgundy">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
              <div className="rounded-[1.75rem] border border-[#f0e7e0] bg-white p-6 shadow-sm">
                <h2 className="subtle-title">Recent orders</h2>
                <div className="mt-6 space-y-3">
                  {recentOrders.length ? recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between rounded-xl bg-[#fffaf7] p-3 text-sm text-slate-600">
                      <div>
                        <p className="font-semibold text-slate-800">{order.user?.name || 'Customer'}</p>
                        <p>{order.status}</p>
                      </div>
                      <span className="font-semibold text-burgundy">PKR {order.totalPrice}</span>
                    </div>
                  )) : <p className="text-slate-500">No recent orders yet.</p>}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#f0e7e0] bg-white p-6 shadow-sm">
                <h2 className="subtle-title">Inventory</h2>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {products.slice(0, 4).map((product) => (
                    <li key={product._id} className="flex justify-between rounded-xl bg-[#fffaf7] p-3">
                      <span>{product.name}</span>
                      <span>{product.stock ?? 0} left</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
