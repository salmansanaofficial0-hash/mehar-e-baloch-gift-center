import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Ticket, MessageSquare, Gift, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function AdminLayout({ children }) {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/admin/custom-requests', label: 'Custom Requests', icon: Gift },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="flex min-h-screen bg-[#f9f5f2]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="font-display text-2xl font-bold text-burgundy">Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Mehar-e-Baloch</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  isActive(item.href)
                    ? 'bg-burgundy text-white'
                    : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
