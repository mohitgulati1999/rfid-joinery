
import { Attendance } from '@/types';
import { toast } from 'sonner';

// In-memory mock attendance records
let mockAttendanceRecords: Attendance[] = [
  {
    id: "1",
    memberId: "m1",
    memberName: "John Doe",
    rfidNumber: "RF123456",
    checkInTime: new Date().toISOString(),
    checkOutTime: null,
    hoursSpent: null,
    isActive: true
  },
  {
    id: "2",
    memberId: "m2",
    memberName: "Jane Smith",
    rfidNumber: "RF789012",
    checkInTime: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    checkOutTime: new Date().toISOString(),
    hoursSpent: 2,
    isActive: false
  },
  {
    id: "3",
    memberId: "m3",
    memberName: "Robert Brown",
    rfidNumber: "RF345678",
    checkInTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    checkOutTime: new Date(Date.now() - 86400000 + 3600000 * 4).toISOString(), // 4 hours after check-in
    hoursSpent: 4,
    isActive: false
  }
];

export const attendanceService = {
  // Get all attendance records (admin)
  getAllAttendance: async (): Promise<Attendance[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockAttendanceRecords];
  },
  
  // Get active attendance records (admin)
  getActiveAttendance: async (): Promise<Attendance[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAttendanceRecords.filter(record => !record.checkOutTime);
  },
  
  // Get attendance history for a specific member
  getMemberAttendance: async (memberId: string): Promise<Attendance[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAttendanceRecords.filter(record => record.memberId === memberId);
  },
  
  // Check in a member using RFID
  checkInMember: async (rfidNumber: string, adminId?: string): Promise<Attendance | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find member by RFID (in a real app, this would be a server call)
    // For testing, we'll just create a mock entry
    
    // Check if member is already checked in
    const existingActiveRecord = mockAttendanceRecords.find(
      record => record.rfidNumber === rfidNumber && !record.checkOutTime
    );
    
    if (existingActiveRecord) {
      toast.error("Member is already checked in");
      return null;
    }
    
    // Create new check-in record
    const newRecord: Attendance = {
      id: Date.now().toString(),
      memberId: "m" + Math.floor(Math.random() * 1000),
      memberName: "Member " + rfidNumber.substring(2),
      rfidNumber,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      hoursSpent: null,
      isActive: true
    };
    
    mockAttendanceRecords.unshift(newRecord);
    toast.success(`${newRecord.memberName} checked in successfully`);
    
    return newRecord;
  },
  
  // Check out a member
  checkOutMember: async (attendanceId: string, adminId?: string): Promise<Attendance | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the attendance record
    const recordIndex = mockAttendanceRecords.findIndex(record => record.id === attendanceId);
    
    if (recordIndex === -1) {
      toast.error("Attendance record not found");
      return null;
    }
    
    const record = mockAttendanceRecords[recordIndex];
    
    if (record.checkOutTime) {
      toast.error("Member is already checked out");
      return null;
    }
    
    // Calculate hours spent
    const checkInTime = new Date(record.checkInTime);
    const checkOutTime = new Date();
    const hoursSpent = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / 3600000 * 10) / 10;
    
    // Update the record
    const updatedRecord: Attendance = {
      ...record,
      checkOutTime: checkOutTime.toISOString(),
      hoursSpent,
      isActive: false
    };
    
    mockAttendanceRecords[recordIndex] = updatedRecord;
    toast.success(`${record.memberName} checked out successfully`);
    
    return updatedRecord;
  },
  
  // Manual attendance record
  addManualAttendance: async (attendanceData: {
    memberId: string;
    memberName: string;
    rfidNumber: string;
    checkInTime: string;
    checkOutTime?: string;
  }): Promise<Attendance | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Calculate hours if both check-in and check-out are provided
    let hoursSpent = null;
    if (attendanceData.checkOutTime) {
      const checkInTime = new Date(attendanceData.checkInTime);
      const checkOutTime = new Date(attendanceData.checkOutTime);
      hoursSpent = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / 3600000 * 10) / 10;
    }
    
    // Create new record
    const newRecord: Attendance = {
      id: Date.now().toString(),
      memberId: attendanceData.memberId,
      memberName: attendanceData.memberName,
      rfidNumber: attendanceData.rfidNumber,
      checkInTime: attendanceData.checkInTime,
      checkOutTime: attendanceData.checkOutTime || null,
      hoursSpent,
      isActive: !attendanceData.checkOutTime
    };
    
    mockAttendanceRecords.unshift(newRecord);
    toast.success("Manual attendance record added");
    
    return newRecord;
  }
};

export default attendanceService;
