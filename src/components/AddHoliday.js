import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HolidayService from '../services/HolidayService';

export default function AddHoliday() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ name:'', date:'', type:'', description:'', location:'' });
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
    if (!form.name.trim()) err.name = 'Holiday name is required';
    if (!form.date)        err.date = 'Date is required';
    if (!form.type)        err.type = 'Type is required';
    return err;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await HolidayService.create(form);
      navigate('/holidays');
    } catch (err) {
      if (err.response?.data?.message) setApiError(err.response.data.message);
      else setApiError('Something went wrong. Try again.');
    } finally { setSaving(false); }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h2 style={s.title}>🎉 Add New Holiday</h2>
        {apiError && <div style={s.apiErr}>{apiError}</div>}
        <form onSubmit={handleSubmit}>

          {/* Holiday Name */}
          <div style={s.group}>
            <label style={s.label}>Holiday Name *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Christmas" style={{...s.input,...(errors.name?s.errBorder:{})}}
            />
            {errors.name && <p style={s.err}>{errors.name}</p>}
          </div>

          <div style={s.row}>
            {/* Date */}
            <div style={s.group}>
              <label style={s.label}>Date *</label>
              <input
                type="date" name="date" value={form.date} onChange={handleChange}
                style={{...s.input,...(errors.date?s.errBorder:{})}}
              />
              {errors.date && <p style={s.err}>{errors.date}</p>}
            </div>

            {/* Type */}
            <div style={s.group}>
              <label style={s.label}>Type *</label>
              <select
                name="type" value={form.type} onChange={handleChange}
                style={{...s.input,...(errors.type?s.errBorder:{})}}
              >
                <option value="">Select type</option>
                <option value="National">🇮🇳 National</option>
                <option value="Festival">🎉 Festival</option>
                <option value="Optional">⭐ Optional</option>
              </select>
              {errors.type && <p style={s.err}>{errors.type}</p>}
            </div>
          </div>

          {/* Description */}
          <div style={s.group}>
            <label style={s.label}>Description (optional)</label>
            <input
              name="description" value={form.description} onChange={handleChange}
              placeholder="e.g. Celebration of Christmas Day"
              style={s.input}
            />
          </div>

          {/* Location */}
          <div style={s.group}>
            <label style={s.label}>Location (optional)</label>
            <input
              name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. India"
              style={s.input}
            />
          </div>

          <div style={s.btns}>
            <button type="button" style={s.cancel} onClick={() => navigate('/holidays')}>
              Cancel
            </button>
            <button type="submit" style={s.submit} disabled={saving}>
              {saving ? 'Saving...' : '✅ Add Holiday'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  wrap:      { maxWidth:'620px', margin:'40px auto', padding:'0 20px' },
  card:      { background:'white', borderRadius:'16px', padding:'36px', boxShadow:'0 4px 20px rgba(0,0,0,.1)' },
  title:     { fontSize:'22px', fontWeight:'700', marginBottom:'24px', color:'#111' },
  row:       { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
  group:     { marginBottom:'18px' },
  label:     { display:'block', fontSize:'13px', fontWeight:'600', color:'#444', marginBottom:'6px' },
  input:     { width:'100%', padding:'10px 14px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box', outline:'none' },
  errBorder: { borderColor:'#ef4444' },
  err:       { color:'#ef4444', fontSize:'12px', marginTop:'4px' },
  apiErr:    { background:'#fef2f2', color:'#dc2626', padding:'12px 16px', borderRadius:'8px', marginBottom:'20px', fontSize:'14px' },
  btns:      { display:'flex', justifyContent:'flex-end', gap:'12px', marginTop:'8px' },
  cancel:    { padding:'10px 24px', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer', background:'white', fontSize:'14px' },
  submit:    { padding:'10px 24px', background:'#059669', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'600' }
};