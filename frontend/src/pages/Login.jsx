import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../style/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState({ message: '', error: '' });
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        showToast('Login successful.');
        navigate('/');
      } else {
        setLocal({ message: '', error: data.message || 'Login failed' });
      }
    } catch (error) {
      setLocal({ message: '', error: 'Unable to connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {local.error && <p style={{ color: '#ef4444' }}>{local.error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading} className={`btn${loading ? ' is-loading' : ''}`}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
