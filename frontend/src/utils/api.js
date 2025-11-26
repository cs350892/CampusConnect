import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - DON'T add token if it doesn't exist or is empty
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

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
