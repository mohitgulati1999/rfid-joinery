
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { CreditCard, Clock, CheckCircle, UserCheck, ClipboardCheck, XCircle, LogOut } from "lucide-react";
import { Attendance, Member } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";
import { memberService } from "@/services/memberService";
import { toast } from "sonner";

const AdminAttendance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rfidInput, setRfidInput] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const { data: attendanceRecords, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceService.getAllAttendance,
  });

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getAllMembers,
  });

  const checkInMutation = useMutation({
    mutationFn: (memberId: string) => 
      attendanceService.checkInMember(memberId, user.id),
    onSuccess: () => {
      toast.success("Member checked in successfully");
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setRfidInput("");
      setShowMemberDialog(false);
    },
    onError: () => {
      toast.error("Failed to check in member");
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: (attendanceId: string) => 
      attendanceService.checkOutMember(attendanceId, user.id),
    onSuccess: () => {
      toast.success("Member checked out successfully");
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: () => {
      toast.error("Failed to check out member");
    }
  });

  const handleRfidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfidInput.trim()) return;

    const member = members?.find(m => m.rfidNumber === rfidInput.trim());
    
    if (member) {
      // Check if member is already checked in
      const activeAttendance = attendanceRecords?.find(
        record => record.memberId === member.id && record.isActive
      );

      if (activeAttendance) {
        // Member is already checked in, perform check out
        checkOutMutation.mutate(activeAttendance.id);
      } else {
        // Show confirmation dialog
        setSelectedMember(member);
        setShowMemberDialog(true);
      }
    } else {
      toast.error("No member found with this RFID");
    }
  };

  const confirmCheckIn = () => {
    if (selectedMember) {
      checkInMutation.mutate(selectedMember.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateHours = (checkInTime: string, checkOutTime: string | null) => {
    if (!checkOutTime) return "In progress";
    
    const checkIn = new Date(checkInTime).getTime();
    const checkOut = new Date(checkOutTime).getTime();
    const diffHours = (checkOut - checkIn) / (1000 * 60 * 60);
    
    return diffHours.toFixed(1) + " hrs";
  };

  // Active attendance records
  const activeRecords = attendanceRecords?.filter(record => record.isActive) || [];
  
  // Recent attendance records (not active, limit to 10)
  const recentRecords = attendanceRecords
    ?.filter(record => !record.isActive)
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
    .slice(0, 10) || [];

  return (
    <div className="container mx-auto py-6 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Attendance Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Members Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeRecords.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Currently in the daycare
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {attendanceRecords?.filter(record => {
                const today = new Date().toDateString();
                const recordDate = new Date(record.checkInTime).toDateString();
                return today === recordDate;
              }).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total visits today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Check-In/Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRfidSubmit} className="flex space-x-2">
              <Input 
                placeholder="Scan RFID or enter code" 
                value={rfidInput}
                onChange={(e) => setRfidInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Scan</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Currently Present */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Currently Present</h2>
          {activeRecords.length === 0 ? (
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">No members currently checked in</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>RFID</TableHead>
                    <TableHead>Check-In Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.memberName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-primary" />
                          {record.rfidNumber}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(record.checkInTime)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-yellow-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {calculateHours(record.checkInTime, record.checkOutTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => checkOutMutation.mutate(record.id)}
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Check Out
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Recent Check-Ins */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
          {recentRecords.length === 0 ? (
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">No recent attendance records</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>RFID</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Check-Out</TableHead>
                    <TableHead>Hours Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.memberName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-primary" />
                          {record.rfidNumber}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(record.checkInTime)}</TableCell>
                      <TableCell>
                        {record.checkOutTime ? formatDate(record.checkOutTime) : "-"}
                      </TableCell>
                      <TableCell>
                        {record.hoursSpent !== null ? (
                          <span className="flex items-center text-green-500">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {record.hoursSpent.toFixed(1)} hrs
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-500">
                            <Clock className="h-4 w-4 mr-1" />
                            In progress
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-In Member</DialogTitle>
            <DialogDescription>
              Confirm you want to check in this member
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">RFID Number:</span>
                  <span className="font-medium">{selectedMember.rfidNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours Available:</span>
                  <span className="font-medium">
                    {selectedMember.remainingHours} hrs
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmCheckIn}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Check In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAttendance;
