
import api from './api';
import { Attendance } from '@/types';

export const attendanceService = {
  // Get all attendance records (admin)
  getAllAttendance: async (): Promise<Attendance[]> => {
    try {
      const response = await api.get('/attendance');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },
  
  // Get attendance for a specific member
  getMemberAttendance: async (memberId: string): Promise<Attendance[]> => {
    try {
      const response = await api.get(`/attendance/member/${memberId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance for member ${memberId}:`, error);
      throw error;
    }
  },
  
  // Check in a member by RFID
  checkInMember: async (rfidNumber: string): Promise<Attendance> => {
    try {
      const response = await api.post('/attendance/checkin', { rfidNumber });
      return response.data;
    } catch (error) {
      console.error('Error checking in member:', error);
      throw error;
    }
  },
  
  // Check out a member by RFID
  checkOutMember: async (rfidNumber: string): Promise<any> => {
    try {
      const response = await api.put('/attendance/checkout', { rfidNumber });
      return response.data;
    } catch (error) {
      console.error('Error checking out member:', error);
      throw error;
    }
  }
};
