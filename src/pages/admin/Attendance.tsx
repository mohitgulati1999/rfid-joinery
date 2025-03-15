import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Clock, 
  UserCheck, 
  UserX, 
  Search, 
  RefreshCw,
  Users 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";
import { memberService } from "@/services/memberService";
import { toast } from "sonner";
import { Attendance, Member } from "@/types";

const RFIDInput = ({ onSubmit }: { onSubmit: (rfidNumber: string) => void }) => {
  const [rfidNumber, setRfidNumber] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rfidNumber.trim()) {
      onSubmit(rfidNumber);
      setRfidNumber("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        ref={inputRef}
        value={rfidNumber}
        onChange={(e) => setRfidNumber(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scan RFID Card or Enter Manually..."
        className="bg-black/20 border-white/10 text-white placeholder:text-white/50"
        autoComplete="off"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <Search className="h-5 w-5 text-white/50" />
      </div>
    </form>
  );
};

const AdminAttendance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<string>("");

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getAllMembers,
  });

  const { data: attendanceRecords, isLoading: isLoadingAttendance, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceService.getAllAttendance,
  });

  const checkInMutation = useMutation({
    mutationFn: attendanceService.checkInMember,
    onSuccess: () => {
      toast.success("Member checked in successfully");
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Error checking in member");
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: attendanceService.checkOutMember,
    onSuccess: (data) => {
      toast.success(`Member checked out. ${data.member.remainingHours} hours remaining.`);
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Error checking out member");
    }
  });

  const handleRFIDSubmit = (rfidNumber: string) => {
    const activeSession = attendanceRecords?.find(
      record => record.rfidNumber === rfidNumber && !record.checkOutTime
    );

    if (activeSession) {
      checkOutMutation.mutate(rfidNumber);
    } else {
      checkInMutation.mutate(rfidNumber);
    }
  };

  const handleManualCheckIn = () => {
    if (!selectedMember) {
      toast.error("Please select a member first");
      return;
    }

    const member = members?.find(m => m.id === selectedMember);
    if (member) {
      checkInMutation.mutate(member.rfidNumber);
    }
  };

  const handleManualCheckOut = () => {
    if (!selectedMember) {
      toast.error("Please select a member first");
      return;
    }

    const member = members?.find(m => m.id === selectedMember);
    if (member) {
      checkOutMutation.mutate(member.rfidNumber);
    }
  };

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const presentCount = attendanceRecords?.filter(record => !record.checkOutTime).length || 0;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const totalHoursToday = attendanceRecords
    ?.filter(record => {
      const checkInDate = new Date(record.checkInTime);
      return checkInDate >= startOfDay || !record.checkOutTime;
    })
    .reduce((total, record) => {
      if (record.hoursSpent) {
        return total + record.hoursSpent;
      } else if (!record.checkOutTime) {
        const now = new Date();
        const checkIn = new Date(record.checkInTime);
        const hoursSpentSoFar = parseFloat(((now.getTime() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(2));
        return total + hoursSpentSoFar;
      }
      return total;
    }, 0) || 0;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const lastCheckIn = attendanceRecords?.sort((a, b) => 
    new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
  )[0];

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Attendance Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <GlassMorphismCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">RFID Check-In/Out</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-white/70 border-white/10"
              onClick={() => refetchAttendance()}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
          
          <div className="space-y-4">
            <RFIDInput onSubmit={handleRFIDSubmit} />
            
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-sm font-medium text-white/80 mb-2">Manual Check-In/Out</h3>
              <div className="flex flex-col gap-3">
                <Select onValueChange={setSelectedMember} value={selectedMember}>
                  <SelectTrigger className="bg-black/20 border-white/10 text-white">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members?.map((member: Member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.rfidNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1" 
                    onClick={handleManualCheckIn}
                    disabled={!selectedMember}
                  >
                    <UserCheck className="mr-2 h-4 w-4" /> Check In
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/10"
                    onClick={handleManualCheckOut}
                    disabled={!selectedMember}
                  >
                    <UserX className="mr-2 h-4 w-4" /> Check Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </GlassMorphismCard>

        <GlassMorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Current Status</h2>
          <div className="space-y-4">
            <div className="px-3 py-2 bg-white/5 rounded-lg mb-4">
              <p className="text-white/70 text-sm">{today}</p>
            </div>
            
            <div className="flex justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Members Present</p>
                  <p className="text-3xl font-bold text-white">{presentCount}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Hours Today</p>
                  <p className="text-3xl font-bold text-white">{totalHoursToday.toFixed(1)}</p>
                </div>
              </div>
            </div>
            
            {lastCheckIn && (
              <div className="bg-white/5 rounded-lg p-3 mt-4">
                <p className="text-white/80 text-center">
                  Last Check-in: <span className="font-semibold text-white">{lastCheckIn.memberName}</span> at {formatTime(lastCheckIn.checkInTime)}
                </p>
              </div>
            )}
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
          {isLoadingAttendance ? (
            <div className="p-8 text-center text-white/70">Loading attendance records...</div>
          ) : (
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
                  {attendanceRecords?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-white/50">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceRecords?.map((record: Attendance) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </GlassMorphismCard>
    </div>
  );
};

export default AdminAttendance;
