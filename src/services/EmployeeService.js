import axios from 'axios';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8080') + '/api/employees';

// Get token from localStorage and add to every request header
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

const EmployeeService = {
  getAll:          ()         => axios.get(BASE, authHeader()),
  getById:         (id)       => axios.get(`${BASE}/${id}`, authHeader()),
  create:          (data)     => axios.post(BASE, data, authHeader()),
  update:          (id, data) => axios.put(`${BASE}/${id}`, data, authHeader()),
  remove:          (id)       => axios.delete(`${BASE}/${id}`, authHeader()),
  search:          (kw)       => axios.get(`${BASE}/search?keyword=${kw}`, authHeader()),
  getStats:        ()         => axios.get(`${BASE}/stats`, authHeader()),
  getByDepartment: (dept)     => axios.get(`${BASE}/department/${dept}`, authHeader())
};

export default EmployeeService;