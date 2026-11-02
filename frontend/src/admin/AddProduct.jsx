import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isReadOnlyAdmin } from './adminAccess';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: ''
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState({ message: '', error: '' });

  if (!user || user.role !== 'admin' || isReadOnlyAdmin(user)) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !imageUrl.trim()) {
      setLocal({ message: '', error: 'Please select an image or enter an image URL.' });
      return;
    }
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (image) data.append('image', image);
    else data.append('image', imageUrl.trim());

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      
      if (res.ok) {
        setLocal({ message: 'Product created successfully.', error: '' });
        navigate('/shop');
      } else {
        setLocal({ message: '', error: responseData.message || 'Error creating product' });
      }
    } catch (error) {
      setLocal({ message: '', error: 'Unable to create product.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container" style={{ maxWidth: '600px', margin: '40px auto', background: '#18181b', padding: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Add New Product</h2>
      {local.message && <p style={{ color: '#10b981' }}>{local.message}</p>}
      {local.error && <p style={{ color: '#ef4444' }}>{local.error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Product Name" required 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          style={inputStyle} 
        />
        <textarea 
          placeholder="Description" required rows="4"
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="number" placeholder="Price" required 
          onChange={(e) => setFormData({...formData, price: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="text" placeholder="Category" required 
          onChange={(e) => setFormData({...formData, category: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="number" placeholder="Stock Quantity" required 
          onChange={(e) => setFormData({...formData, stock: e.target.value})} 
          style={inputStyle} 
        />
        
        <div style={{ padding: '15px', border: '1px dashed #f97316', borderRadius: '8px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#a1a1aa' }}>Upload Product Image (Cloudinary)</label>
          <input 
            type="file" accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} 
            style={{ color: '#fff' }}
          />
          <input
            type="url"
            placeholder="Or paste a public image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ ...inputStyle, marginTop: '10px', width: '100%' }}
          />
        </div>

        <button type="submit" disabled={loading} className={`btn${loading ? ' is-loading' : ''}`} style={{ marginTop: '10px' }}>
          {loading ? 'Uploading & Creating...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  background: '#09090b',
  border: '1px solid #27272a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none'
};

export default AddProduct;
