
import { Member, MembershipPlan, Attendance, PaymentRequest } from "@/types";

// Mock Members
export const mockMembers: Member[] = [
  {
    id: "mem1",
    email: "john@example.com",
    name: "John Doe",
    role: "member",
    phone: "555-123-4567",
    address: "123 Main St, City",
    rfidNumber: "RF123456",
    membershipHours: 50,
    totalHoursUsed: 12,
    isActive: true,
    remainingHours: 38
  },
  {
    id: "mem2",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "member",
    phone: "555-987-6543",
    rfidNumber: "RF654321",
    membershipHours: 30,
    totalHoursUsed: 25,
    isActive: true,
    remainingHours: 5
  },
  {
    id: "mem3",
    email: "mike@example.com",
    name: "Mike Johnson",
    role: "member",
    rfidNumber: "RF789123",
    membershipHours: 20,
    totalHoursUsed: 20,
    isActive: false,
    remainingHours: 0
  },
  {
    id: "mem4",
    email: "sarah@example.com",
    name: "Sarah Williams",
    role: "member",
    phone: "555-456-7890",
    rfidNumber: "RF456789",
    membershipHours: 40,
    totalHoursUsed: 10,
    isActive: true,
    remainingHours: 30
  }
];

// Mock Membership Plans
export const mockMembershipPlans: MembershipPlan[] = [
  {
    id: "plan1",
    name: "Basic",
    description: "Perfect for occasional visitors",
    hoursIncluded: 20,
    pricePerHour: 6,
    totalPrice: 120,
    features: [
      "20 hours of daycare access",
      "Basic amenities",
      "Standard support",
      "Valid for 30 days"
    ]
  },
  {
    id: "plan2",
    name: "Standard",
    description: "Our most popular plan",
    hoursIncluded: 50,
    pricePerHour: 5,
    totalPrice: 250,
    features: [
      "50 hours of daycare access",
      "Premium amenities",
      "Priority support",
      "Valid for 60 days",
      "Flexible scheduling"
    ],
    isPopular: true
  },
  {
    id: "plan3",
    name: "Premium",
    description: "For power users",
    hoursIncluded: 100,
    pricePerHour: 4,
    totalPrice: 400,
    features: [
      "100 hours of daycare access",
      "All premium amenities",
      "24/7 priority support",
      "Valid for 90 days",
      "Flexible scheduling",
      "Guest passes included"
    ]
  }
];

// Mock Attendance Records
export const mockAttendance: Attendance[] = [
  {
    id: "att1",
    memberId: "mem1",
    memberName: "John Doe",
    rfidNumber: "RF123456",
    checkInTime: "2023-06-01T09:00:00",
    checkOutTime: "2023-06-01T11:30:00",
    hoursSpent: 2.5,
    checkInBy: "admin1",
    checkOutBy: "admin1",
    isActive: false
  },
  {
    id: "att2",
    memberId: "mem2",
    memberName: "Jane Smith",
    rfidNumber: "RF654321",
    checkInTime: "2023-06-01T10:00:00",
    checkOutTime: "2023-06-01T14:00:00",
    hoursSpent: 4,
    checkInBy: "admin1",
    checkOutBy: "admin1",
    isActive: false
  },
  {
    id: "att3",
    memberId: "mem1",
    memberName: "John Doe",
    rfidNumber: "RF123456",
    checkInTime: "2023-06-02T09:30:00",
    checkOutTime: "2023-06-02T12:30:00",
    hoursSpent: 3,
    checkInBy: "admin1",
    checkOutBy: "admin1",
    isActive: false
  },
  {
    id: "att4",
    memberId: "mem4",
    memberName: "Sarah Williams",
    rfidNumber: "RF456789",
    checkInTime: "2023-06-02T13:00:00",
    checkOutTime: null,
    hoursSpent: null,
    checkInBy: "admin1",
    isActive: true
  }
];

// Mock Payment Requests
export const mockPaymentRequests: PaymentRequest[] = [
  {
    id: "pay1",
    memberId: "mem1",
    memberName: "John Doe",
    amount: 50,
    hoursRequested: 10,
    requestDate: "2023-05-28T15:30:00",
    paymentProofImage: "https://via.placeholder.com/300",
    status: "approved",
    approvedBy: "admin1",
    approvalDate: "2023-05-29T10:15:00"
  },
  {
    id: "pay2",
    memberId: "mem2",
    memberName: "Jane Smith",
    amount: 75,
    hoursRequested: 15,
    requestDate: "2023-05-30T09:45:00",
    paymentProofImage: "https://via.placeholder.com/300",
    status: "pending"
  },
  {
    id: "pay3",
    memberId: "mem4",
    memberName: "Sarah Williams",
    amount: 25,
    hoursRequested: 5,
    requestDate: "2023-06-01T14:20:00",
    paymentProofImage: "https://via.placeholder.com/300",
    status: "rejected",
    approvedBy: "admin1",
    approvalDate: "2023-06-01T17:30:00"
  }
];
