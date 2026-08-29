import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', formData);
      login(data, data.token);
      toast.success('Account created successfully');
      navigate('/account');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-[#f0e7e0] bg-white p-8 shadow-luxe">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-burgundy">Join us</p>
        <h1 className="page-title mt-3 text-4xl">Create account</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
            placeholder="Full name"
          />
          <input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
            placeholder="Email address"
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
            placeholder="Password"
          />
          <button type="submit" disabled={loading} className="primary-btn w-full">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-burgundy">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
