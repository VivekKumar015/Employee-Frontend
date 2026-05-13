import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HolidayService from '../services/HolidayService';

export default function HolidayList({ role }) {
  const [holidays, setHolidays] = useState([]);
  const [stats, setStats]       = useState({});
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  // Role based permissions
  const canAdd    = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const canEdit   = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const canDelete = role === 'SUPER_ADMIN';

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [holRes, statRes] = await Promise.all([
        HolidayService.getAll(),
        HolidayService.getStats()
      ]);
      setHolidays(holRes.data);
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
    const res = await HolidayService.search(kw);
    setHolidays(res.data);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    await HolidayService.remove(id);
    loadAll();
  };

  const typeColor = {
    National: '#dbeafe',
    Festival: '#fce7f3',
    Optional: '#dcfce7'
  };

  const typeEmoji = {
    National: '🇮🇳',
    Festival: '🎉',
    Optional: '⭐'
  };

  if (loading) return <p style={s.center}>⏳ Loading holidays...</p>;
  if (error)   return <p style={{ ...s.center, color:'red' }}>{error}</p>;

  return (
    <div style={s.wrap}>

      {/* Stat Cards */}
      <div style={s.cards}>
        <StatCard label="Total Holidays"    value={stats.totalHolidays    ?? 0} color="#7c3aed" />
        <StatCard label="National Holidays" value={stats.nationalHolidays ?? 0} color="#0891b2" />
        <StatCard label="Festival Holidays" value={stats.festivalHolidays ?? 0} color="#059669" />
        <StatCard label="Optional Holidays" value={stats.optionalHolidays ?? 0} color="#d97706" />
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <input
          style={s.search}
          placeholder="🔍 Search holidays..."
          value={search}
          onChange={handleSearch}
        />
        {canAdd && (
          <button style={s.addBtn} onClick={() => navigate('/holidays/add')}>
            + Add Holiday
          </button>
        )}
      </div>

      {/* Role Banner */}
      <div style={s.roleBanner}>
        {role === 'SUPER_ADMIN' && '👑 You have full access — Add, Edit and Delete holidays'}
        {role === 'ADMIN'       && '🔧 You can Add and Edit holidays but not Delete'}
        {role === 'EMPLOYEE'    && '👤 You have view-only access to holidays'}
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {['ID','Holiday Name','Date','Type','Description','Location','Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holidays.length === 0 ? (
              <tr><td colSpan="7" style={s.noData}>No holidays found</td></tr>
            ) : (
              holidays.map(h => (
                <tr key={h.id} style={s.tr}>
                  <td style={s.td}>{h.id}</td>
                  <td style={s.td}>
                    <strong>{typeEmoji[h.type]} {h.name}</strong>
                  </td>
                  <td style={s.td}>{h.date}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: typeColor[h.type] || '#f3f4f6' }}>
                      {h.type}
                    </span>
                  </td>
                  <td style={s.td}>{h.description || '—'}</td>
                  <td style={s.td}>{h.location || '—'}</td>
                  <td style={s.td}>
                    {canEdit && (
                      <button
                        style={s.editBtn}
                        onClick={() => navigate(`/holidays/edit/${h.id}`)}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        style={s.deleteBtn}
                        onClick={() => handleDelete(h.id, h.name)}
                      >
                        🗑️ Delete
                      </button>
                    )}
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
  cards:     { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' },
  card:      { background:'white', borderRadius:'12px', padding:'20px 24px', boxShadow:'0 1px 4px rgba(0,0,0,.08)' },
  cardVal:   { fontSize:'28px', fontWeight:'700', margin:'0 0 4px', color:'#111' },
  cardLabel: { fontSize:'13px', color:'#666', margin:0 },
  toolbar:   { display:'flex', gap:'12px', marginBottom:'12px' },
  search:    { flex:1, padding:'10px 16px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none' },
  addBtn:    { background:'#059669', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'14px' },
  roleBanner:{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'8px', padding:'10px 16px', marginBottom:'16px', fontSize:'13px', color:'#166534' },
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