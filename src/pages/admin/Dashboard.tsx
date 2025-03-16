
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Admin, Member, PaymentRequest } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";
import { paymentService } from "@/services/paymentService";
import { attendanceService } from "@/services/attendanceService";
import { Calendar, DollarSign, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import UserManagement from "@/components/admin/UserManagement";
import PaymentApprovals from "@/components/admin/PaymentApprovals";
import RFIDManagement from "@/components/admin/RFIDManagement";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getAllMembers,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentService.getAllPayments,
  });

  const { data: attendanceRecords, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceService.getAllAttendance,
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  // Calculate statistics
  const totalMembers = members?.length || 0;
  const activeMembers = members?.filter(member => member.isActive).length || 0;
  const pendingPayments = payments?.filter(payment => payment.status === "pending").length || 0;
  const todayAttendance = attendanceRecords?.filter(record => {
    const today = new Date();
    const recordDate = new Date(record.checkInTime);
    return recordDate.getDate() === today.getDate() &&
           recordDate.getMonth() === today.getMonth() &&
           recordDate.getFullYear() === today.getFullYear();
  }).length || 0;

  const renderComponents = () => {
    if (membersLoading) return <div>Loading...</div>;
    if (!members) return <div>No member data available</div>;

    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "payments":
        return <PaymentApprovals />;
      case "rfid":
        return <RFIDManagement members={members} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>Newest registered members</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {members.slice(0, 5).map((member) => (
                    <li key={member.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.isActive ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/users')}>
                  View All Members
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Activity</CardTitle>
                <CardDescription>Members currently checked in</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {attendanceRecords && attendanceRecords
                    .filter(record => !record.checkOutTime)
                    .slice(0, 5)
                    .map((record) => {
                      const member = members.find(m => m.id === record.memberId);
                      return (
                        <li key={record.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{member?.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">
                              Check-in: {new Date(record.checkInTime).toLocaleTimeString()}
                            </p>
                          </div>
                          <div>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/attendance')}>
                  View Attendance Records
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Users className="h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold">{totalMembers}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Users className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold">{activeMembers}</p>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <DollarSign className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-2xl font-bold">{pendingPayments}</p>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Clock className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{todayAttendance}</p>
              <p className="text-sm text-muted-foreground">Today's Attendance</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="payments">Payment Approvals</TabsTrigger>
          <TabsTrigger value="rfid">RFID Management</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {renderComponents()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
