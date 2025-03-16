
import { Member } from "@/types";
import api from "./api";
import { mockMembers } from "@/mock/data";

// Helper to find a member in the mock data
const findMemberById = (id: string) => {
  return mockMembers.find(member => member.id === id);
};

export const memberService = {
  // Get all members
  getAllMembers: async (): Promise<Member[]> => {
    try {
      // For mock mode, return mock data
      if (process.env.NODE_ENV === 'development') {
        return mockMembers;
      }
      
      const response = await api.get('/users/members');
      return response.data;
    } catch (error) {
      console.error("Error fetching members:", error);
      return mockMembers; // Fallback to mock data
    }
  },
  
  // Get a specific member by ID
  getMemberById: async (id: string): Promise<Member> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const member = findMemberById(id);
        if (!member) throw new Error('Member not found');
        return member;
      }
      
      const response = await api.get(`/users/members/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching member with ID ${id}:`, error);
      const mockMember = findMemberById(id);
      if (!mockMember) throw new Error('Member not found');
      return mockMember;
    }
  },
  
  // Add a new member
  addMember: async (memberData: Partial<Member>): Promise<Member> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Mock implementation for adding a member
        const newMember: Member = {
          id: `mem-${Date.now()}`,
          name: memberData.name || "New Member",
          email: memberData.email || "newmember@example.com",
          role: "member",
          rfidNumber: memberData.rfidNumber || `RF${Math.floor(1000000 + Math.random() * 9000000)}`,
          membershipPlanId: memberData.membershipPlanId || null,
          membershipHours: memberData.membershipHours || 0,
          totalHoursUsed: 0,
          remainingHours: memberData.membershipHours || 0,
          isActive: true,
          ...memberData
        };
        
        mockMembers.push(newMember);
        return newMember;
      }
      
      const response = await api.post('/users/members', memberData);
      return response.data;
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  },
  
  // Update an existing member
  updateMember: async (id: string, memberData: Partial<Member>): Promise<Member> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const memberIndex = mockMembers.findIndex(member => member.id === id);
        if (memberIndex === -1) throw new Error('Member not found');
        
        const updatedMember = {
          ...mockMembers[memberIndex],
          ...memberData,
          remainingHours: memberData.membershipHours 
            ? memberData.membershipHours - (mockMembers[memberIndex].totalHoursUsed || 0) 
            : mockMembers[memberIndex].remainingHours
        };
        
        mockMembers[memberIndex] = updatedMember;
        return updatedMember;
      }
      
      const response = await api.put(`/users/members/${id}`, memberData);
      return response.data;
    } catch (error) {
      console.error(`Error updating member with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Add hours to a member's account
  addHours: async (id: string, hoursToAdd: number): Promise<Member> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const memberIndex = mockMembers.findIndex(member => member.id === id);
        if (memberIndex === -1) throw new Error('Member not found');
        
        const updatedMember = {
          ...mockMembers[memberIndex],
          membershipHours: (mockMembers[memberIndex].membershipHours || 0) + hoursToAdd,
          remainingHours: (mockMembers[memberIndex].remainingHours || 0) + hoursToAdd
        };
        
        mockMembers[memberIndex] = updatedMember;
        return updatedMember;
      }
      
      const response = await api.post(`/users/members/${id}/add-hours`, { hours: hoursToAdd });
      return response.data;
    } catch (error) {
      console.error(`Error adding hours to member with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (profileData: any): Promise<Member> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // This is a simplified mock implementation for updating a profile
        const userId = profileData.id;
        const memberIndex = mockMembers.findIndex(member => member.id === userId);
        if (memberIndex === -1) throw new Error('Member not found');
        
        const updatedMember = {
          ...mockMembers[memberIndex],
          ...profileData,
        };
        
        mockMembers[memberIndex] = updatedMember;
        return updatedMember;
      }
      
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
  
  // Delete a member - Adding this function to fix the error
  deleteMember: async (id: string): Promise<boolean> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const memberIndex = mockMembers.findIndex(member => member.id === id);
        if (memberIndex === -1) throw new Error('Member not found');
        
        mockMembers.splice(memberIndex, 1);
        return true;
      }
      
      await api.delete(`/users/members/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting member with ID ${id}:`, error);
      throw error;
    }
  }
};
