
export type Role = "admin" | "member";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  address?: string;
  profileImage?: string;
  createdAt: Date;
}

export interface Member extends User {
  rfidNumber: string;
  membershipHours: number;
  totalHoursUsed: number;
  membershipPlanId?: string;
  isActive: boolean;
}

export interface Admin extends User {
  position?: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  hoursSpent?: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  hoursIncluded: number;
  pricePerHour: number;
  totalPrice: number;
  features: string[];
  isPopular?: boolean;
}

export interface PaymentRequest {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  hoursRequested: number;
  requestDate: Date;
  paymentProofImage?: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvalDate?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
}
