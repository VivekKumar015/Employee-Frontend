import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats]         = useState({});
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [empRes, statRes] = await Promise.all([
        EmployeeService.getAll(),
        EmployeeService.getStats()
      ]);
      setEmployees(empRes.data);
      setStats(statRes.data);
    } catch {
      setError('Cannot connect to backend. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const kw = e.target.value;
    setSearch(kw);
    if (kw.trim() === '') { loadAll(); return; }
    const res = await EmployeeService.search(kw);
    setEmployees(res.data);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    await EmployeeService.remove(id);
    loadAll();
  };

  const deptColor = {
    Engineering: '#dbeafe',
    Marketing:   '#fce7f3',
    HR:          '#dcfce7',
    Finance:     '#fef9c3',
    Sales:       '#ede9fe'
  };

  if (loading) return <p style={s.center}>⏳ Loading employees...</p>;
  if (error)   return <p style={{ ...s.center, color: 'red' }}>{error}</p>;

  return (
    <div style={s.wrap}>

      {/* ── Stat Cards ── */}
      <div style={s.cards}>
        <StatCard label="Total Employees" value={stats.totalEmployees ?? 0}                                    color="#7c3aed" />
        <StatCard label="Average Salary"  value={`$${Math.round(stats.avgSalary   ?? 0).toLocaleString()}`}   color="#0891b2" />
        <StatCard label="Total Payroll"   value={`$${Math.round(stats.totalSalary ?? 0).toLocaleString()}`}   color="#059669" />
      </div>

      {/* ── Toolbar ── */}
      <div style={s.toolbar}>
        <input
          style={s.search}
          placeholder="🔍  Search by name or department..."
          value={search}
          onChange={handleSearch}
        />
        <button style={s.addBtn} onClick={() => navigate('/add')}>+ Add Employee</button>
      </div>

      {/* ── Table ── */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {['ID','Name','Email','Department','Job Title','Salary','Phone','Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan="8" style={s.noData}>No employees found</td></tr>
            ) : (
              employees.map(e => (
                <tr key={e.id} style={s.tr}>
                  <td style={s.td}>{e.id}</td>
                  <td style={s.td}><strong>{e.firstName} {e.lastName}</strong></td>
                  <td style={s.td}>{e.email}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: deptColor[e.department] || '#f3f4f6' }}>
                      {e.department}
                    </span>
                  </td>
                  <td style={s.td}>{e.jobTitle || '—'}</td>
                  <td style={s.td}>${e.salary?.toLocaleString()}</td>
                  <td style={s.td}>{e.phone || '—'}</td>
                  <td style={s.td}>
                    <button style={s.editBtn}   onClick={() => navigate(`/edit/${e.id}`)}>✏️ Edit</button>
                    <button style={s.deleteBtn} onClick={() => handleDelete(e.id, e.firstName)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...s.card, borderTop: `4px solid ${color}` }}>
      <p style={s.cardVal}>{value}</p>
      <p style={s.cardLabel}>{label}</p>
    </div>
  );
}

const s = {
  wrap:      { maxWidth:'1200px', margin:'0 auto', padding:'28px 20px' },
  cards:     { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px' },
  card:      { background:'white', borderRadius:'12px', padding:'20px 24px', boxShadow:'0 1px 4px rgba(0,0,0,.08)' },
  cardVal:   { fontSize:'28px', fontWeight:'700', margin:'0 0 4px', color:'#111' },
  cardLabel: { fontSize:'13px', color:'#666', margin:0 },
  toolbar:   { display:'flex', gap:'12px', marginBottom:'16px' },
  search:    { flex:1, padding:'10px 16px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none' },
  addBtn:    { background:'#7c3aed', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'14px' },
  tableWrap: { background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.08)' },
  table:     { width:'100%', borderCollapse:'collapse' },
  th:        { background:'#f9fafb', padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#555', borderBottom:'1px solid #eee' },
  tr:        { borderBottom:'1px solid #f5f5f5' },
  td:        { padding:'13px 16px', fontSize:'14px', color:'#333' },
  badge:     { padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500' },
  editBtn:   { background:'#fbbf24', color:'#333', border:'none', padding:'5px 12px', borderRadius:'6px', cursor:'pointer', marginRight:'6px', fontSize:'12px' },
  deleteBtn: { background:'#ef4444', color:'white', border:'none', padding:'5px 12px', borderRadius:'6px', cursor:'pointer', fontSize:'12px' },
  noData:    { textAlign:'center', padding:'40px', color:'#999' },
  center:    { textAlign:'center', padding:'60px', fontSize:'16px' }
};