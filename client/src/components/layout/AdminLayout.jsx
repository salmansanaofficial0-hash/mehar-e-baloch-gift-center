import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Ticket, MessageSquare, Gift, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { brand } from '../../config/brand';

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
    <div className="flex min-h-screen bg-cream">
      <aside className="sticky top-0 h-screen w-64 overflow-y-auto bg-navy shadow-lg">
        <div className="border-b border-navy-light p-6">
          <div className="flex items-center gap-3">
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-10 w-10 rounded-full object-cover object-center"
            />
            <div>
              <h1 className="font-display text-lg font-bold text-white">Admin</h1>
              <p className="text-xs text-gold-light">Mehr-e-Baloch</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
                  isActive(item.href)
                    ? 'bg-rust text-white'
                    : 'text-cream hover:bg-navy-light'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-navy-light bg-navy p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium text-red-300 transition hover:bg-navy-light"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
