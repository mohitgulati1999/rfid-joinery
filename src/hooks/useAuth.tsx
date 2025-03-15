
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthState, User, Role } from "@/types";
import { toast } from "sonner";

// Mock users for demo
const mockUsers = [
  {
    id: "admin1",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as Role,
    createdAt: new Date(),
  },
  {
    id: "member1",
    email: "member@example.com",
    password: "member123",
    name: "Member User",
    role: "member" as Role,
    rfidNumber: "RF123456",
    membershipHours: 50,
    totalHoursUsed: 10,
    isActive: true,
    createdAt: new Date(),
  },
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
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
    // Simulate checking token validity
    const checkAuth = async () => {
      setLoading(true);
      const storedAuth = localStorage.getItem("auth");
      
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth);
          // In a real app, you would validate the token with your backend
          setAuth(parsedAuth);
        } catch (error) {
          console.error("Failed to parse auth data:", error);
          setAuth(defaultAuthState);
          localStorage.removeItem("auth");
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: Role): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call with mock data
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password && u.role === role
      );

      if (user) {
        // Remove password from user object
        const { password, ...userWithoutPassword } = user;
        const newAuthState = {
          isAuthenticated: true,
          user: userWithoutPassword as User,
          role: user.role,
        };
        
        setAuth(newAuthState);
        localStorage.setItem("auth", JSON.stringify(newAuthState));
        
        // Navigate to appropriate dashboard
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
        
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Invalid credentials or role selection!");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth(defaultAuthState);
    localStorage.removeItem("auth");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        loading,
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
