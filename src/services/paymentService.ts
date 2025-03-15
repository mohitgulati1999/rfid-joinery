
import api from './api';
import { PaymentRequest } from '@/types';

export const paymentService = {
  // Get all payment requests (admin)
  getAllPayments: async (): Promise<PaymentRequest[]> => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },
  
  // Get payment requests for a specific member
  getMemberPayments: async (memberId: string): Promise<PaymentRequest[]> => {
    try {
      const response = await api.get(`/payments/member/${memberId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for member ${memberId}:`, error);
      throw error;
    }
  },
  
  // Create a new payment request with proof image
  createPaymentRequest: async (
    amount: number, 
    hoursRequested: number, 
    paymentProofImage: File
  ): Promise<PaymentRequest> => {
    try {
      const formData = new FormData();
      formData.append('amount', amount.toString());
      formData.append('hoursRequested', hoursRequested.toString());
      formData.append('paymentProof', paymentProofImage);
      
      const response = await api.post('/payments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating payment request:', error);
      throw error;
    }
  },
  
  // Approve a payment request (admin)
  approvePayment: async (paymentId: string): Promise<any> => {
    try {
      const response = await api.put(`/payments/${paymentId}/approve`);
      return response.data;
    } catch (error) {
      console.error(`Error approving payment ${paymentId}:`, error);
      throw error;
    }
  },
  
  // Reject a payment request (admin)
  rejectPayment: async (paymentId: string): Promise<PaymentRequest> => {
    try {
      const response = await api.put(`/payments/${paymentId}/reject`);
      return response.data;
    } catch (error) {
      console.error(`Error rejecting payment ${paymentId}:`, error);
      throw error;
    }
  }
};
