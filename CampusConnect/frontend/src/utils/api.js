import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Student API calls
export const studentAPI = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

// Alumni API calls
export const alumniAPI = {
  getAll: async () => {
    const response = await api.get('/alumni');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/alumni/${id}`);
    return response.data;
  },

  create: async (alumniData) => {
    const response = await api.post('/alumni', alumniData);
    return response.data;
  },

  update: async (id, alumniData) => {
    const response = await api.put(`/alumni/${id}`, alumniData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/alumni/${id}`);
    return response.data;
  },
};

export default api;
