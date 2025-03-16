
import { PaymentRequest, Member } from '@/types';
import { toast } from 'sonner';

// In-memory mock payment records
let mockPaymentRequests: PaymentRequest[] = [
  {
    id: "1",
    memberId: "m1",
    memberName: "John Doe",
    amount: 50,
    hoursRequested: 10,
    requestDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    paymentProofImage: "https://via.placeholder.com/300",
    status: "pending"
  },
  {
    id: "2",
    memberId: "m2",
    memberName: "Jane Smith",
    amount: 75,
    hoursRequested: 15,
    requestDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    paymentProofImage: "https://via.placeholder.com/300",
    status: "approved",
    approvedBy: "admin1",
    approvalDate: new Date(Date.now() - 86400000).toISOString() // Yesterday
  },
  {
    id: "3",
    memberId: "m3",
    memberName: "Robert Brown",
    amount: 25,
    hoursRequested: 5,
    requestDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    paymentProofImage: "https://via.placeholder.com/300",
    status: "rejected",
    approvedBy: "admin1",
    approvalDate: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  }
];

export const paymentService = {
  // Get all payment requests (admin)
  getAllPaymentRequests: async (): Promise<PaymentRequest[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockPaymentRequests];
  },
  
  // Added this method to fix the error
  getAllPayments: async (): Promise<PaymentRequest[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockPaymentRequests];
  },
  
  // Get pending payment requests (admin)
  getPendingPaymentRequests: async (): Promise<PaymentRequest[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPaymentRequests.filter(request => request.status === "pending");
  },
  
  // Get payment history for a specific member
  getMemberPaymentHistory: async (memberId: string): Promise<PaymentRequest[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPaymentRequests.filter(request => request.memberId === memberId);
  },
  
  // Submit a new payment request (member)
  submitPaymentRequest: async (paymentData: {
    memberId: string;
    memberName: string;
    amount: number;
    hoursRequested: number;
    paymentProofImage: string | File;
  }): Promise<PaymentRequest | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Handle File upload simulation
    let imageUrl = "https://via.placeholder.com/300";
    if (typeof paymentData.paymentProofImage !== 'string' && paymentData.paymentProofImage instanceof File) {
      // In a real app, we would upload the file to a server
      // Here we just simulate a successful upload
      imageUrl = URL.createObjectURL(paymentData.paymentProofImage);
    } else if (typeof paymentData.paymentProofImage === 'string') {
      imageUrl = paymentData.paymentProofImage;
    }
    
    // Create new payment request
    const newRequest: PaymentRequest = {
      id: Date.now().toString(),
      memberId: paymentData.memberId,
      memberName: paymentData.memberName,
      amount: paymentData.amount,
      hoursRequested: paymentData.hoursRequested,
      requestDate: new Date().toISOString(),
      paymentProofImage: imageUrl,
      status: "pending"
    };
    
    mockPaymentRequests.unshift(newRequest);
    toast.success("Payment request submitted successfully");
    
    return newRequest;
  },
  
  // Approve a payment request (admin)
  approvePaymentRequest: async (paymentId: string, adminId: string): Promise<PaymentRequest | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the payment request
    const requestIndex = mockPaymentRequests.findIndex(request => request.id === paymentId);
    
    if (requestIndex === -1) {
      toast.error("Payment request not found");
      return null;
    }
    
    const request = mockPaymentRequests[requestIndex];
    
    if (request.status !== "pending") {
      toast.error("Payment request already processed");
      return null;
    }
    
    // Update the request
    const updatedRequest: PaymentRequest = {
      ...request,
      status: "approved",
      approvedBy: adminId,
      approvalDate: new Date().toISOString()
    };
    
    mockPaymentRequests[requestIndex] = updatedRequest;
    toast.success(`Payment request from ${request.memberName} approved`);
    
    // In a real app, we would update the member's hours here
    
    return updatedRequest;
  },
  
  // Reject a payment request (admin)
  rejectPaymentRequest: async (paymentId: string, adminId: string): Promise<PaymentRequest | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the payment request
    const requestIndex = mockPaymentRequests.findIndex(request => request.id === paymentId);
    
    if (requestIndex === -1) {
      toast.error("Payment request not found");
      return null;
    }
    
    const request = mockPaymentRequests[requestIndex];
    
    if (request.status !== "pending") {
      toast.error("Payment request already processed");
      return null;
    }
    
    // Update the request
    const updatedRequest: PaymentRequest = {
      ...request,
      status: "rejected",
      approvedBy: adminId,
      approvalDate: new Date().toISOString()
    };
    
    mockPaymentRequests[requestIndex] = updatedRequest;
    toast.error(`Payment request from ${request.memberName} rejected`);
    
    return updatedRequest;
  }
};

export default paymentService;
