
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";

const AdminProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GlassMorphismCard className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">Full Name</Label>
                  <div className="relative">
                    <Input 
                      id="name" 
                      defaultValue={user.name} 
                      className="pl-10 bg-black/20 border-white/10 text-white"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">Email Address</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      defaultValue={user.email} 
                      className="pl-10 bg-black/20 border-white/10 text-white"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/80">Phone Number</Label>
                  <div className="relative">
                    <Input 
                      id="phone" 
                      defaultValue="(555) 123-4567" 
                      className="pl-10 bg-black/20 border-white/10 text-white"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white/80">Address</Label>
                  <div className="relative">
                    <Input 
                      id="address" 
                      defaultValue="123 Main St, Anytown" 
                      className="pl-10 bg-black/20 border-white/10 text-white"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </GlassMorphismCard>
        </div>
        
        <div>
          <GlassMorphismCard className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-white/80 text-sm">Role</p>
                <p className="text-white font-medium">Administrator</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-white/80">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white/80">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </CardContent>
          </GlassMorphismCard>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
