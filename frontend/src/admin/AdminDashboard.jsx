import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaBoxesStacked, FaTruckFast, FaUsers } from 'react-icons/fa6';
import '../style/product.css';
import { isReadOnlyAdmin } from './adminAccess';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
        }
      } catch (error) {
        console.error('Unable to fetch admin stats:', error);
        setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
      }
    };

    fetchStats();
  }, [user, navigate]);

  const cardStyle = {
    padding: '25px',
    background: '#18181b',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '10px'
  };
  const numberStyle = { fontSize: '2.5rem', fontWeight: '700', color: '#f97316' };
  const readOnly = isReadOnlyAdmin(user);
  const handleAdminAction = (action) => {
    if (readOnly) {
      setNotice('Read-only access: you cannot add, edit, or delete anything.');
      return;
    }
    navigate(action);
  };

  return (
    <div className="admin-dashboard-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
        <img src="/ShopNestLogo.png" alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '8px', objectFit: 'cover' }} />
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      </div>
      <p style={{ color: '#a1a1aa', marginBottom: '30px', fontSize: '1.1rem', marginTop:"10px" }}>
        Welcome back, <span style={{ color: '#fff', letterSpacing:"2px" }}>{user?.name}</span>
      </p>
      {stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={cardStyle}><h4>Total Orders</h4><div style={numberStyle}>{stats.totalOrders}</div></div>
          <div style={cardStyle}><h4>Total Products</h4><div style={numberStyle}>{stats.totalProducts}</div></div>
          <div style={cardStyle}><h4>Total Users</h4><div style={numberStyle}>{stats.totalUsers}</div></div>
          <div style={cardStyle}><h4>Total Revenue</h4><div style={numberStyle}>₹{Number(stats.totalRevenue).toFixed(2)}</div></div>
        </div>
      ) : (
        <div className="admin-metrics-loading" aria-label="Loading metrics">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="admin-metric-skeleton" key={index}>
              <span className="admin-skeleton-line admin-skeleton-label shimmer" />
              <span className="admin-skeleton-line admin-skeleton-value shimmer" />
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '40px', padding: '30px', background: '#18181b', borderRadius: '12px' }}>
        <h3 style={{ marginBottom: '25px', color: '#f97316' }}>Administrative Controls</h3>
        {notice && <p role="alert" style={{ color: '#f59e0b', marginBottom: '20px' }}>{notice}</p>}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button className="btn admin-control-btn add-btn" onClick={() => handleAdminAction('/admin/add-product')}><FaBoxOpen /> Add Product</button>
          <button className="btn admin-control-btn products-btn" onClick={() => navigate('/admin/products')}><FaBoxesStacked /> Manage Products</button>
          <button className="btn admin-control-btn orders-btn" onClick={() => navigate('/admin/orders')}><FaTruckFast /> Manage Orders</button>
          <button className="btn admin-control-btn users-btn" onClick={() => navigate('/admin/users')}><FaUsers /> Users Directory</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
