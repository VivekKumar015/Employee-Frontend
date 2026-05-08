import axios from 'axios';

// In production (Netlify), REACT_APP_API_URL is set in Netlify environment variables
// In local dev, it falls back to localhost:8080
const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api/employees';

const EmployeeService = {
  getAll:          ()          => axios.get(BASE),
  getById:         (id)        => axios.get(`${BASE}/${id}`),
  create:          (data)      => axios.post(BASE, data),
  update:          (id, data)  => axios.put(`${BASE}/${id}`, data),
  remove:          (id)        => axios.delete(`${BASE}/${id}`),
  search:          (kw)        => axios.get(`${BASE}/search?keyword=${kw}`),
  getStats:        ()          => axios.get(`${BASE}/stats`),
  getByDepartment: (dept)      => axios.get(`${BASE}/department/${dept}`)
};

export default EmployeeService;