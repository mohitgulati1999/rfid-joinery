
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarGroupContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  CreditCard,
  Clock,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const adminMenuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: Users,
      label: "Users",
      path: "/admin/users",
    },
    {
      icon: CreditCard,
      label: "Payments",
      path: "/admin/payments",
    },
    {
      icon: Clock,
      label: "Attendance",
      path: "/admin/attendance",
    },
    {
      icon: Settings,
      label: "Profile",
      path: "/admin/profile",
    },
  ];

  const memberMenuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/user/dashboard",
    },
    {
      icon: CreditCard,
      label: "Payments",
      path: "/user/payments",
    },
    {
      icon: User,
      label: "Profile",
      path: "/user/profile",
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : memberMenuItems;

  return (
    <Sidebar 
      className="bg-black border-r border-white/10"
      variant="sidebar"
      collapsible="icon"
    >
      {/* Add the rail to enable the middle toggle button */}
      <SidebarRail />
      
      <SidebarHeader className="flex flex-col items-center justify-center p-4 border-b border-white/10">
        {/* Removed the trigger from here */}
        <div className="flex items-center space-x-2 py-2">
          {/* Removed the Moon icon */}
          <span className="text-xl font-bold text-white">LaNeenos Daycare</span>
        </div>
        
        <div className="flex flex-col items-center mt-4 mb-2 w-full">
          <Avatar className="h-14 w-14 mb-2">
            <AvatarFallback className="bg-primary/20 text-primary">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-medium text-white truncate max-w-full">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-white/60 truncate max-w-full">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Log out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
