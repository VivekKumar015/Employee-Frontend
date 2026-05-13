import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

export default function EmployeeList({ role }) {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats]         = useState({});
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  // Role based permissions
  const canAdd    = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const canEdit   = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const canDelete = role === 'SUPER_ADMIN';

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
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/';
      } else {
        setError('Cannot connect to backend.');
      }
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

  const roleColor = {
    SUPER_ADMIN: '#fde68a',
    ADMIN:       '#bbf7d0',
    EMPLOYEE:    '#e0e7ff'
  };

  if (loading) return <p style={s.center}>⏳ Loading employees...</p>;
  if (error)   return <p style={{ ...s.center, color:'red' }}>{error}</p>;

  return (
    <div style={s.wrap}>

      {/* Stat Cards */}
      <div style={s.cards}>
        <StatCard label="Total Employees" value={stats.totalEmployees ?? 0}                                  color="#7c3aed" />
        <StatCard label="Average Salary"  value={`$${Math.round(stats.avgSalary   ?? 0).toLocaleString()}`} color="#0891b2" />
        <StatCard label="Total Payroll"   value={`$${Math.round(stats.totalSalary ?? 0).toLocaleString()}`} color="#059669" />
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <input
          style={s.search}
          placeholder="🔍 Search by name or department..."
          value={search}
          onChange={handleSearch}
        />
        {/* Only SUPER_ADMIN and ADMIN see Add button */}
        {canAdd && (
          <button style={s.addBtn} onClick={() => navigate('/add')}>
            + Add Employee
          </button>
        )}
      </div>

      {/* Role info banner */}
      <div style={s.roleBanner}>
        {role === 'SUPER_ADMIN' && '👑 You have full access — Add, Edit and Delete'}
        {role === 'ADMIN'       && '🔧 You can Add and Edit employees but not Delete'}
        {role === 'EMPLOYEE'    && '👤 You have view-only access'}
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {['ID','Name','Email','Department','Job Title','Salary','Role','Actions'].map(h => (
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
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: roleColor[e.role] || '#f3f4f6' }}>
                      {e.role || '—'}
                    </span>
                  </td>
                  <td style={s.td}>
                    {/* Edit button — only SUPER_ADMIN and ADMIN */}
                    {canEdit && (
                      <button style={s.editBtn} onClick={() => navigate(`/edit/${e.id}`)}>
                        ✏️ Edit
                      </button>
                    )}
                    {/* Delete button — only SUPER_ADMIN */}
                    {canDelete && (
                      <button style={s.deleteBtn} onClick={() => handleDelete(e.id, e.firstName)}>
                        🗑️ Delete
                      </button>
                    )}
                    {/* Employee sees nothing */}
                    {!canEdit && !canDelete && (
                      <span style={{ color:'#999', fontSize:'12px' }}>View only</span>
                    )}
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
    <div style={{ ...s.card, borderTop:`4px solid ${color}` }}>
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
  toolbar:   { display:'flex', gap:'12px', marginBottom:'12px' },
  search:    { flex:1, padding:'10px 16px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none' },
  addBtn:    { background:'#7c3aed', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'14px' },
  roleBanner:{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:'8px', padding:'10px 16px', marginBottom:'16px', fontSize:'13px', color:'#0369a1' },
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