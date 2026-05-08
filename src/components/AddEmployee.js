import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ firstName:'', lastName:'', email:'', department:'', salary:'', jobTitle:'', phone:'' });
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const err = {};
    if (!form.firstName.trim())            err.firstName  = 'First name is required';
    if (!form.lastName.trim())             err.lastName   = 'Last name is required';
    if (!form.email.trim())                err.email      = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Invalid email format';
    if (!form.department)                  err.department = 'Please select a department';
    if (!form.salary || form.salary <= 0)  err.salary     = 'Enter a valid salary';
    return err;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await EmployeeService.create(form);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) setApiError(err.response.data.message);
      else if (err.response?.data)     setErrors(err.response.data);
      else                             setApiError('Something went wrong. Try again.');
    } finally { setSaving(false); }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h2 style={s.title}>➕ Add New Employee</h2>

        {apiError && <div style={s.apiErr}>{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.row}>
            <Field label="First Name *" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="e.g. John" />
            <Field label="Last Name *"  name="lastName"  value={form.lastName}  onChange={handleChange} error={errors.lastName}  placeholder="e.g. Smith" />
          </div>

          <Field label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="john@company.com" />

          <div style={s.row}>
            <div style={s.group}>
              <label style={s.label}>Department *</label>
              <select name="department" value={form.department} onChange={handleChange}
                style={{ ...s.input, ...(errors.department ? s.errBorder : {}) }}>
                <option value="">Select department</option>
                {['Engineering','Marketing','HR','Finance','Sales'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <p style={s.err}>{errors.department}</p>}
            </div>
            <Field label="Salary ($) *" name="salary" type="number" value={form.salary} onChange={handleChange} error={errors.salary} placeholder="e.g. 75000" />
          </div>

          <div style={s.row}>
            <Field label="Job Title (optional)" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Senior Developer" />
            <Field label="Phone (optional)"     name="phone"    value={form.phone}    onChange={handleChange} placeholder="e.g. 9876543210" />
          </div>

          <div style={s.btns}>
            <button type="button" style={s.cancel} onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" style={s.submit} disabled={saving}>
              {saving ? 'Saving...' : '✅ Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div style={s.group}>
      <label style={s.label}>{label}</label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder}
        style={{ ...s.input, ...(error ? s.errBorder : {}) }}
      />
      {error && <p style={s.err}>{error}</p>}
    </div>
  );
}

const s = {
  wrap:      { maxWidth:'720px', margin:'40px auto', padding:'0 20px' },
  card:      { background:'white', borderRadius:'16px', padding:'36px', boxShadow:'0 4px 20px rgba(0,0,0,.1)' },
  title:     { fontSize:'22px', fontWeight:'700', marginBottom:'24px', color:'#111' },
  row:       { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
  group:     { marginBottom:'18px' },
  label:     { display:'block', fontSize:'13px', fontWeight:'600', color:'#444', marginBottom:'6px' },
  input:     { width:'100%', padding:'10px 14px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box', outline:'none' },
  errBorder: { borderColor:'#ef4444' },
  err:       { color:'#ef4444', fontSize:'12px', marginTop:'4px', margin:'4px 0 0' },
  apiErr:    { background:'#fef2f2', color:'#dc2626', padding:'12px 16px', borderRadius:'8px', marginBottom:'20px', fontSize:'14px' },
  btns:      { display:'flex', justifyContent:'flex-end', gap:'12px', marginTop:'8px' },
  cancel:    { padding:'10px 24px', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer', background:'white', fontSize:'14px' },
  submit:    { padding:'10px 24px', background:'#7c3aed', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'600' }
};