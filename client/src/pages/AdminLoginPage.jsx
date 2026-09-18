import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { brand } from '../config/brand';

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', accessCode: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/admin/login', form);
      const admin = response.data.data;
      login(admin, admin.token);
      toast.success('Secure admin access granted');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell flex min-h-[78vh] items-center justify-center py-14">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2.25rem] border border-[var(--color-border)] bg-white shadow-luxe lg:grid-cols-[.85fr_1.15fr]">
        <aside className="balochi-pattern p-8 text-white sm:p-10">
          <img src={brand.logo} alt={brand.name} className="h-16 w-16 rounded-full border-2 border-white/25 object-cover" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-gold-light">Restricted area</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Store Administration</h1>
          <p className="mt-4 leading-7 text-white/65">Only the approved administrator email can access this dashboard. A password and private access code are required every time.</p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/75"><ShieldCheck className="shrink-0 text-gold-light" /> Customer accounts cannot enter the admin panel.</div>
        </aside>
        <div className="p-7 sm:p-10 lg:p-12">
          <p className="eyebrow">Secure sign in</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-burgundy">Admin access</h2>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">Approved email<div className="relative mt-2"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required type="email" autoComplete="username" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="focus-ring w-full rounded-2xl border border-[var(--color-border)] bg-cream/40 py-3.5 pl-11 pr-4" placeholder="admin email" /></div></label>
            <label className="block text-sm font-semibold text-slate-700">Password<div className="relative mt-2"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="focus-ring w-full rounded-2xl border border-[var(--color-border)] bg-cream/40 py-3.5 pl-11 pr-4" placeholder="Admin password" /></div></label>
            <label className="block text-sm font-semibold text-slate-700">Private access code<div className="relative mt-2"><KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required type="password" minLength="6" inputMode="text" value={form.accessCode} onChange={(e) => setForm({ ...form, accessCode: e.target.value })} className="focus-ring w-full rounded-2xl border border-[var(--color-border)] bg-cream/40 py-3.5 pl-11 pr-4" placeholder="Private code" /></div></label>
            <button disabled={loading} type="submit" className="primary-btn w-full py-4 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Verifying access...' : 'Open admin dashboard'}</button>
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-slate-400">Access details are checked securely by the server and are not stored in the website code.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
