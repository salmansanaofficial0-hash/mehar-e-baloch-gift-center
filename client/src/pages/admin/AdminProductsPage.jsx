import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  images: '',
  featured: false,
};

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/admin/products');
      setProducts(data);
    } catch (error) {
      toast.error('Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images ? form.images.split(',').map((item) => item.trim()) : [],
      category: form.category || '670f1c4d7f0a1a2d5d0d0d0d',
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }

      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category?._id || '',
      stock: String(product.stock || 0),
      images: (product.images || []).join(', '),
      featured: Boolean(product.featured),
    });
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      loadProducts();
    } catch (error) {
      toast.error('Could not delete product');
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5f2] p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-4xl font-bold text-burgundy">Products Management</h1>
          <button className="primary-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>New Product</button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#f0e7e0] bg-white p-6 shadow-sm">
            <h2 className="subtle-title">{editingId ? 'Edit product' : 'Add product'}</h2>
            <div className="mt-5 space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                className="w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="min-h-[120px] w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Price"
                  className="w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
                />
                <input
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="Stock"
                  className="w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
                />
              </div>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category ObjectId"
                className="w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
              />
              <input
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="Image URLs separated by commas"
                className="w-full rounded-2xl border border-[#eadbc8] bg-[#fffaf7] px-4 py-3 text-sm outline-none"
              />
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Mark as featured
              </label>
              <button type="submit" className="primary-btn w-full">{editingId ? 'Save changes' : 'Create product'}</button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-[#f0e7e0] bg-white p-6 shadow-sm">
            <h2 className="subtle-title">Product list</h2>
            <div className="mt-5 space-y-4">
              {loading ? (
                <p className="text-slate-500">Loading products...</p>
              ) : products.length ? (
                products.map((product) => (
                  <div key={product._id} className="flex flex-col gap-3 rounded-2xl bg-[#fffaf7] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-500">PKR {product.price} • Stock: {product.stock ?? 0}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="secondary-btn px-4 py-2">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600">Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No products yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductsPage;
