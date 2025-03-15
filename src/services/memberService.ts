
import api from './api';
import { Member } from '@/types';

export const memberService = {
  getAllMembers: async (): Promise<Member[]> => {
    try {
      const response = await api.get('/users/members');
      return response.data;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },
  
  getMemberById: async (id: string): Promise<Member> => {
    try {
      const response = await api.get(`/users/members/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching member ${id}:`, error);
      throw error;
    }
  },
  
  addMember: async (memberData: Partial<Member>): Promise<Member> => {
    try {
      const response = await api.post('/users/members', memberData);
      return response.data.member;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },
  
  updateMember: async (id: string, memberData: Partial<Member>): Promise<Member> => {
    try {
      const response = await api.put(`/users/members/${id}`, memberData);
      return response.data;
    } catch (error) {
      console.error(`Error updating member ${id}:`, error);
      throw error;
    }
  },
  
  addHours: async (id: string, hoursToAdd: number): Promise<Member> => {
    try {
      const response = await api.put(`/users/members/${id}/hours`, { hoursToAdd });
      return response.data;
    } catch (error) {
      console.error(`Error adding hours to member ${id}:`, error);
      throw error;
    }
  },
  
  updateProfile: async (profileData: any): Promise<any> => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};
