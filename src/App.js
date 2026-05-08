import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';

function App() {
  return (
    <Router>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>👥 Employee Manager</Link>
        <div>
          <Link to="/" style={styles.link}>All Employees</Link>
          <Link to="/add" style={styles.addBtn}>+ Add New</Link>
        </div>
      </nav>
      <div style={styles.page}>
        <Routes>
          <Route path="/"         element={<EmployeeList />} />
          <Route path="/add"      element={<AddEmployee />} />
          <Route path="/edit/:id" element={<EditEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  nav:    { background:'#1e1e2e', padding:'14px 32px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  brand:  { color:'white', textDecoration:'none', fontSize:'18px', fontWeight:'700' },
  link:   { color:'#aaa', textDecoration:'none', marginRight:'24px', fontSize:'14px' },
  addBtn: { background:'#7c3aed', color:'white', padding:'8px 18px', borderRadius:'8px', textDecoration:'none', fontSize:'14px' },
  page:   { minHeight:'calc(100vh - 54px)', background:'#f5f5f5' }
};

export default App;