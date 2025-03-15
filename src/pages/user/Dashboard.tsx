
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, CreditCard, Check, AlertCircle } from "lucide-react";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Member } from "@/types";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "member") {
    navigate("/login");
    return null;
  }

  const member = user as Member;
  const remainingHours = member.membershipHours - member.totalHoursUsed;
  const percentUsed = (member.totalHoursUsed / member.membershipHours) * 100;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassMorphismCard 
            className="p-6 hover:shadow-lg" 
            hoverEffect={true}
            glowEffect={true}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Membership Status</h2>
                <p className="text-muted-foreground">RFID Card: <span className="font-mono font-medium">{member.rfidNumber}</span></p>
              </div>
              <div className="flex gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {member.isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate('/user/payments')}>
                  Add Hours
                </Button>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hours Used: {member.totalHoursUsed} hrs</span>
                <span>Total: {member.membershipHours} hrs</span>
              </div>
              <Progress value={percentUsed} className="h-2" />
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-xl font-bold">{remainingHours} hours remaining</div>
                {remainingHours < 10 && (
                  <div className="flex items-center text-amber-600 text-sm">
                    <AlertCircle size={16} className="mr-1" />
                    Low balance
                  </div>
                )}
              </div>
            </div>
          </GlassMorphismCard>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your recent visits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{formatDate(new Date(Date.now() - i * 86400000))}</p>
                      <p className="text-sm text-muted-foreground">2 hours spent</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      1:00 PM - 3:00 PM
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard size={18} className="mr-2" />
                  Payment History
                </CardTitle>
                <CardDescription>Your recent payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{formatDate(new Date(Date.now() - i * 86400000 * 5))}</p>
                      <p className="text-sm text-muted-foreground">Added 10 hours</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-medium">$50.00</span>
                      <Check size={14} className="text-green-600" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar size={18} className="mr-2" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Events at the daycare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted">
                  <p className="font-medium">{formatDate(new Date(Date.now() + i * 86400000 * 3))}</p>
                  <p className="text-sm">Special Activity Day</p>
                  <p className="text-xs text-muted-foreground mt-1">10:00 AM - 2:00 PM</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <GlassMorphismCard className="p-6" variant="dark">
            <h3 className="text-lg font-semibold mb-4">Need More Hours?</h3>
            <p className="text-sm mb-4">
              Running low on hours? Request additional hours for your membership.
            </p>
            <Button className="w-full" onClick={() => navigate('/user/payments')}>
              Request Hours
            </Button>
          </GlassMorphismCard>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
