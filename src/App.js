import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';

export default function App() {
  // Check if user is already logged in
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName'));

  const handleLogin = (userRole) => {
    setRole(userRole);
    setFirstName(localStorage.getItem('firstName'));
  };

  const handleLogout = () => {
    // Clear everything from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('firstName');
    setRole(null);
    setFirstName(null);
  };

  // If not logged in → show Login page
  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  // If logged in → show the app
  return (
    <Router>
      <nav style={styles.nav}>
        <span style={styles.brand}>👥 Employee Manager</span>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Welcome, {firstName}!</span>
          <span style={styles.roleBadge}>{role}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.page}>
        <Routes>
          <Route path="/"         element={<EmployeeList role={role} />} />
          <Route path="/add"      element={<AddEmployee />} />
          <Route path="/edit/:id" element={<EditEmployee />} />
          <Route path="*"         element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  nav:       { background:'#1e1e2e', padding:'14px 32px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  brand:     { color:'white', fontSize:'18px', fontWeight:'700' },
  navRight:  { display:'flex', alignItems:'center', gap:'12px' },
  welcome:   { color:'#aaa', fontSize:'14px' },
  roleBadge: { background:'#7c3aed', color:'white', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
  logoutBtn: { background:'#ef4444', color:'white', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'600' },
  page:      { minHeight:'calc(100vh - 54px)', background:'#f5f5f5' }
};