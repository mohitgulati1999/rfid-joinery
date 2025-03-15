
export type Role = 'admin' | 'member';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
  phone?: string;
  address?: string;
}

export interface Member extends User {
  role: 'member';
  rfidNumber: string;
  membershipHours: number;
  totalHoursUsed: number;
  membershipPlanId?: string;
  isActive: boolean;
  hoursHistory?: HoursHistoryItem[];
}

export interface Admin extends User {
  role: 'admin';
  position?: string;
  permissions?: {
    manageUsers: boolean;
    manageAttendance: boolean;
    managePayments: boolean;
    manageMemberships: boolean;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  hours: number;
  durationMonths: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface HoursHistoryItem {
  id: string;
  hours: number;
  type: 'added' | 'used';
  date: string;
  notes?: string;
}

export interface PaymentRequest {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  planId?: string;
  planName?: string;
  requestDate: string;
  approvedDate?: string;
  approvedBy?: string;
  hours?: number;
  notes?: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  rfidNumber: string;
  checkInTime: string;
  checkOutTime?: string;
  hoursSpent?: number;
  checkInBy?: string;
  checkOutBy?: string;
  notes?: string;
}
