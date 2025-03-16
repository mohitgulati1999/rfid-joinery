
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
    // BYPASS AUTHENTICATION: No actual API call, just return mock data
    const mockToken = "mock-auth-token-for-testing";
    const mockUser: User = {
      id: "mock-user-id",
      email: credentials.email || "test@example.com",
      name: credentials.email ? credentials.email.split('@')[0] : "Test User",
      role: credentials.role || "member",
      // Add relevant fields based on role
      ...(credentials.role === "member" && {
        rfidNumber: "RF123456",
        membershipHours: 50,
        totalHoursUsed: 15,
        isActive: true,
        remainingHours: 35,
      })
    };
    
    // Store the mock token in localStorage
    localStorage.setItem('authToken', mockToken);
    
    toast.success("Logged in successfully! (Auth bypass active)");
    return {
      token: mockToken,
      user: mockUser
    };
  },
  
  register: async (userData: any): Promise<User | null> => {
    // BYPASS AUTHENTICATION: No actual API call, just return mock data
    const mockUser: User = {
      id: "mock-user-id-" + Math.random().toString(36).substring(7),
      email: userData.email || "newuser@example.com",
      name: userData.name || "New User",
      role: userData.role || "member",
      // Add relevant fields based on role
      ...(userData.role === "member" && {
        rfidNumber: userData.rfidNumber || "RF" + Math.floor(100000 + Math.random() * 900000),
        membershipHours: userData.membershipHours || 50,
        totalHoursUsed: 0,
        isActive: true,
        remainingHours: userData.membershipHours || 50,
      })
    };
    
    toast.success('Registration successful! Please login.');
    return mockUser;
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    // BYPASS AUTHENTICATION: Check if we have a token and return mock user
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return null;
    }

    // Get stored user or create default mock user
    const storedAuth = localStorage.getItem('auth');
    const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
    
    if (parsedAuth && parsedAuth.user) {
      return parsedAuth.user;
    }
    
    // Default mock user if no stored user
    return {
      id: "default-mock-user",
      email: "default@example.com",
      name: "Default User",
      role: "member",
      rfidNumber: "RF123456",
      membershipHours: 50,
      totalHoursUsed: 15,
      isActive: true,
      remainingHours: 35,
    };
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
  },
  
  updateProfile: async (profileData: any): Promise<User | null> => {
    // BYPASS AUTHENTICATION: Update the stored user data
    const storedAuth = localStorage.getItem('auth');
    const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
    
    if (parsedAuth && parsedAuth.user) {
      const updatedUser = { ...parsedAuth.user, ...profileData };
      const updatedAuth = { ...parsedAuth, user: updatedUser };
      
      localStorage.setItem('auth', JSON.stringify(updatedAuth));
      toast.success('Profile updated successfully');
      return updatedUser;
    }
    
    return null;
  },
  
  changePassword: async (passwordData: { currentPassword: string, newPassword: string }): Promise<boolean> => {
    // BYPASS AUTHENTICATION: Always return success
    toast.success('Password changed successfully (Auth bypass active)');
    return true;
  }
};

export default authService;
