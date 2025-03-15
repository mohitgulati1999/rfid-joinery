
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, UserCheck, UserX, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AdminAttendance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const mockAttendance = [
    {
      id: "1",
      memberName: "John Doe",
      rfidNumber: "RF001122",
      checkInTime: new Date("2023-05-10T09:00:00"),
      checkOutTime: new Date("2023-05-10T12:00:00"),
      hoursSpent: 3
    },
    {
      id: "2",
      memberName: "Jane Smith",
      rfidNumber: "RF002233",
      checkInTime: new Date("2023-05-10T10:00:00"),
      checkOutTime: null,
      hoursSpent: null
    },
    {
      id: "3",
      memberName: "Bob Johnson",
      rfidNumber: "RF003344",
      checkInTime: new Date("2023-05-09T14:00:00"),
      checkOutTime: new Date("2023-05-09T16:30:00"),
      hoursSpent: 2.5
    }
  ];

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Attendance Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <GlassMorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">RFID Check-In/Out</h2>
          <div className="space-y-4">
            <div className="relative">
              <Input 
                placeholder="Scan RFID Card..." 
                className="bg-black/20 border-white/10 text-white placeholder:text-white/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-white/50" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1">
                <UserCheck className="mr-2 h-4 w-4" /> Check In
              </Button>
              <Button variant="outline" className="flex-1">
                <UserX className="mr-2 h-4 w-4" /> Check Out
              </Button>
            </div>
          </div>
        </GlassMorphismCard>

        <GlassMorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Current Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-white/60">Members Present</p>
                <p className="text-3xl font-bold text-white">3</p>
              </div>
              <div>
                <p className="text-white/60">Total Hours Today</p>
                <p className="text-3xl font-bold text-white">12.5</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/80 text-center">Last Check-in: <span className="font-semibold text-white">Jane Smith</span> at 10:00 AM</p>
            </div>
          </div>
        </GlassMorphismCard>
      </div>

      <GlassMorphismCard className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Member</TableHead>
                  <TableHead className="text-white/70">RFID</TableHead>
                  <TableHead className="text-white/70">Check In</TableHead>
                  <TableHead className="text-white/70">Check Out</TableHead>
                  <TableHead className="text-white/70">Hours</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAttendance.map((record) => (
                  <TableRow key={record.id} className="border-white/10">
                    <TableCell className="font-medium text-white">
                      {record.memberName}
                    </TableCell>
                    <TableCell className="font-mono text-white/80">{record.rfidNumber}</TableCell>
                    <TableCell className="text-white/80">
                      <div>
                        {formatTime(record.checkInTime)}
                        <div className="text-xs text-white/60">{formatDate(record.checkInTime)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80">
                      {record.checkOutTime ? (
                        <div>
                          {formatTime(record.checkOutTime)}
                          <div className="text-xs text-white/60">{formatDate(record.checkOutTime)}</div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {record.hoursSpent ? `${record.hoursSpent} hrs` : "—"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.checkOutTime 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {record.checkOutTime ? 'Completed' : 'Active'}
                      </span>
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

export default AdminAttendance;
