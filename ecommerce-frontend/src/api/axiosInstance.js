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

// Response interceptor to handle common errors and guard against HTML rewrite responses
axiosInstance.interceptors.response.use(
  (response) => {
    // If the server returned HTML (e.g., SPA index.html fallback from a misconfigured API route)
    const contentType = response.headers['content-type'] || '';
    if (
      contentType.includes('text/html') ||
      (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE'))
    ) {
      const err = new Error(
        'Backend API returned HTML instead of JSON. Ensure the server API is deployed and reachable at ' +
          API_BASE_URL
      );
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired auth session if needed
      if (!window.location.pathname.includes('/login')) {
        console.warn('Session expired or unauthorized. Please log in.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
