import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm]         = useState({ firstName:'', lastName:'', email:'', department:'', salary:'', jobTitle:'', phone:'' });
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    EmployeeService.getById(id)
      .then(r => { setForm(r.data); setLoading(false); })
      .catch(() => { alert('Employee not found!'); navigate('/'); });
  }, [id]);

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await EmployeeService.update(id, form);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) setApiError(err.response.data.message);
      else if (err.response?.data)     setErrors(err.response.data);
      else                             setApiError('Update failed. Try again.');
    } finally { setSaving(false); }
  };

  if (loading) return <p style={{ textAlign:'center', padding:'60px', fontSize:'16px' }}>⏳ Loading...</p>;

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h2 style={s.title}>✏️ Edit Employee <span style={{ color:'#7c3aed' }}>#{id}</span></h2>

        {apiError && <div style={s.apiErr}>{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.row}>
            <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
            <Field label="Last Name"  name="lastName"  value={form.lastName}  onChange={handleChange} error={errors.lastName} />
          </div>

          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />

          <div style={s.row}>
            <div style={s.group}>
              <label style={s.label}>Department</label>
              <select name="department" value={form.department} onChange={handleChange} style={s.input}>
                <option value="">Select department</option>
                {['Engineering','Marketing','HR','Finance','Sales'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <Field label="Salary ($)" name="salary" type="number" value={form.salary} onChange={handleChange} error={errors.salary} />
          </div>

          <div style={s.row}>
            <Field label="Job Title" name="jobTitle" value={form.jobTitle || ''} onChange={handleChange} />
            <Field label="Phone"     name="phone"    value={form.phone    || ''} onChange={handleChange} />
          </div>

          <div style={s.btns}>
            <button type="button" style={s.cancel} onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" style={s.submit} disabled={saving}>
              {saving ? 'Updating...' : '✅ Update Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, type = 'text' }) {
  return (
    <div style={s.group}>
      <label style={s.label}>{label}</label>
      <input
        type={type} name={name} value={value}
        onChange={onChange}
        style={{ ...s.input, ...(error ? { borderColor:'#ef4444' } : {}) }}
      />
      {error && <p style={s.err}>{error}</p>}
    </div>
  );
}

const s = {
  wrap:    { maxWidth:'720px', margin:'40px auto', padding:'0 20px' },
  card:    { background:'white', borderRadius:'16px', padding:'36px', boxShadow:'0 4px 20px rgba(0,0,0,.1)' },
  title:   { fontSize:'22px', fontWeight:'700', marginBottom:'24px', color:'#111' },
  row:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
  group:   { marginBottom:'18px' },
  label:   { display:'block', fontSize:'13px', fontWeight:'600', color:'#444', marginBottom:'6px' },
  input:   { width:'100%', padding:'10px 14px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box', outline:'none' },
  err:     { color:'#ef4444', fontSize:'12px', marginTop:'4px' },
  apiErr:  { background:'#fef2f2', color:'#dc2626', padding:'12px 16px', borderRadius:'8px', marginBottom:'20px', fontSize:'14px' },
  btns:    { display:'flex', justifyContent:'flex-end', gap:'12px', marginTop:'8px' },
  cancel:  { padding:'10px 24px', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer', background:'white', fontSize:'14px' },
  submit:  { padding:'10px 24px', background:'#059669', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'600' }
};