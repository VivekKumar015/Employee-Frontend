import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import HolidayList from './components/HolidayList';
import AddHoliday from './components/AddHoliday';
import EditHoliday from './components/EditHoliday';

export default function App() {
  const [role, setRole]           = useState(localStorage.getItem('role'));
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName'));

  const handleLogin = (userRole) => {
    setRole(userRole);
    setFirstName(localStorage.getItem('firstName'));
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setFirstName(null);
  };

  if (!role) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <Navigation
        firstName={firstName}
        role={role}
        onLogout={handleLogout}
      />
      <div style={styles.page}>
        <Routes>
          {/* Employee Routes */}
          <Route path="/"             element={<EmployeeList role={role} />} />
          <Route path="/add"          element={<AddEmployee />} />
          <Route path="/edit/:id"     element={<EditEmployee />} />

          {/* Holiday Routes */}
          <Route path="/holidays"          element={<HolidayList role={role} />} />
          <Route path="/holidays/add"      element={<AddHoliday />} />
          <Route path="/holidays/edit/:id" element={<EditHoliday />} />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Navigation component with active tab highlighting
function Navigation({ firstName, role, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path));

  const roleColor = {
    SUPER_ADMIN: '#7c3aed',
    ADMIN:       '#059669',
    EMPLOYEE:    '#0891b2'
  };

  return (
    <nav style={styles.nav}>
      {/* Left — Brand */}
      <span style={styles.brand}>👥 Employee Manager</span>

      {/* Center — Page Tabs */}
      <div style={styles.tabs}>
        <Link
          to="/"
          style={{
            ...styles.tab,
            ...(isActive('/') && !isActive('/holidays') ? styles.activeTab : {})
          }}
        >
          👤 Employees
        </Link>
        <Link
          to="/holidays"
          style={{
            ...styles.tab,
            ...(isActive('/holidays') ? styles.activeTab : {})
          }}
        >
          🎉 Holidays
        </Link>
      </div>

      {/* Right — User info + Logout */}
      <div style={styles.navRight}>
        <span style={styles.welcome}>Hi, {firstName}!</span>
        <span style={{
          ...styles.roleBadge,
          background: roleColor[role] || '#7c3aed'
        }}>
          {role}
        </span>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav:        { background:'#1e1e2e', padding:'0 32px', display:'flex', justifyContent:'space-between', alignItems:'center', height:'56px' },
  brand:      { color:'white', fontSize:'18px', fontWeight:'700' },
  tabs:       { display:'flex', gap:'4px' },
  tab:        { color:'#aaa', textDecoration:'none', padding:'6px 18px', borderRadius:'8px', fontSize:'14px', fontWeight:'500', transition:'all .2s' },
  activeTab:  { background:'#7c3aed', color:'white' },
  navRight:   { display:'flex', alignItems:'center', gap:'12px' },
  welcome:    { color:'#aaa', fontSize:'14px' },
  roleBadge:  { color:'white', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
  logoutBtn:  { background:'#ef4444', color:'white', border:'none', padding:'7px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'600' },
  page:       { minHeight:'calc(100vh - 56px)', background:'#f5f5f5' }
};