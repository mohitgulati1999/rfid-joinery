
import api from './api';
import { toast } from 'sonner';
import { Role, User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
  role: Role;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Save token to localStorage
      localStorage.setItem('authToken', response.data.token);
      
      return response.data;
    } catch (error: any) {
      // Error handling is done in the api interceptor
      return null;
    }
  },
  
  register: async (userData: any): Promise<User | null> => {
    try {
      // Choose the appropriate endpoint based on the role
      const endpoint = userData.role === 'admin' 
        ? '/users/admins' 
        : '/users/members';
      
      const response = await api.post(endpoint, userData);
      toast.success('Registration successful! Please login.');
      return response.data.user || response.data.member || response.data.admin;
    } catch (error) {
      // Error handling is done in the api interceptor
      return null;
    }
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
  },
  
  updateProfile: async (profileData: any): Promise<User | null> => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      // Error handling is done in the api interceptor
      return null;
    }
  },
  
  changePassword: async (passwordData: { currentPassword: string, newPassword: string }): Promise<boolean> => {
    try {
      await api.put('/auth/password', passwordData);
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      // Error handling is done in the api interceptor
      return false;
    }
  }
};

export default authService;
