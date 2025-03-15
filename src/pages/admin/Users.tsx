
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCog, Plus, Edit, Trash, AlertTriangle } from "lucide-react";

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const mockMembers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      rfidNumber: "RF001122",
      membershipHours: 50,
      totalHoursUsed: 15,
      isActive: true
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      rfidNumber: "RF002233",
      membershipHours: 30,
      totalHoursUsed: 25,
      isActive: true
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      rfidNumber: "RF003344",
      membershipHours: 20,
      totalHoursUsed: 20,
      isActive: false
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient">Member Management</h1>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Add New Member
        </Button>
      </div>

      <GlassMorphismCard className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <UserCog className="mr-2 h-5 w-5 text-primary" />
            Members List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">RFID</TableHead>
                  <TableHead className="text-white/70">Hours</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMembers.map((member) => (
                  <TableRow key={member.id} className="border-white/10">
                    <TableCell className="font-medium text-white">
                      <div>
                        {member.name}
                        <div className="text-sm text-white/60">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-white/80">{member.rfidNumber}</TableCell>
                    <TableCell>
                      <div className="text-white/80">
                        {member.totalHoursUsed} / {member.membershipHours}
                        <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              member.totalHoursUsed / member.membershipHours > 0.8 
                                ? 'bg-red-500' 
                                : 'bg-primary'
                            }`} 
                            style={{ width: `${(member.totalHoursUsed / member.membershipHours) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-blue-500">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </GlassMorphismCard>
    </div>
  );
};

export default AdminUsers;
