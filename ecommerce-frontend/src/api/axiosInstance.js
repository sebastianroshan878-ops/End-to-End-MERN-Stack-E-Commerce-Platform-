import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      console.error('Error reading auth token from localStorage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired auth session if needed
      // Note: Do not auto-reload if already on login page
      if (!window.location.pathname.includes('/login')) {
        console.warn('Session expired or unauthorized. Please log in.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
