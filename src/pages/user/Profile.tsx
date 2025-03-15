
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Save, Upload } from "lucide-react";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "member") {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6 text-gradient">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GlassMorphismCard className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
                <Avatar className="w-24 h-24 border-2 border-primary/20">
                  <AvatarFallback className="text-3xl bg-primary/20 text-primary">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="text-xl font-medium text-white">{user.name}</h3>
                  <p className="text-white/60">{user.email}</p>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload className="mr-2 h-3 w-3" /> Change Photo
                  </Button>
                </div>
              </div>

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
        
        <div className="space-y-6">
          <GlassMorphismCard className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-white/80 text-sm">RFID Number</p>
                <p className="text-white font-mono font-medium">{(user as any).rfidNumber}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-white/80 text-sm">Membership Status</p>
                <p className="text-white font-medium flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${(user as any).isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {(user as any).isActive ? 'Active' : 'Inactive'}
                </p>
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

export default UserProfile;
