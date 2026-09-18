import { useEffect, useMemo, useState } from 'react';
import { Archive, ImagePlus, PackagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const emptyForm = {
  name: '', description: '', price: '', comparePrice: '', category: '', stock: '',
  sku: '', tags: '', imageUrls: '', featured: false, bestSeller: false, status: 'active',
};

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const loadData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get('/admin/products?limit=100'),
        api.get('/products/categories/all'),
      ]);
      setProducts(productsResponse.data.data?.products || []);
      setCategories(categoriesResponse.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load store data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const text = `${product.name} ${product.sku || ''} ${product.category?.name || ''}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [products, query]);

  const resetForm = () => {
    setForm(emptyForm);
    setFiles([]);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.category) return toast.error('Create or select a category first');

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'imageUrls') return;
      payload.append(key, value);
    });
    payload.append('imageUrls', JSON.stringify(form.imageUrls.split(',').map((url) => url.trim()).filter(Boolean)));
    files.forEach((file) => payload.append('images', file));

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product added to the store');
      }
      resetForm();
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFiles([]);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      comparePrice: String(product.comparePrice ?? ''),
      category: product.category?._id || product.category || '',
      stock: String(product.stock ?? 0),
      sku: product.sku || '',
      tags: (product.tags || []).join(', '),
      imageUrls: (product.images || []).join(', '),
      featured: Boolean(product.featured),
      bestSeller: Boolean(product.bestSeller),
      status: product.status || 'active',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Permanently delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((items) => items.filter((item) => item._id !== product._id));
      if (editingId === product._id) resetForm();
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete product');
    }
  };

  const createCategory = async (event) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    try {
      const response = await api.post('/admin/categories', { name: categoryName.trim() });
      const category = response.data.data;
      setCategories((items) => [...items, category]);
      setForm((current) => ({ ...current, category: category._id }));
      setCategoryName('');
      toast.success('Category created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create category');
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete category “${category.name}”?`)) return;
    try {
      await api.delete(`/admin/categories/${category._id}`);
      setCategories((items) => items.filter((item) => item._id !== category._id));
      if (form.category === category._id) setForm({ ...form, category: '' });
      toast.success('Category deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Category is being used by a product');
    }
  };

  const removeImage = (url) => setForm({
    ...form,
    imageUrls: form.imageUrls.split(',').map((item) => item.trim()).filter((item) => item && item !== url).join(', '),
  });

  const inputClass = 'focus-ring w-full rounded-xl border border-[var(--color-border)] bg-cream/40 px-4 py-3 text-sm';
  const imageUrls = form.imageUrls.split(',').map((url) => url.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f7f3eb] p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Store management</p><h1 className="mt-2 font-display text-4xl font-bold text-burgundy">Products & inventory</h1><p className="mt-2 text-sm text-slate-500">Add, edit, publish, hide or remove products manually.</p></div>
          <button className="primary-btn" onClick={resetForm}><PackagePlus className="mr-2" size={18} /> New product</button>
        </div>

        <div className="grid gap-7 xl:grid-cols-[.88fr_1.12fr]">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between"><h2 className="subtle-title">{editingId ? 'Edit product' : 'Add product'}</h2>{editingId && <button type="button" onClick={resetForm} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X size={19} /></button>}</div>
              <div className="mt-6 space-y-4">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" className={inputClass} />
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" className={`${inputClass} min-h-[120px] resize-y`} />
                <div className="grid gap-4 sm:grid-cols-2"><input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Selling price (PKR)" className={inputClass} /><input type="number" min="0" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} placeholder="Old price (optional)" className={inputClass} /></div>
                <div className="grid gap-4 sm:grid-cols-2"><input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Available stock" className={inputClass} /><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU / product code" className={inputClass} /></div>
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags separated by commas" className={inputClass} />
                <textarea value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} placeholder="Image URLs separated by commas (optional)" className={`${inputClass} min-h-[85px]`} />
                {imageUrls.length > 0 && <div className="grid grid-cols-3 gap-3">{imageUrls.map((url) => <div key={url} className="group relative overflow-hidden rounded-xl bg-cream"><img src={url} alt="Product preview" className="h-24 w-full object-cover" /><button type="button" onClick={() => removeImage(url)} aria-label="Remove image" className="absolute right-1.5 top-1.5 rounded-full bg-red-600 p-1 text-white opacity-90"><X size={13} /></button></div>)}</div>}
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-rust/40 bg-rust/5 px-4 py-4 text-sm font-semibold text-rust"><ImagePlus size={19} /> Upload product photos<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} /></label>
                {files.length > 0 && <p className="text-xs text-slate-500">{files.length} new photo{files.length > 1 ? 's' : ''} selected</p>}
                <div className="grid gap-4 sm:grid-cols-2"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}><option value="active">Published</option><option value="draft">Draft / hidden</option></select><div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.bestSeller} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} /> Best seller</label></div></div>
                <button disabled={saving} type="submit" className="primary-btn w-full py-3.5 disabled:opacity-60">{saving ? 'Saving...' : editingId ? 'Save product changes' : 'Add product to store'}</button>
              </div>
            </form>

            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-6 shadow-sm">
              <h2 className="subtle-title">Categories</h2>
              <form onSubmit={createCategory} className="mt-4 flex gap-2"><input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="New category name" className={inputClass} /><button className="rounded-xl bg-burgundy px-4 text-white" aria-label="Add category"><Plus size={19} /></button></form>
              <div className="mt-4 flex flex-wrap gap-2">{categories.map((category) => <span key={category._id} className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-2 text-xs font-semibold text-burgundy">{category.name}<button onClick={() => deleteCategory(category)} aria-label={`Delete ${category.name}`} className="text-red-500"><X size={14} /></button></span>)}</div>
            </div>
          </div>

          <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="subtle-title">All products</h2><p className="mt-1 text-xs text-slate-400">{products.length} product{products.length !== 1 ? 's' : ''} in the store</p></div><div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2.5"><Search size={17} className="text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="w-full bg-transparent text-sm outline-none" /></div></div>
            <div className="mt-6 space-y-4">
              {loading ? <p className="py-10 text-center text-slate-500">Loading products...</p> : filteredProducts.length ? filteredProducts.map((product) => (
                <article key={product._id} className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border-light)] bg-cream/30 p-4 sm:flex-row sm:items-center">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">{product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" /> : <Archive className="m-auto mt-6 text-slate-300" />}</div>
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-bold text-burgundy">{product.name}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${product.status === 'draft' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>{product.status === 'draft' ? 'Hidden' : 'Published'}</span>{product.featured && <span className="rounded-full bg-gold/15 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">Featured</span>}</div><p className="mt-1 text-sm text-slate-500">PKR {Number(product.price).toLocaleString()} · Stock: {product.stock ?? 0} · {product.category?.name || 'Uncategorized'}</p>{product.sku && <p className="mt-1 text-xs text-slate-400">SKU: {product.sku}</p>}</div>
                  <div className="flex gap-2"><button onClick={() => handleEdit(product)} className="inline-flex items-center gap-1.5 rounded-full border border-burgundy px-3 py-2 text-xs font-bold text-burgundy"><Pencil size={14} /> Edit</button><button onClick={() => handleDelete(product)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600"><Trash2 size={14} /> Delete</button></div>
                </article>
              )) : <p className="py-12 text-center text-slate-500">No products found.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminProductsPage;
