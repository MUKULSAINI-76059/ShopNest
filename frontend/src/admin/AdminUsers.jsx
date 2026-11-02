import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../style/product.css';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/auth/users', { credentials: 'include' });
        const data = await res.json();
        if (res.ok) setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (error) {
        console.error('Unable to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="admin-page-container" style={containerStyle}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>User Directory</h2>
      {loading ? (
        <div className="admin-table-loading admin-users-loading" aria-label="Loading users">
          <div className="admin-loading-header shimmer" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="admin-loading-row shimmer-row" key={index}>
              {Array.from({ length: 4 }).map((__, cellIndex) => (
                <span className="shimmer" key={cellIndex} />
              ))}
            </div>
          ))}
        </div>
      ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead><tr style={rowStyle}><th style={thStyle}>ID</th><th style={thStyle}>NAME</th><th style={thStyle}>EMAIL</th><th style={thStyle}>ROLE</th></tr></thead>
          <tbody>{users.map((item) => (
            <tr key={item._id} style={rowStyle}>
              <td style={tdStyle}>{item._id.substring(0, 8)}...</td>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{item.email}</td>
              <td style={tdStyle}>{(item.role || 'user').toUpperCase()}</td>
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

export default AdminUsers;
