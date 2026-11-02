import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../style/product.css';
import { isReadOnlyAdmin } from './adminAccess';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [local, setLocal] = useState({ message: '', error: '', confirmId: null });
  const readOnly = isReadOnlyAdmin(user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `Failed to load products: ${res.status}`);
        }
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (error) {
        console.error('Unable to fetch products:', error);
        setFetchError('Products are currently unavailable. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (readOnly) {
      setLocal({ ...local, message: 'Read-only access: you cannot delete products.', error: '', confirmId: null });
      return;
    }
    if (local.confirmId !== id) {
      setLocal({ ...local, confirmId: id });
      return;
    }
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (res.ok) {
      setProducts((current) => current.filter((product) => product._id !== id));
      setLocal({ message: 'Product deleted successfully.', error: '', confirmId: null });
    } else {
      setLocal({ ...local, error: 'Unable to delete product.', confirmId: null });
    }
  };


  return (
    <div className="admin-page-container" style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#f97316' }}>Manage Products</h2>
        <button
          type="button"
          className="btn"
          onClick={() => readOnly
            ? setLocal({ ...local, message: 'Read-only access: you cannot add products.', error: '' })
            : navigate('/admin/add-product')}
        >
          + Add Product
        </button>
      </div>
      {local.message && <p style={{ color: '#10b981' }}>{local.message}</p>}
      {local.error && <p style={{ color: '#ef4444' }}>{local.error}</p>}
      {loading ? (
        <div className="admin-products-loading" aria-label="Loading products">
          <div className="admin-loading-header shimmer" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="admin-loading-row" key={index}>
              <span className="shimmer" />
              <span className="shimmer" />
              <span className="shimmer" />
              <span className="shimmer" />
              <span className="shimmer" />
              <span className="shimmer" />
              <span className="shimmer" />
            </div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="admin-products-state" role="alert">{fetchError}</div>
      ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead><tr style={rowStyle}><th style={thStyle}>ID</th><th style={thStyle}>NAME</th><th style={thStyle}>PRICE</th><th style={thStyle}>CATEGORY</th><th style={thStyle}>STOCK</th><th style={thStyle}>TOTAL SOLD</th><th style={thStyle}>ACTIONS</th></tr></thead>
          <tbody>{products.map((product) => (
            <tr key={product._id} style={rowStyle}>
              <td style={tdStyle}>{product._id.substring(0, 8)}...</td>
              <td style={tdStyle}>{product.name}</td>
              <td style={tdStyle}>₹{Number(product.price).toFixed(2)}</td>
              <td style={tdStyle}>{product.category}</td>
              <td style={tdStyle}>{product.stock}</td>
              <td style={tdStyle} className='totalSell'>{product.totalSell || 0}</td>
              <td style={tdStyle}>
                <button
                  type="button"
                  style={editBtn}
                  onClick={() => readOnly
                    ? setLocal({ ...local, message: 'Read-only access: you cannot edit products.', error: '' })
                    : navigate(`/admin/edit-product/${product._id}`)}
                >
                  Edit
                </button>
                {!readOnly && local.confirmId === product._id ? (
                  <>
                    <button onClick={() => handleDelete(product._id)} style={deleteBtn}>Confirm</button>
                    <button onClick={() => setLocal({ ...local, confirmId: null })} style={cancelBtn}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleDelete(product._id)} style={deleteBtn}>Delete</button>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      )}
    </div>
  );
};

const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', color: '#fafafa' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.1)' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#a1a1aa', fontSize: '0.9rem' };
const tdStyle = { padding: '15px', textAlign: 'left' };
const editBtn = { background: '#3b82f6', color: '#fff', padding: '6px 12px', borderRadius: '4px', marginRight: '10px' };
const deleteBtn = { background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' };
const cancelBtn = { background: '#52525b', color: '#fff', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginLeft: '6px' };

export default AdminProducts;
