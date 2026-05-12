import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Kitchen', 'Books', 'Home', 'Sports', 'Toys', 'Other'];

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '',
  imageUrl: '', stock: '', rating: ''
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      getProduct(id)
        .then(({ data }) => {
          setForm({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            imageUrl: data.imageUrl || '',
            stock: data.stock,
            rating: data.rating
          });
        })
        .catch((err) => { console.error(err); setError('Failed to load product.'); })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        rating: parseFloat(form.rating) || 0
      };
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="edit-product-page">
      <div className="edit-product-card">
        <button className="back-btn" onClick={() => navigate('/admin')}>← Back to Dashboard</button>
        <h1 className="page-title">{isEditing ? '✏️ Edit Product' : '➕ Add New Product'}</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" type="text" placeholder="e.g. Sony WH-1000XM5" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" placeholder="Describe the product..." rows={4} value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input name="price" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input name="stock" type="number" min="0" placeholder="0" value={form.stock} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Rating (0–5)</label>
              <input name="rating" type="number" min="0" max="5" step="0.1" placeholder="4.5" value={form.rating} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input name="imageUrl" type="url" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />
          </div>

          {form.imageUrl && (
            <div className="image-preview">
              <img src={form.imageUrl} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin')}>Cancel</button>
            <button type="submit" className="auth-btn" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? '✓ Update Product' : '➕ Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
