
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MembershipPlans from "./pages/MembershipPlans";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import UserPayments from "./pages/user/Payments";
import UserProfile from "./pages/user/Profile";
import AdminUsers from "./pages/admin/Users";
import AdminPayments from "./pages/admin/Payments";
import AdminAttendance from "./pages/admin/Attendance";
import AdminProfile from "./pages/admin/Profile";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/membership-plans" element={<MembershipPlans />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute role="admin" />}>
              <Route element={<AppLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="attendance" element={<AdminAttendance />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Route>
            
            {/* User Routes */}
            <Route path="/user" element={<PrivateRoute role="member" />}>
              <Route element={<AppLayout />}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="payments" element={<UserPayments />} />
                <Route path="profile" element={<UserProfile />} />
              </Route>
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
