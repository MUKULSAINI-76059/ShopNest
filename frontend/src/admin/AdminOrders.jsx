import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../style/product.css';
import { isReadOnlyAdmin } from './adminAccess';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const readOnly = isReadOnlyAdmin(user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (error) {
        console.error('Unable to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    if (readOnly) {
      setNotice('Read-only access: you cannot update order status.');
      return;
    }
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) setOrders((current) => current.map((order) => order._id === id ? { ...order, status } : order));
  };

  return (
    <div className="admin-page-container" style={containerStyle}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Manage Orders</h2>
      {notice && <p role="alert" style={{ color: '#f59e0b', marginBottom: '20px' }}>{notice}</p>}
      {loading ? (
        <div className="admin-table-loading admin-orders-loading" aria-label="Loading orders">
          <div className="admin-loading-header shimmer" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="admin-loading-row shimmer-row" key={index}>
              {Array.from({ length: 6 }).map((__, cellIndex) => (
                <span className="shimmer" key={cellIndex} />
              ))}
            </div>
          ))}
        </div>
      ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead><tr style={rowStyle}><th style={thStyle}>ORDER ID</th><th style={thStyle}>USER</th><th style={thStyle}>ITEMS</th><th style={thStyle}>TOTAL</th><th style={thStyle}>DATE</th><th style={thStyle}>STATUS</th></tr></thead>
          <tbody>{orders.map((order) => (
            <tr key={order._id} style={rowStyle}>
              <td style={tdStyle}>{order._id.substring(0,)}</td>
              <td style={tdStyle}>{order.userId?.name || 'Deleted User'}</td>
              <td style={tdStyle}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {order.items?.map((item) => (
                    <div key={item._id}>
                      <strong>{item.productId?.name}</strong>
                      <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                       <strong>Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)} = ₹{(item.quantity * item.price).toFixed(2)}</strong> 
                      </div>
                    </div>
                  ))}
                </div>
              </td>
              <td style={tdStyle}>₹{Number(order.totalAmount).toFixed(2)}</td>
              <td style={tdStyle}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unavailable'}</td>
              <td style={tdStyle}>
                <select
                  className={`order-status-select status-${order.status}`}
                  value={order.status}
                  onChange={(event) => updateStatus(order._id, event.target.value)}
                  aria-label={`Update status for order ${order._id}`}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
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
const thStyle = { padding: '15px', textAlign: 'left', color: '#a1a1aa' };
const tdStyle = { padding: '15px', textAlign: 'left' };

export default AdminOrders;
