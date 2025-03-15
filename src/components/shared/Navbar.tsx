
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  User,
  LogOut,
  CreditCard,
  Home,
  Clock,
  Calendar,
  Badge,
  UserCog,
  Users,
  ShieldCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = user?.role === "admin"
    ? [
        { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={18} /> },
        { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
        { name: "Payments", path: "/admin/payments", icon: <CreditCard size={18} /> },
        { name: "Attendance", path: "/admin/attendance", icon: <Clock size={18} /> },
      ]
    : [
        { name: "Dashboard", path: "/user/dashboard", icon: <Home size={18} /> },
        { name: "Profile", path: "/user/profile", icon: <User size={18} /> },
        { name: "Payments", path: "/user/payments", icon: <CreditCard size={18} /> },
        { name: "Membership Plans", path: "/membership-plans", icon: <Badge size={18} /> },
      ];

  return (
    <nav className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-display font-bold text-primary">
                RFID
              </span>
              <span className="text-2xl font-display font-semibold ml-1">
                Daycare
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 transition-colors"
                  >
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </Link>
                ))}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative rounded-full h-8 w-8 ml-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs font-medium mt-1 uppercase bg-muted inline-block px-2 py-0.5 rounded">
                        {user?.role}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    {user?.role === "admin" ? (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/profile" className="cursor-pointer flex items-center">
                          <UserCog size={16} className="mr-2" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link to="/user/profile" className="cursor-pointer flex items-center">
                          <User size={16} className="mr-2" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link to="/membership-plans">
                  <Button variant="outline" size="sm">
                    Membership Plans
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="sm">Login</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-primary/10 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-background/90 backdrop-blur-md z-40 transform transition-transform duration-200 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="pt-20 pb-6 px-4 space-y-1">
          {isAuthenticated && (
            <>
              <div className="flex flex-col items-center mb-8">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-base font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <span className="text-xs font-medium mt-1 uppercase bg-muted inline-block px-2 py-0.5 rounded">
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMenu}
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-primary/10 transition-colors"
                  >
                    {link.icon}
                    <span className="ml-3">{link.name}</span>
                  </Link>
                ))}

                <div className="pt-4 mt-4 border-t">
                  <Button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <LogOut size={18} className="mr-2" />
                    <span>Log out</span>
                  </Button>
                </div>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/membership-plans" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">
                  Membership Plans
                </Button>
              </Link>
              <Link to="/login" onClick={toggleMenu}>
                <Button className="w-full">Login</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Close button at the top of mobile menu */}
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 p-2 rounded-md text-primary hover:bg-primary/10 focus:outline-none transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
