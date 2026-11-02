import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/auth.css';

const EditProfile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState({ message: '', error: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({ name: user.name || '', email: user.email || '', password: '' });
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocal({ message: '', error: '' });
    setLoading(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        setLocal({ message: '', error: data.message || 'Unable to update profile.' });
        return;
      }

      login(data.user);
      setLocal({ message: data.message, error: '' });
      setFormData((current) => ({ ...current, password: '' }));
    } catch (error) {
      setLocal({ message: '', error: 'Unable to connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Edit Profile</h2>
        {local.message && <p style={{ color: '#10b981' }}>{local.message}</p>}
        {local.error && <p style={{ color: '#ef4444' }}>{local.error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          required
        />
        <input
          type="password"
          placeholder="New password (optional)"
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
          minLength="6"
        />
        <button type="submit" disabled={loading} className={`btn${loading ? ' is-loading' : ''}`}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <Link to="/profile">Back to Profile</Link>
      </form>
    </div>
  );
};

export default EditProfile;
