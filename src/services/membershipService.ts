
import api from './api';
import { MembershipPlan } from '@/types';

export const membershipService = {
  // Get all membership plans
  getAllPlans: async (): Promise<MembershipPlan[]> => {
    try {
      const response = await api.get('/memberships');
      return response.data;
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      throw error;
    }
  },
  
  // Get a specific membership plan
  getPlanById: async (planId: string): Promise<MembershipPlan> => {
    try {
      const response = await api.get(`/memberships/${planId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching membership plan ${planId}:`, error);
      throw error;
    }
  },
  
  // Create a new membership plan (admin)
  createPlan: async (planData: Partial<MembershipPlan>): Promise<MembershipPlan> => {
    try {
      const response = await api.post('/memberships', planData);
      return response.data;
    } catch (error) {
      console.error('Error creating membership plan:', error);
      throw error;
    }
  },
  
  // Update a membership plan (admin)
  updatePlan: async (planId: string, planData: Partial<MembershipPlan>): Promise<MembershipPlan> => {
    try {
      const response = await api.put(`/memberships/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error(`Error updating membership plan ${planId}:`, error);
      throw error;
    }
  },
  
  // Delete a membership plan (admin)
  deletePlan: async (planId: string): Promise<void> => {
    try {
      await api.delete(`/memberships/${planId}`);
    } catch (error) {
      console.error(`Error deleting membership plan ${planId}:`, error);
      throw error;
    }
  }
};
