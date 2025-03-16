
// User and role types
export type Role = "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  profileImage?: string;
  rfidNumber?: string;
  membershipHours?: number;
  totalHoursUsed?: number;
  isActive?: boolean;
  remainingHours?: number;
  membershipPlanId?: string;
  position?: string;
  permissions?: {
    manageUsers?: boolean;
    manageAttendance?: boolean;
    managePayments?: boolean;
    manageMemberships?: boolean;
  };
}

export interface Member extends User {
  rfidNumber: string;
  membershipHours: number;
  totalHoursUsed: number;
  isActive: boolean;
  remainingHours: number;
  membershipPlanId?: string;
}

export interface Admin extends User {
  position?: string;
  permissions: {
    manageUsers: boolean;
    manageAttendance: boolean;
    managePayments: boolean;
    manageMemberships: boolean;
  };
}

// Authentication state type
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
}

// Membership plan type
export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  hoursIncluded: number;
  pricePerHour: number;
  totalPrice: number;
  features: string[];
  isPopular?: boolean;
  duration?: number;
  maxHoursPerDay?: number;
  active?: boolean;
}

// Attendance type
export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  rfidNumber: string;
  checkInTime: string;
  checkOutTime: string | null;
  hoursSpent: number | null;
  isActive: boolean;
  checkInBy?: string;
  checkOutBy?: string;
  notes?: string;
}

// Payment request type
export interface PaymentRequest {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  hoursRequested: number;
  requestDate: string;
  paymentProofImage: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvalDate?: string;
}
