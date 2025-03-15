
import api from './api';
import { toast } from 'sonner';
import { Role } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
  role: Role;
}

interface LoginResponse {
  token: string;
  user: any;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Save token to localStorage
      localStorage.setItem('authToken', response.data.token);
      
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || 'Login failed';
      toast.error(errorMsg);
      return null;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
  }
};
