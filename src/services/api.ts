
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// BYPASS API CALLS: Add interceptor that mocks responses
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    
    // For testing, log API calls to console
    console.log(`API ${config.method?.toUpperCase()} request to ${config.url}`);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Unauthorized error handling
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('auth');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      }
      
      // Display error message from the server
      const errorMessage = error.response.data?.msg || error.response.data?.message || 'An error occurred';
      if (errorMessage) {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // No response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Other errors
      toast.error('Request failed. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
