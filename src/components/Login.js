import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, role, firstName } = response.data;

      // Save everything to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('firstName', firstName);

      // Tell App.js login was successful
      onLogin(role);

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.logo}>👥</div>
        <h2 style={s.title}>Employee Manager</h2>
        <p style={s.subtitle}>Sign in to your account</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.group}>
            <label style={s.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@company.com"
              style={s.input}
              required
            />
          </div>

          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={s.input}
              required
            />
          </div>

          <button
            type="submit"
            style={s.button}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Test credentials hint */}
        <div style={s.hint}>
          <p style={s.hintTitle}>Test Credentials:</p>
          <p style={s.hintText}>👑 john@company.com → SUPER_ADMIN</p>
          <p style={s.hintText}>🔧 sarah@company.com → ADMIN</p>
          <p style={s.hintText}>👤 mike@company.com → EMPLOYEE</p>
          <p style={s.hintText}>🔑 Password: password123</p>
        </div>

      </div>
    </div>
  );
}

const s = {
  page:      { minHeight:'100vh', background:'linear-gradient(135deg, #1e1e2e 0%, #2d2b55 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  card:      { background:'white', borderRadius:'20px', padding:'40px', width:'100%', maxWidth:'420px', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' },
  logo:      { fontSize:'48px', textAlign:'center', marginBottom:'12px' },
  title:     { fontSize:'24px', fontWeight:'700', textAlign:'center', margin:'0 0 6px', color:'#111' },
  subtitle:  { fontSize:'14px', color:'#666', textAlign:'center', marginBottom:'28px' },
  error:     { background:'#fef2f2', color:'#dc2626', padding:'12px 16px', borderRadius:'8px', marginBottom:'20px', fontSize:'14px', textAlign:'center' },
  group:     { marginBottom:'18px' },
  label:     { display:'block', fontSize:'13px', fontWeight:'600', color:'#444', marginBottom:'6px' },
  input:     { width:'100%', padding:'12px 16px', border:'1px solid #ddd', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', outline:'none' },
  button:    { width:'100%', padding:'13px', background:'#7c3aed', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'600', cursor:'pointer', marginTop:'8px' },
  hint:      { marginTop:'24px', background:'#f8f9fa', borderRadius:'10px', padding:'16px' },
  hintTitle: { fontSize:'13px', fontWeight:'700', color:'#444', margin:'0 0 8px' },
  hintText:  { fontSize:'12px', color:'#666', margin:'4px 0' }
};