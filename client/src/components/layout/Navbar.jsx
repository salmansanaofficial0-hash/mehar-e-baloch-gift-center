import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/custom-gift', label: 'Custom Gift' },
];

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#f0e7e0] bg-white/90 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy text-lg font-bold text-white">M</div>
          <div>
            <p className="font-display text-xl font-bold text-burgundy">Mehar-e-Baloch</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Gift Center</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-burgundy' : 'text-slate-600 hover:text-burgundy'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-burgundy hover:text-burgundy md:inline-flex">
            <Heart size={18} />
          </button>
          <Link to="/cart" className="inline-flex rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-burgundy hover:text-burgundy">
            <ShoppingBag size={18} />
          </Link>
          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'admin' ? '/admin' : '/account'} className="inline-flex items-center gap-2 rounded-full border border-burgundy bg-[#fff7f3] px-4 py-2 text-sm font-medium text-burgundy">
                <User size={16} />
                <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Account'}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-burgundy hover:text-burgundy"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-burgundy px-4 py-2 text-sm font-medium text-white hover:bg-maroon">
              <User size={16} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
          <button className="inline-flex rounded-full border border-slate-200 p-2 text-slate-600 md:hidden">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
