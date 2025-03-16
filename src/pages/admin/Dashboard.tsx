import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserManagement from "@/components/admin/UserManagement";
import RFIDManagement from "@/components/admin/RFIDManagement";
import PaymentApprovals from "@/components/admin/PaymentApprovals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Users, NfcIcon, CreditCard, Clock } from "lucide-react";
import { mockMembers } from "@/mock/data";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage members, payments, and attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{mockMembers.length}</div>
              <Users className="h-8 w-8 text-blue-500 opacity-75" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mockMembers.filter(m => m.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hours Consumed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">24</div>
              <Clock className="h-8 w-8 text-green-500 opacity-75" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              3 members currently present
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">2</div>
              <CreditCard className="h-8 w-8 text-purple-500 opacity-75" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              $120 total pending
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger value="rfid" className="flex items-center gap-2">
            <NfcIcon size={16} />
            <span className="hidden sm:inline">RFID Cards</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Clock size={16} />
            <span className="hidden sm:inline">Attendance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <UserManagement members={mockMembers} />
        </TabsContent>
        
        <TabsContent value="rfid" className="mt-6">
          <RFIDManagement members={mockMembers} />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <PaymentApprovals />
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-6">
          <div className="p-4 text-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Please implement the attendance section</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
