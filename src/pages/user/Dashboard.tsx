
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Member, Attendance, MembershipPlan } from "@/types";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import CreditCard from "@/components/user/CreditCard";
import { 
  Clock, 
  CreditCard as CreditCardIcon, 
  BarChart3, 
  UserCircle,
  Hourglass,
  Calendar,
  ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";
import { membershipService } from "@/services/membershipService";
import { memberService } from "@/services/memberService";

// Latest attendance graph component
const AttendanceGraph: React.FC<{ attendance: Attendance[] }> = ({ attendance }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Mock data for attendance hours by day
  const dailyHours = days.map((day, index) => {
    const randomHours = Math.floor(Math.random() * 6);
    return randomHours;
  });
  
  const maxHours = Math.max(...dailyHours);
  
  return (
    <div className="grid grid-cols-7 gap-1 h-24">
      {days.map((day, index) => (
        <div key={day} className="flex flex-col items-center">
          <div className="flex-1 w-full flex items-end">
            <div 
              className="w-full bg-primary opacity-70 rounded-sm"
              style={{ 
                height: `${dailyHours[index] ? (dailyHours[index] / maxHours) * 100 : 0}%`
              }}
            ></div>
          </div>
          <div className="text-xs mt-2 text-white/70">{day}</div>
          <div className="text-xs font-medium text-white">{dailyHours[index]}</div>
        </div>
      ))}
    </div>
  );
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const member = user as Member;

  const { data: attendanceRecords } = useQuery({
    queryKey: ['memberAttendance', member.id],
    queryFn: () => attendanceService.getMemberAttendance(member.id),
  });

  const { data: membershipPlan } = useQuery({
    queryKey: ['membershipPlan', member.membershipPlanId],
    queryFn: () => member.membershipPlanId 
      ? membershipService.getPlanById(member.membershipPlanId)
      : null,
    enabled: !!member.membershipPlanId
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate usage statistics
  const totalHours = member.membershipHours;
  const usedHours = member.totalHoursUsed;
  const remainingHours = member.remainingHours || 0;
  const usagePercentage = (usedHours / totalHours) * 100;

  // Get active session if any
  const activeSession = attendanceRecords?.find(record => !record.checkOutTime);
  
  // Calculate current session duration if there is an active session
  let currentSessionDuration = 0;
  if (activeSession) {
    const checkInTime = new Date(activeSession.checkInTime);
    const now = new Date();
    currentSessionDuration = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-1">Hello, {member.name}</h1>
          <p className="text-muted-foreground">Welcome to your daycare dashboard</p>
        </div>
        
        {activeSession && (
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center bg-white/10 rounded-lg px-4 py-2 border border-white/20">
              <div className="flex items-center mr-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <span className="text-sm text-white font-medium">Currently Checked In</span>
              </div>
              <span className="text-sm font-mono text-white/70">
                {currentSessionDuration.toFixed(1)} hrs
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Premium Credit Card Display */}
      <div className="mb-8">
        <CreditCard member={member} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassMorphismCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Hours Usage</h3>
              <p className="text-sm text-white/60">Your current membership</p>
            </div>
            <div className="p-2 rounded-full bg-white/5">
              <Hourglass className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm text-white/70">Remaining</span>
                <span className="text-sm font-medium text-white">{remainingHours} of {totalHours} hrs</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${usagePercentage > 80 ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${100 - usagePercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/70">Used</div>
                <div className="text-xl font-semibold text-white mt-1">{usedHours} hrs</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/70">Remaining</div>
                <div className="text-xl font-semibold text-white mt-1">{remainingHours} hrs</div>
              </div>
            </div>
            
            {usagePercentage > 80 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">
                  Your hours are running low. Consider purchasing more hours.
                </p>
              </div>
            )}
            
            <Button 
              className="w-full"
              onClick={() => navigate('/user/payments')}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Buy More Hours
            </Button>
          </div>
        </GlassMorphismCard>
        
        <GlassMorphismCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <p className="text-sm text-white/60">Your latest check-ins</p>
            </div>
            <div className="p-2 rounded-full bg-white/5">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="space-y-3">
            {attendanceRecords && attendanceRecords.length > 0 ? (
              attendanceRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${record.checkOutTime ? 'bg-green-500' : 'bg-blue-500'} mr-3`}></div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {formatDate(record.checkInTime)}
                      </div>
                      <div className="text-xs text-white/60">
                        {record.checkOutTime 
                          ? `${record.hoursSpent} hours` 
                          : 'Currently active'}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {record.checkOutTime && formatDate(record.checkOutTime)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-white/60">
                No recent activity
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full mt-2 border-white/10"
              onClick={() => {}}
            >
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </GlassMorphismCard>
        
        <GlassMorphismCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Weekly Summary</h3>
              <p className="text-sm text-white/60">Hours by day of week</p>
            </div>
            <div className="p-2 rounded-full bg-white/5">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          {attendanceRecords ? (
            <AttendanceGraph attendance={attendanceRecords} />
          ) : (
            <div className="text-center py-10 text-white/60">
              Loading attendance data...
            </div>
          )}
        </GlassMorphismCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassMorphismCard className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UserCircle className="mr-2 h-5 w-5 text-primary" />
              Membership Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-md font-medium text-white mb-3">Member Details</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="text-sm text-white/70">RFID Number</div>
                  <div className="text-sm text-white font-mono">{member.rfidNumber}</div>
                  
                  <div className="text-sm text-white/70">Status</div>
                  <div className="text-sm text-white">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      member.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-white/70">Email</div>
                  <div className="text-sm text-white">{member.email}</div>
                  
                  {member.phone && (
                    <>
                      <div className="text-sm text-white/70">Phone</div>
                      <div className="text-sm text-white">{member.phone}</div>
                    </>
                  )}
                </div>
              </div>
              
              {membershipPlan ? (
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-md font-medium text-white mb-3">Current Plan: {membershipPlan.name}</h4>
                  <p className="text-sm text-white/70 mb-3">{membershipPlan.description}</p>
                  
                  <div className="space-y-2">
                    {membershipPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2 mt-0.5">
                          <span className="text-xs text-primary">✓</span>
                        </div>
                        <span className="text-sm text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-md font-medium text-white mb-2">No Plan Selected</h4>
                  <p className="text-sm text-white/70 mb-4">
                    You don't have a membership plan assigned yet.
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/membership-plans')}
                  >
                    View Available Plans
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </GlassMorphismCard>
        
        <GlassMorphismCard className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-md font-medium text-white mb-3">Need More Hours?</h4>
                <p className="text-sm text-white/70 mb-4">
                  Purchase additional hours for your membership.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/user/payments')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Request Hours
                </Button>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-md font-medium text-white mb-3">Update Your Profile</h4>
                <p className="text-sm text-white/70 mb-4">
                  Change your personal information or contact details.
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-white/10"
                  onClick={() => navigate('/user/profile')}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-md font-medium text-white mb-3">Need Help?</h4>
                <p className="text-sm text-white/70 mb-4">
                  Contact our support team for assistance with your account.
                </p>
                <Button variant="outline" className="w-full border-white/10">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </GlassMorphismCard>
      </div>
    </div>
  );
};

export default UserDashboard;
