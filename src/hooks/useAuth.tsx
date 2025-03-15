import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthState, User, Role } from "@/types";
import { toast } from "sonner";
import authService from "@/services/authService";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateProfile: (profileData: any) => Promise<User | null>;
  changePassword: (passwordData: { currentPassword: string, newPassword: string }) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : defaultAuthState;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          
          if (user) {
            setAuth({
              isAuthenticated: true,
              user,
              role: user.role
            });
          } else {
            setAuth(defaultAuthState);
            localStorage.removeItem("authToken");
            localStorage.removeItem("auth");
          }
        } catch (error) {
          console.error("Auth check error:", error);
          setAuth(defaultAuthState);
          localStorage.removeItem("authToken");
          localStorage.removeItem("auth");
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const login = async (email: string, password: string, role: Role): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await authService.login({ email, password, role });
      
      if (response && response.token && response.user) {
        const newAuthState = {
          isAuthenticated: true,
          user: response.user,
          role: response.user.role,
        };
        
        setAuth(newAuthState);
        
        if (response.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
        
        toast.success("Login successful!");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    
    try {
      const user = await authService.register(userData);
      
      if (user) {
        toast.success("Registration successful!");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setAuth(defaultAuthState);
    navigate("/login");
  };

  const updateProfile = async (profileData: any): Promise<User | null> => {
    setLoading(true);
    
    try {
      const updatedUser = await authService.updateProfile(profileData);
      
      if (updatedUser) {
        setAuth({
          ...auth,
          user: updatedUser
        });
        toast.success("Profile updated successfully");
        return updatedUser;
      }
      
      return null;
    } catch (error) {
      console.error("Profile update error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData: { currentPassword: string, newPassword: string }): Promise<boolean> => {
    setLoading(true);
    
    try {
      const success = await authService.changePassword(passwordData);
      return success;
    } catch (error) {
      console.error("Password change error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        loading,
        updateProfile,
        changePassword,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
