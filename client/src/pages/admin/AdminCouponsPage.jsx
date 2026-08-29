import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    expiryDate: '',
    usageLimit: '',
    isActive: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/coupons/admin/all');
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to load coupons');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/coupons/admin/${editingId}`, formData);
        toast.success('Coupon updated');
      } else {
        await api.post('/coupons/admin/create', formData);
        toast.success('Coupon created');
      }
      setFormData({ code: '', type: 'percentage', value: '', minOrderAmount: '', expiryDate: '', usageLimit: '', isActive: true });
      setShowForm(false);
      setEditingId(null);
      loadCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const editCoupon = (coupon) => {
    setFormData(coupon);
    setEditingId(coupon._id);
    setShowForm(true);
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/coupons/admin/${id}`);
      toast.success('Coupon deleted');
      loadCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="page-title">Coupons & Discounts</h1>
        <button
          onClick={() => {
            setFormData({ code: '', type: 'percentage', value: '', minOrderAmount: '', expiryDate: '', usageLimit: '', isActive: true });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="primary-btn flex items-center gap-2"
        >
          <Plus size={18} /> New Coupon
        </button>
      </div>

      {showForm && (
        <div className="card-luxe p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editingId ? 'Edit Coupon' : 'Create New Coupon'}</h2>
            <button onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., SAVE10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (PKR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={formData.type === 'percentage' ? '10' : '500'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Min Order Amount (PKR)</label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="Unlimited"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Active</span>
              </label>
            </div>

            <div className="col-span-2 flex gap-2">
              <button type="submit" className="primary-btn flex-1">
                {editingId ? 'Update' : 'Create'} Coupon
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="secondary-btn flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading coupons...</div>
      ) : (
        <div className="grid gap-4">
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No coupons yet</div>
          ) : (
            coupons.map((coupon) => (
              <div key={coupon._id} className="card-luxe p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-burgundy">{coupon.code}</p>
                  <p className="text-sm text-slate-600">
                    {coupon.type === 'percentage' ? `${coupon.value}% off` : `PKR ${coupon.value} off`}
                    {coupon.minOrderAmount > 0 && ` • Min: PKR ${coupon.minOrderAmount}`}
                    {coupon.expiryDate && ` • Expires: ${new Date(coupon.expiryDate).toLocaleDateString()}`}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {coupon.usedCount} / {coupon.usageLimit || 'unlimited'} used •
                    <span className={coupon.isActive ? ' text-green-600' : ' text-red-600'}>
                      {coupon.isActive ? ' Active' : ' Inactive'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editCoupon(coupon)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminCouponsPage;
